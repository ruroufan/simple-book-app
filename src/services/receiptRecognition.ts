import type { ReceiptRecognitionResult } from '../types';
import { suggestCategory } from './storeCategoryMemory';

export function extractReceiptFields(text: string): ReceiptRecognitionResult {
  const storeName = extractStoreName(text);
  const suggestion = suggestCategory({
    storeName,
    detectedText: text,
    userMemoryList: [],
  });

  return {
    amount: extractAmount(text),
    date: extractDate(text),
    storeName,
    detectedText: text,
    keywords: extractKeywords(text),
    suggestedCategory: suggestion.category,
    suggestionReason: suggestion.reason,
  };
}

export async function recognizeReceipt(file: File): Promise<ReceiptRecognitionResult> {
  const image = await preprocessReceiptImage(file);
  const text = await runTesseract(image);
  const result = extractReceiptFields(text);

  if (!result.amount && !result.date && !result.storeName) {
    throw new Error('Receipt OCR result is unclear');
  }

  return result;
}

async function runTesseract(image: Blob | File) {
  const { createWorker, PSM } = await import('tesseract.js');
  const worker = await createWorker('jpn+eng', 1, {
    langPath: '/tessdata',
  });

  try {
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SPARSE_TEXT,
      preserve_interword_spaces: '1',
    });
    const {
      data: { text },
    } = await worker.recognize(image);
    return text;
  } finally {
    await worker.terminate();
  }
}

function extractStoreName(text: string) {
  if (/FamilyMart|ファミリーマート|ファミマ/i.test(text)) {
    return 'FamilyMart';
  }
  if (/Lawson|ローソン/i.test(text)) {
    return 'Lawson';
  }
  if (/セブン|セブンイレブン|7-?Eleven/i.test(text)) {
    return '7-Eleven';
  }
  if (/スギ薬局/i.test(text)) {
    return 'スギ薬局';
  }
  if (/マツモトキヨシ/i.test(text)) {
    return 'マツモトキヨシ';
  }
  if (/UNIQLO/i.test(text)) {
    return 'UNIQLO';
  }
  if (/\bGU\b/i.test(text)) {
    return 'GU';
  }
  if (/Amazon|楽天|イオン|ライフ|業務スーパー|JR/i.test(text)) {
    return text.match(/Amazon|楽天|イオン|ライフ|業務スーパー|JR/i)?.[0];
  }
  return undefined;
}

function extractKeywords(text: string) {
  const keywords = [
    'コンビニ',
    '食品',
    '弁当',
    'パン',
    'コーヒー',
    'UNIQLO',
    'GU',
    '服',
    '衣類',
    '靴',
    '電車',
    'バス',
    'タクシー',
    '交通',
    'ガソリン',
    '薬',
    'ドラッグストア',
    '洗剤',
    '日用品',
    'ティッシュ',
    'シャンプー',
  ];
  const normalizedText = text.toUpperCase();
  return keywords.filter((keyword) => normalizedText.includes(keyword.toUpperCase()));
}

function extractAmount(text: string) {
  const normalizedText = normalizeOcrText(text);
  const priorityLabels = ['合計', 'お買上げ金額', '税込'];

  for (const label of priorityLabels) {
    const amount = findAmountNearLabel(normalizedText, label);
    if (amount) {
      return amount;
    }
  }

  const amounts = extractAllAmounts(normalizedText).filter((amount) => amount >= 100);
  return amounts.length > 0 ? amounts[amounts.length - 1] : undefined;
}

function findAmountNearLabel(text: string, label: string) {
  const labelIndex = text.indexOf(label);
  if (labelIndex < 0) {
    return undefined;
  }

  const textAfterLabel = text.slice(labelIndex, labelIndex + 80);
  return extractAllAmounts(textAfterLabel)[0];
}

function extractAllAmounts(text: string) {
  const matches = text.match(/[¥￥]?\s*\d{1,3}(?:,\d{3})+|[¥￥]\s*\d+|\b\d{3,7}\b/g) ?? [];
  return matches
    .map((match) => Number(match.replace(/[¥￥,\s]/g, '')))
    .filter((amount) => Number.isFinite(amount) && amount > 0);
}

function extractDate(text: string) {
  const normalizedText = normalizeOcrText(text);
  const fullDate = normalizedText.match(/\b(20\d{2})[\/.-](\d{1,2})[\/.-](\d{1,2})\b/);
  if (fullDate) {
    return toDateString(Number(fullDate[1]), Number(fullDate[2]), Number(fullDate[3]));
  }

  const shortDate = normalizedText.match(/\b(\d{2})[\/.-](\d{1,2})[\/.-](\d{1,2})\b/);
  if (shortDate) {
    return toDateString(2000 + Number(shortDate[1]), Number(shortDate[2]), Number(shortDate[3]));
  }

  const monthDay = normalizedText.match(/(^|[^\d])(\d{1,2})月\s*(\d{1,2})日/);
  if (monthDay) {
    return toDateString(new Date().getFullYear(), Number(monthDay[2]), Number(monthDay[3]));
  }

  return undefined;
}

function toDateString(year: number, month: number, day: number) {
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return undefined;
  }

  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return undefined;
  }

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function normalizeOcrText(text: string) {
  return text.replace(/[，、]/g, ',').replace(/[：]/g, ':').replace(/\s+/g, ' ');
}

async function preprocessReceiptImage(file: File) {
  const imageBitmap = await createImageBitmap(file);
  const scale = Math.min(2, Math.max(1, 1800 / imageBitmap.width));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(imageBitmap.width * scale);
  canvas.height = Math.round(imageBitmap.height * scale);

  const context = canvas.getContext('2d');
  if (!context) {
    return file;
  }

  context.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < imageData.data.length; index += 4) {
    const red = imageData.data[index];
    const green = imageData.data[index + 1];
    const blue = imageData.data[index + 2];
    const gray = red * 0.299 + green * 0.587 + blue * 0.114;
    const contrasted = gray > 155 ? 255 : Math.max(0, gray - 20);
    imageData.data[index] = contrasted;
    imageData.data[index + 1] = contrasted;
    imageData.data[index + 2] = contrasted;
  }

  context.putImageData(imageData, 0, 0);

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob ?? file), 'image/png');
  });
}
