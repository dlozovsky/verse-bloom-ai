import JSZip from 'jszip';
import Papa from 'papaparse';
import { supabase } from '@/integrations/supabase/client';

interface PoetryRow {
  Title: string;
  Poet: string;
  Poem: string;
  Tags?: string;
}

export const loadPoetryData = async (file: File) => {
  try {
    // Read the ZIP file
    const zip = await JSZip.loadAsync(file);
    
    // Get the CSV file
    const csvFile = zip.file('PoetryFoundationData.csv');
    if (!csvFile) {
      throw new Error('CSV file not found in archive');
    }
    
    // Extract CSV content
    const csvText = await csvFile.async('text');
    
    // Parse CSV
    const parsed = Papa.parse<PoetryRow>(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    
    console.log(`Found ${parsed.data.length} poems to process`);
    
    let addedPoems = 0;
    let addedPoets = 0;
    const processedPoets = new Map<string, string>(); // poet name -> poet id
    
    // Process in batches to avoid overwhelming the database
    const batchSize = 50;
    for (let i = 0; i < parsed.data.length; i += batchSize) {
      const batch = parsed.data.slice(i, i + batchSize);
      
      for (const row of batch) {
        if (!row.Title || !row.Poet || !row.Poem) continue;
        
        try {
          // Check if poet exists or create new one
          let poetId = processedPoets.get(row.Poet);
          
          if (!poetId) {
            // Check database first
            const { data: existingPoet } = await supabase
              .from('poets')
              .select('id')
              .ilike('name', row.Poet)
              .single();
            
            if (existingPoet) {
              poetId = existingPoet.id;
            } else {
              // Create new poet
              const { data: newPoet, error: poetError } = await supabase
                .from('poets')
                .insert({
                  name: row.Poet,
                  bio: `Poet featured in Poetry Foundation collection`,
                })
                .select('id')
                .single();
              
              if (poetError) throw poetError;
              poetId = newPoet.id;
              addedPoets++;
            }
            
            processedPoets.set(row.Poet, poetId);
          }
          
          // Check if poem already exists
          const { data: existingPoem } = await supabase
            .from('poems')
            .select('id')
            .eq('title', row.Title)
            .eq('poet_id', poetId)
            .single();
          
          if (!existingPoem) {
            // Add the poem
            const { error: poemError } = await supabase
              .from('poems')
              .insert({
                title: row.Title,
                body: row.Poem,
                poet_id: poetId,
              });
            
            if (poemError) throw poemError;
            addedPoems++;
          }
        } catch (error) {
          console.error(`Error processing poem "${row.Title}":`, error);
        }
      }
      
      console.log(`Processed ${Math.min(i + batchSize, parsed.data.length)}/${parsed.data.length} poems`);
    }
    
    return {
      success: true,
      addedPoems,
      addedPoets,
      totalProcessed: parsed.data.length,
    };
  } catch (error) {
    console.error('Error loading poetry data:', error);
    throw error;
  }
};
