// Server-seitige User-Agent-Erkennung für KI-Crawler und Such-Bots.
//
// Wird genutzt, um auf Bot-Requests Cookie-Banner und Tracking-Skripte
// zu unterdrücken – KI-Tools wie GPTBot oder PerplexityBot werten den
// Banner sonst u. U. als Cookie-Wall und überspringen den Content.

const BOT_PATTERNS = [
  // KI- / LLM-Crawler
  "gptbot",            // OpenAI training crawler
  "chatgpt-user",      // ChatGPT real-time browsing
  "oai-searchbot",     // OpenAI Search
  "claudebot",         // Anthropic
  "claude-web",
  "anthropic-ai",
  "perplexitybot",     // Perplexity training
  "perplexity-user",   // Perplexity real-time
  "google-extended",   // Bard / Gemini training
  "ccbot",             // Common Crawl (used by many LLMs)
  "bytespider",        // ByteDance / Doubao
  "applebot-extended", // Apple Intelligence
  "meta-externalagent",
  "facebookbot",
  "bingbot",           // klassisches Bing + Copilot
  "duckduckbot",
  "yandexbot",
  "baiduspider",

  // Klassische Such-Bots (sollen Tracking-Skripte ebenfalls nicht laden)
  "googlebot",
  "applebot",
  "ahrefsbot",
  "semrushbot",
  "moz.com",
  "screaming frog",
];

export function isBotUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some((p) => ua.includes(p));
}

/**
 * Liste der KI-Bot-User-Agents für die robots.txt – gleicher Pool wie oben,
 * aber in Original-Schreibweise wie sie in robots.txt-Konventionen üblich ist.
 */
export const AI_BOT_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "Bytespider",
  "Applebot-Extended",
  "Meta-ExternalAgent",
  "FacebookBot",
];
