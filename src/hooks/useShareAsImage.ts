import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export const useShareAsImage = () => {
  const { toast } = useToast();

  const shareAsImage = useCallback(async (title: string, poet: string, body: string) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#4a1020");
    gradient.addColorStop(1, "#6b1d34");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative top line
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(80, 120, width - 160, 2);

    // Title
    ctx.fillStyle = "#f5d0a9";
    ctx.font = "bold 52px Georgia, serif";
    ctx.textAlign = "center";
    const titleLines = wrapText(ctx, title, width - 160, 52);
    let y = 200;
    titleLines.forEach(line => {
      ctx.fillText(line, width / 2, y);
      y += 64;
    });

    // Poet
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "italic 32px Georgia, serif";
    ctx.fillText(`by ${poet}`, width / 2, y + 20);
    y += 80;

    // Poem body (truncated)
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "28px Georgia, serif";
    ctx.textAlign = "left";
    const poemLines = body.split("\n").slice(0, 16);
    poemLines.forEach(line => {
      if (y < height - 200) {
        const wrapped = wrapText(ctx, line || " ", width - 200, 28);
        wrapped.forEach(wl => {
          if (y < height - 200) {
            ctx.fillText(wl, 100, y);
            y += 38;
          }
        });
      }
    });

    if (body.split("\n").length > 16) {
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "italic 24px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("...", width / 2, y + 20);
    }

    // Decorative bottom line
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(80, height - 130, width - 160, 2);

    // Branding
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "24px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("Poetry Hub", width / 2, height - 80);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      if (navigator.share && navigator.canShare?.({ files: [new File([blob], "poem.png", { type: "image/png" })] })) {
        try {
          await navigator.share({
            title: `${title} by ${poet}`,
            text: `Read "${title}" by ${poet} on Poetry Hub`,
            files: [new File([blob], "poem.png", { type: "image/png" })],
          });
          return;
        } catch {
          // User cancelled or share failed, fall through to download
        }
      }

      // Fallback: download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Image Downloaded", description: "Share it on your favorite social platform!" });
    }, "image/png");
  }, [toast]);

  return { shareAsImage };
};

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, fontSize: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines.length ? lines : [" "];
}
