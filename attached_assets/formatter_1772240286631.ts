import mammoth from "mammoth";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  convertInchesToTwip,
  LevelFormat,
  ISectionOptions,
} from "docx";

interface InlineRun {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

interface ParsedElement {
  type:
    | "title"
    | "subtitle"
    | "question"
    | "answer"
    | "body"
    | "bullet"
    | "numbered";
  text: string;
  level?: number;
  runs: InlineRun[];
}

const TITLE_KEYWORDS = [
  "executive summary", "introduction", "conclusion", "overview",
  "background", "methodology", "results", "discussion",
  "recommendations", "appendix", "references", "table of contents",
  "acknowledgments", "abstract", "scope", "objectives", "goals",
  "mission", "vision", "strategy", "action plan", "budget",
  "timeline", "milestones", "deliverables", "stakeholders",
  "risk assessment", "swot analysis", "market analysis",
  "financial summary", "operational plan", "human resources",
  "technology", "infrastructure", "compliance", "legal",
  "governance", "performance metrics", "kpis", "investor",
  "marketing", "global strategy", "sales", "operations",
  "management", "team", "company", "product", "service",
  "pricing", "competition", "target market", "customer",
  "revenue", "profit", "loss", "cash flow", "balance sheet",
  "income statement", "information", "investors information",
  "marketing and global strategy",
];

const QUESTION_PATTERN = /^(\d+[\.\)]\s*|Q[\.\:\)]\s*|question\s*[\.\:\)]*\s*)/i;

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function stripTags(html: string): string {
  return decodeHtmlEntities(html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "")).trim();
}

function extractInlineRuns(html: string): InlineRun[] {
  const cleaned = html.replace(/<br\s*\/?>/gi, " ");
  const segments: { text: string; bold: boolean; italic: boolean; underline: boolean }[] = [];

  const tokenRegex = /<(\/?)(\w+)[^>]*>|([^<]+)/g;
  let tokenMatch;
  let boldStack = 0;
  let italicStack = 0;
  let underlineStack = 0;

  while ((tokenMatch = tokenRegex.exec(cleaned)) !== null) {
    const [, closing, tag, text] = tokenMatch;
    const tagLower = (tag || "").toLowerCase();

    if (text) {
      const decoded = decodeHtmlEntities(text);
      if (decoded.trim() || decoded.includes(" ")) {
        segments.push({
          text: decoded,
          bold: boldStack > 0,
          italic: italicStack > 0,
          underline: underlineStack > 0,
        });
      }
    } else if (tagLower === "strong" || tagLower === "b") {
      if (closing) boldStack = Math.max(0, boldStack - 1);
      else boldStack++;
    } else if (tagLower === "em" || tagLower === "i") {
      if (closing) italicStack = Math.max(0, italicStack - 1);
      else italicStack++;
    } else if (tagLower === "u") {
      if (closing) underlineStack = Math.max(0, underlineStack - 1);
      else underlineStack++;
    }
  }

  if (segments.length === 0) {
    const plainText = stripTags(html);
    if (plainText) {
      return [{ text: plainText }];
    }
    return [];
  }

  const merged: InlineRun[] = [];
  for (const seg of segments) {
    const last = merged[merged.length - 1];
    if (last && last.bold === seg.bold && last.italic === seg.italic && last.underline === seg.underline) {
      last.text += seg.text;
    } else {
      merged.push({
        text: seg.text,
        bold: seg.bold || undefined,
        italic: seg.italic || undefined,
        underline: seg.underline || undefined,
      });
    }
  }

  return merged.filter(r => r.text.trim().length > 0 || r.text.includes(" "));
}

function isEntirelyBold(runs: InlineRun[]): boolean {
  if (runs.length === 0) return false;
  return runs.every(r => r.bold);
}

function classifyElement(
  text: string,
  tagName: string,
  runs: InlineRun[],
  previousType: string | null,
): ParsedElement["type"] {
  const trimmed = text.trim();
  if (!trimmed) return "body";

  if (tagName === "h1" || tagName === "h2") return "title";
  if (tagName === "h3" || tagName === "h4" || tagName === "h5" || tagName === "h6") return "subtitle";

  const isBold = isEntirelyBold(runs);
  const isQuestionLike = QUESTION_PATTERN.test(trimmed) || trimmed.endsWith("?");
  const lowerTrimmed = trimmed.toLowerCase();
  const isShortLine = trimmed.length < 80;
  const isTitleKeyword = TITLE_KEYWORDS.some(kw => lowerTrimmed === kw || lowerTrimmed.includes(kw));
  const endsWithPunctuation = /[.!;,:]$/.test(trimmed);

  if (isQuestionLike) return "question";
  if (previousType === "question") return "answer";

  if (isBold && isShortLine && isTitleKeyword) return "title";

  if (isBold && isShortLine && !endsWithPunctuation && trimmed.length < 60) {
    if (previousType === "title") return "subtitle";
    return "title";
  }

  if (previousType === "answer" && !isQuestionLike && !isBold) return "answer";

  return "body";
}

function parseHtmlToElements(html: string): ParsedElement[] {
  const elements: ParsedElement[] = [];
  const allBlocks: { tag: string; content: string; index: number; insideOl: boolean }[] = [];

  const olRegex = /<ol[^>]*>([\s\S]*?)<\/ol>/gi;
  const olRanges: { start: number; end: number }[] = [];
  let olMatch;
  while ((olMatch = olRegex.exec(html)) !== null) {
    olRanges.push({ start: olMatch.index, end: olMatch.index + olMatch[0].length });
  }

  function isInsideOl(index: number): boolean {
    return olRanges.some(r => index >= r.start && index < r.end);
  }

  const blockRegex = /<(h[1-6]|p|li)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = blockRegex.exec(html)) !== null) {
    allBlocks.push({
      tag: match[1].toLowerCase(),
      content: match[2],
      index: match.index,
      insideOl: match[1].toLowerCase() === "li" && isInsideOl(match.index),
    });
  }

  if (allBlocks.length === 0) {
    const lines = html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed) {
        elements.push({ type: "body", text: trimmed, runs: [{ text: trimmed }] });
      }
    }
    return elements;
  }

  let previousType: string | null = null;

  for (const block of allBlocks) {
    const textContent = stripTags(block.content);
    if (!textContent) continue;

    const runs = extractInlineRuns(block.content);

    if (block.tag === "li" && !block.insideOl) {
      elements.push({ type: "bullet", text: textContent, runs, level: 0 });
      previousType = "bullet";
      continue;
    }

    if (block.tag === "li" && block.insideOl) {
      elements.push({ type: "numbered", text: textContent, runs, level: 0 });
      previousType = "numbered";
      continue;
    }

    const type = classifyElement(textContent, block.tag, runs, previousType);
    elements.push({ type, text: textContent, runs });
    previousType = type;
  }

  return elements;
}

function createFormattedParagraph(element: ParsedElement): Paragraph {
  const CALIBRI = "Calibri";

  const makeRuns = (overrideBold: boolean | undefined, fontSize: number): TextRun[] => {
    if (element.runs.length === 0) {
      return [new TextRun({ text: element.text, bold: overrideBold, size: fontSize, font: CALIBRI })];
    }
    return element.runs.map(r => new TextRun({
      text: r.text,
      bold: overrideBold !== undefined ? overrideBold : (r.bold || false),
      italic: r.italic || false,
      underline: r.underline ? {} : undefined,
      size: fontSize,
      font: CALIBRI,
    }));
  };

  switch (element.type) {
    case "title":
      return new Paragraph({
        children: makeRuns(true, 28),
        spacing: { before: 360, after: 200, line: 276 },
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.LEFT,
      });

    case "subtitle":
      return new Paragraph({
        children: makeRuns(true, 24),
        spacing: { before: 240, after: 120, line: 276 },
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.LEFT,
      });

    case "question":
      return new Paragraph({
        children: makeRuns(true, 24),
        spacing: { before: 200, after: 40, line: 240 },
        alignment: AlignmentType.JUSTIFIED,
      });

    case "answer":
      return new Paragraph({
        children: makeRuns(false, 24),
        spacing: { before: 40, after: 200, line: 240 },
        alignment: AlignmentType.JUSTIFIED,
      });

    case "bullet":
      return new Paragraph({
        children: makeRuns(false, 24),
        bullet: { level: element.level || 0 },
        spacing: { before: 60, after: 60, line: 276 },
        alignment: AlignmentType.JUSTIFIED,
        indent: {
          left: convertInchesToTwip(0.5),
          hanging: convertInchesToTwip(0.25),
        },
      });

    case "numbered":
      return new Paragraph({
        children: makeRuns(false, 24),
        numbering: { reference: "default-numbering", level: element.level || 0 },
        spacing: { before: 60, after: 60, line: 276 },
        alignment: AlignmentType.JUSTIFIED,
        indent: {
          left: convertInchesToTwip(0.5),
          hanging: convertInchesToTwip(0.25),
        },
      });

    case "body":
    default:
      return new Paragraph({
        children: makeRuns(false, 24),
        spacing: { before: 80, after: 80, line: 276 },
        alignment: AlignmentType.JUSTIFIED,
      });
  }
}

export async function formatDocument(buffer: Buffer): Promise<ArrayBuffer> {
  const result = await mammoth.convertToHtml({ buffer });
  const html = result.value;

  let elements = parseHtmlToElements(html);
  elements = elements.filter(el => el.text.trim().length > 0);

  if (elements.length === 0) {
    elements.push({
      type: "body",
      text: "(This document appears to be empty)",
      runs: [{ text: "(This document appears to be empty)" }],
    });
  }

  const paragraphs = elements.map(createFormattedParagraph);

  const sectionProperties: ISectionOptions = {
    properties: {
      page: {
        margin: {
          top: convertInchesToTwip(1),
          right: convertInchesToTwip(1),
          bottom: convertInchesToTwip(1),
          left: convertInchesToTwip(1),
        },
      },
    },
    children: paragraphs,
  };

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 24,
          },
          paragraph: {
            spacing: { line: 276 },
            alignment: AlignmentType.JUSTIFIED,
          },
        },
      },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          run: { font: "Calibri", size: 28, bold: true },
          paragraph: { spacing: { before: 360, after: 200 }, alignment: AlignmentType.LEFT },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          run: { font: "Calibri", size: 24, bold: true },
          paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.LEFT },
        },
      ],
    },
    numbering: {
      config: [
        {
          reference: "default-numbering",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.START,
            },
          ],
        },
      ],
    },
    sections: [sectionProperties],
  });

  return await Packer.toBuffer(doc);
}
