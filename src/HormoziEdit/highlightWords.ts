// Curated keyword emphasis, matching devinjatho's caption style: most words
// stay lowercase/plain white, but a handful of key terms get capitalized and
// colored (red for warnings/negatives, green for the payoff/key concept) -
// same red/green accents used across the rest of the edit.
export const HIGHLIGHT_RED = "#FF4D4D";
export const HIGHLIGHT_GREEN = "#39FF88";

export const normalizeWord = (raw: string): string =>
  raw
    .trim()
    .toLowerCase()
    .replace(/[.,;:!?¡¿"']/g, "");

const RED_WORDS = new Set([
  "capullo",
  "quejar",
  "errores",
  "no",
  "funciona",
  "frustración",
  "mal",
  "hambre",
]);

const GREEN_WORDS = new Set([
  "zona",
  "grasa",
  "inteligente",
  "sensato",
  "útil",
  "perfecta",
  "máquina",
  "cuerpo",
]);

export const getHighlightColor = (rawWord: string): string | null => {
  const word = normalizeWord(rawWord);
  if (RED_WORDS.has(word)) return HIGHLIGHT_RED;
  if (GREEN_WORDS.has(word)) return HIGHLIGHT_GREEN;
  return null;
};
