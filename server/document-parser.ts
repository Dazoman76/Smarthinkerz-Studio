import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ParsedLesson {
  dayNumber: number;
  topic: string;
  description: string;
}

function splitByDayBoundaries(content: string, maxChunkSize: number): string[] {
  if (content.length <= maxChunkSize) {
    return [content];
  }

  const chunks: string[] = [];
  const dayPattern = /(?=\nDay\s+\d+[\s—\-–:])/gi;
  const parts = content.split(dayPattern);

  let currentChunk = "";
  for (const part of parts) {
    if (currentChunk.length + part.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = part;
    } else {
      currentChunk += part;
    }
  }
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

export async function parseDocumentToLessons(content: string): Promise<ParsedLesson[]> {
  const maxChunkSize = 40000;
  const chunks = splitByDayBoundaries(content, maxChunkSize);

  console.log(`Document parsing: ${content.length} chars split into ${chunks.length} chunks`);

  const allLessons: ParsedLesson[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const chunkInfo = chunks.length > 1 ? ` (Part ${i + 1} of ${chunks.length})` : "";

    console.log(`Parsing chunk ${i + 1}/${chunks.length} (${chunk.length} chars)...`);

    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a document parser that extracts lesson information from educational documents. 
Extract each lesson/day from the document and return a JSON array of lessons.
Each lesson must have: dayNumber (integer), topic (short title, max 80 chars), description (1-2 sentence summary, max 200 chars).
If the document has numbered days/lessons/units/chapters/modules/sessions, preserve those numbers.
If not numbered, assign sequential day numbers starting from 1.
Be thorough - extract EVERY lesson mentioned in the document. Do not skip any.
Return ONLY a valid JSON array, no markdown code fences, no other text.`
            },
            {
              role: "user",
              content: `Extract all lessons from this document${chunkInfo}:\n\n${chunk}`
            }
          ],
          max_completion_tokens: 16384,
        });

        const responseText = response.choices[0]?.message?.content || "[]";

        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed)) {
            for (const lesson of parsed) {
              if (lesson.dayNumber && lesson.topic) {
                allLessons.push({
                  dayNumber: Number(lesson.dayNumber),
                  topic: String(lesson.topic).substring(0, 100),
                  description: String(lesson.description || lesson.topic).substring(0, 500),
                });
              }
            }
          }
          console.log(`Chunk ${i + 1}: extracted ${parsed.length} lessons`);
          break;
        } else {
          console.error(`Chunk ${i + 1}: no JSON array found in response (attempt ${attempt})`);
          console.error(`Response preview: ${responseText.substring(0, 200)}`);
          if (attempt === maxRetries) break;
        }
      } catch (error: any) {
        console.error(`Error parsing chunk ${i + 1} (attempt ${attempt}):`, error.message);
        if (error.status) console.error(`HTTP status: ${error.status}`);
        if (attempt < maxRetries && (error.status === 429 || error.status === 500 || error.status === 503)) {
          const waitTime = attempt * 5000;
          console.log(`Rate limited or server error, waiting ${waitTime / 1000}s before retry...`);
          await new Promise(r => setTimeout(r, waitTime));
        } else if (attempt === maxRetries) {
          break;
        }
      }
    }
  }

  allLessons.sort((a, b) => a.dayNumber - b.dayNumber);

  const seen = new Set<number>();
  const unique = allLessons.filter(l => {
    if (seen.has(l.dayNumber)) return false;
    seen.add(l.dayNumber);
    return true;
  });

  console.log(`Total unique lessons extracted: ${unique.length}`);
  return unique;
}

export async function extractTextFromFile(filePath: string, mimeType: string): Promise<string> {
  if (mimeType === "application/pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  if (mimeType === "text/plain" || mimeType === "text/csv" || mimeType === "text/markdown") {
    return fs.readFileSync(filePath, "utf-8");
  }

  return fs.readFileSync(filePath, "utf-8");
}
