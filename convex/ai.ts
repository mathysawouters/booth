const OPENAI_URL = "https://api.openai.com/v1";
const TEXT_MODEL = "gpt-6.1-terra";
const IMAGE_MODEL = "gpt-image-2.5-flare";

type InputContent =
  | { type: "input_text"; text: string }
  | { type: "input_image"; image_url: string };

async function callOpenAI(path: string, body: object, timeoutMs: number): Promise<unknown> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return null;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${OPENAI_URL}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) {
      console.warn(`OpenAI ${path} failed with status ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn(`OpenAI ${path} failed: ${String(error)}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function outputText(data: unknown): string | null {
  const output = (data as { output?: { content?: { type?: string; text?: string }[] }[] } | null)
    ?.output;
  if (!Array.isArray(output)) {
    return null;
  }
  for (const item of output) {
    for (const part of item.content ?? []) {
      if (part.type === "output_text" && typeof part.text === "string") {
        return part.text;
      }
    }
  }
  return null;
}

export async function openaiJson(
  instructions: string,
  input: string,
  name: string,
  schema: object,
): Promise<unknown> {
  const data = await callOpenAI(
    "/responses",
    {
      model: TEXT_MODEL,
      reasoning: { effort: "low" },
      instructions,
      input,
      text: { format: { type: "json_schema", name, strict: true, schema } },
    },
    90_000,
  );
  const text = outputText(data);
  if (text === null) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function openaiText(
  instructions: string,
  content: InputContent[],
): Promise<string | null> {
  const data = await callOpenAI(
    "/responses",
    {
      model: TEXT_MODEL,
      reasoning: { effort: "low" },
      instructions,
      input: [{ role: "user", content }],
    },
    60_000,
  );
  return outputText(data)?.trim() || null;
}

export async function openaiImage(prompt: string): Promise<Blob | null> {
  const data = await callOpenAI(
    "/images/generations",
    { model: IMAGE_MODEL, prompt, size: "1024x1024", n: 1 },
    150_000,
  );
  const b64 = (data as { data?: { b64_json?: string }[] } | null)?.data?.[0]?.b64_json;
  if (typeof b64 !== "string") {
    return null;
  }
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: "image/png" });
}
