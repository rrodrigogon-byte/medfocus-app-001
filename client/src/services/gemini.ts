/**
 * Legacy gemini.ts — now delegates to tRPC server-side LLM
 * Kept for backward compatibility with any remaining imports.
 * All AI calls now go through the server via tRPC mutations.
 */

// These functions are no longer used directly.
// AcademicGuide now uses trpc.ai.generateContent and trpc.ai.research mutations.
// Keeping stubs to prevent import errors from other files.

export async function generateDeepContent(_subject: string, _universityName: string, _year: number) {
  throw new Error('DEPRECATED: Use trpc.ai.generateContent mutation instead');
}

export async function fetchGlobalResearch(_topic: string) {
  throw new Error('DEPRECATED: Use trpc.ai.research mutation instead');
}

export async function askMedGenie(_message: string) {
  throw new Error('DEPRECATED: Use trpc.ai.chat mutation instead');
}
