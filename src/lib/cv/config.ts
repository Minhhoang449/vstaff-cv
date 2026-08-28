import "server-only";

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

export function getOpenAiConfig() {
  const apiKey =
    process.env.OPENROUTER_API_KEY?.trim() ||
    process.env.OPENAI_API_KEY?.trim() ||
    "";
  const isOpenRouter =
    apiKey.startsWith("sk-or-") ||
    Boolean(process.env.OPENROUTER_API_KEY?.trim()) ||
    process.env.OPENAI_BASE_URL?.includes("openrouter");

  const baseURL =
    process.env.OPENAI_BASE_URL?.trim() ||
    (isOpenRouter ? OPENROUTER_BASE : undefined);

  const defaultModel = isOpenRouter
    ? "deepseek/deepseek-v4-flash"
    : "gpt-4o";

  return {
    apiKey,
    model: process.env.OPENAI_VISION_MODEL?.trim() || defaultModel,
    baseURL,
    isOpenRouter,
  };
}

export function isOpenAiConfigured() {
  return Boolean(getOpenAiConfig().apiKey);
}
