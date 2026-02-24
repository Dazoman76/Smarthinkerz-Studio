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

export async function parseDocumentToLessons(content: string): Promise<ParsedLesson[]> {
  const maxChunkSize = 12000;
  const chunks: string[] = [];

  if (content.length <= maxChunkSize) {
    chunks.push(content);
  } else {
    for (let i = 0; i < content.length; i += maxChunkSize) {
      chunks.push(content.slice(i, i + maxChunkSize));
    }
  }

  const allLessons: ParsedLesson[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const chunkInfo = chunks.length > 1 ? ` (Part ${i + 1} of ${chunks.length})` : "";

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a document parser that extracts lesson information from educational documents. 
Extract each lesson/day from the document and return a JSON array of lessons.
Each lesson must have: dayNumber (integer), topic (short title), description (1-2 sentence summary).
If the document has numbered days/lessons, preserve those numbers.
If not numbered, assign sequential day numbers starting from 1.
Be thorough - extract EVERY lesson mentioned in the document.
Return ONLY valid JSON array, no other text.`
          },
          {
            role: "user",
            content: `Extract all lessons from this document${chunkInfo}:\n\n${chunk}`
          }
        ],
        max_completion_tokens: 8192,
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
                topic: String(lesson.topic),
                description: String(lesson.description || lesson.topic),
              });
            }
          }
        }
      }
    } catch (error: any) {
      console.error(`Error parsing chunk ${i + 1}:`, error.message);
    }
  }

  allLessons.sort((a, b) => a.dayNumber - b.dayNumber);

  const seen = new Set<number>();
  const unique = allLessons.filter(l => {
    if (seen.has(l.dayNumber)) return false;
    seen.add(l.dayNumber);
    return true;
  });

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
