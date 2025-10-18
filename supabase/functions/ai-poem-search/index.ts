import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, type } = await req.json(); // type can be 'poem' or 'poet'
    console.log('AI Poem Search:', { query, type });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // First, search the database
    if (type === 'poem') {
      const { data: existingPoems } = await supabase
        .from('poems')
        .select('*, poets(name), poem_themes(themes(name))')
        .ilike('title', `%${query}%`)
        .limit(5);

      if (existingPoems && existingPoems.length > 0) {
        console.log('Found existing poems:', existingPoems.length);
        return new Response(
          JSON.stringify({ 
            found: true, 
            source: 'database',
            results: existingPoems 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else if (type === 'poet') {
      const { data: existingPoets } = await supabase
        .from('poets')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(5);

      if (existingPoets && existingPoets.length > 0) {
        console.log('Found existing poets:', existingPoets.length);
        return new Response(
          JSON.stringify({ 
            found: true, 
            source: 'database',
            results: existingPoets 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // If not found in database, use AI to generate/find
    console.log('Not found in database, using AI...');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const systemPrompt = type === 'poem' 
      ? `You are a poetry expert. When given a search query, provide accurate information about real, famous poems. 

If the query is a POET'S NAME (like "Pushkin", "Shakespeare", "Frost"), return one of their most famous poems.
If the query is a POEM TITLE, return that specific poem.

ALWAYS return a complete, real poem with at least 8-12 lines. Include the poet's name, publication year if known, and theme. Format as JSON:
{
  "title": "poem title",
  "poet": "full poet name",
  "year": year or null,
  "body": "complete poem text with line breaks (\\n) - at least 8-12 lines",
  "theme": "main theme (Love, Nature, Philosophy, or Life & Choices)",
  "bio": "brief poet bio (2-3 sentences)"
}

IMPORTANT: If given a poet name, choose their most famous work. Never refuse - always return a real, famous poem.`
      : `You are a poetry expert. When asked about a poet, provide accurate biographical information about real, famous poets. Format your response as JSON with this structure:
{
  "name": "poet full name",
  "birth_year": year or null,
  "death_year": year or null,
  "nationality": "nationality",
  "bio": "comprehensive biography (3-4 sentences)"
}
Only return information about poets that actually existed. If you're not sure, say so.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Tell me about: ${query}` }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    console.log('AI Response:', aiContent);

    // Parse AI response
    let parsedData;
    try {
      // Extract JSON from response (might be wrapped in markdown code blocks)
      const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/) || aiContent.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiContent;
      parsedData = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      return new Response(
        JSON.stringify({ 
          found: false, 
          message: 'AI could not find reliable information about this query.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Add to database
    if (type === 'poem' && parsedData.title && parsedData.poet && parsedData.body) {
      // First, ensure poet exists
      let { data: poet } = await supabase
        .from('poets')
        .select('id')
        .ilike('name', parsedData.poet)
        .single();

      if (!poet) {
        const { data: newPoet } = await supabase
          .from('poets')
          .insert({
            name: parsedData.poet,
            bio: parsedData.bio || null,
          })
          .select()
          .single();
        poet = newPoet;
      }

      if (poet) {
        // Insert poem
        const { data: newPoem } = await supabase
          .from('poems')
          .insert({
            title: parsedData.title,
            body: parsedData.body,
            poet_id: poet.id,
            year_published: parsedData.year || null,
          })
          .select('*, poets(name)')
          .single();

        // Link to theme
        if (parsedData.theme) {
          const { data: theme } = await supabase
            .from('themes')
            .select('id')
            .ilike('name', parsedData.theme)
            .single();

          if (theme && newPoem) {
            await supabase
              .from('poem_themes')
              .insert({
                poem_id: newPoem.id,
                theme_id: theme.id,
              });
          }
        }

        console.log('Successfully added new poem to database');
        return new Response(
          JSON.stringify({ 
            found: true, 
            source: 'ai',
            added: true,
            results: [newPoem]
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else if (type === 'poet' && parsedData.name) {
      const { data: newPoet } = await supabase
        .from('poets')
        .insert({
          name: parsedData.name,
          birth_year: parsedData.birth_year || null,
          death_year: parsedData.death_year || null,
          nationality: parsedData.nationality || null,
          bio: parsedData.bio || null,
        })
        .select()
        .single();

      console.log('Successfully added new poet to database');
      return new Response(
        JSON.stringify({ 
          found: true, 
          source: 'ai',
          added: true,
          results: [newPoet]
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        found: false, 
        message: 'Could not generate valid data from AI response.' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-poem-search:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
