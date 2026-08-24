// Voice synthesis engine supporting OmniRoute Audio & ElevenLabs.
// Runs on the HARNESS, never the renderer.

const OMNIROUTE_API = process.env.OMB_OMNIROUTE_API || "http://100.120.12.123:20300/v1";
const ELEVENLABS_API = process.env.OMB_ELEVENLABS_API || "https://api.elevenlabs.io/v1";

export interface Voice {
  id: string;
  label: string;
  description?: string;
}

export interface Audio {
  bytes: Uint8Array;
  mime: string;
}

export type VerifyResult = { ok: true } | { ok: false; message: string };

const DEFAULT_OMNI_VOICES: Voice[] = [
  { id: "alloy", label: "Alloy (OmniRoute)", description: "Natural · Neutral" },
  { id: "echo", label: "Echo (OmniRoute)", description: "Warm · Balanced" },
  { id: "fable", label: "Fable (OmniRoute)", description: "Expressive · Clear" },
  { id: "onyx", label: "Onyx (OmniRoute)", description: "Deep · Authoritative" },
  { id: "nova", label: "Nova (OmniRoute)", description: "Energetic · Bright" },
  { id: "shimmer", label: "Shimmer (OmniRoute)", description: "Soft · Gentle" },
  { id: "sonic-multilingual", label: "Cartesia Sonic (OmniRoute)", description: "Ultra-Low Latency · Multilingual" },
  { id: "brian", label: "Brian (Audio Combo)", description: "Narrative · Dynamic" },
  { id: "rachel", label: "Rachel (Audio Combo)", description: "Calm · Conversational" }
];

export async function verifyKey(key: string): Promise<VerifyResult> {
  if (key.startsWith("sk-")) {
    // OmniRoute / OpenAI compatible key
    return { ok: true };
  }
  try {
    const res = await fetch(`${ELEVENLABS_API}/voices`, {
      headers: { "xi-api-key": key },
      signal: AbortSignal.timeout(10_000),
    });
    if (res.ok) return { ok: true };
    return { ok: false, message: "ElevenLabs rejected that key." };
  } catch {
    return { ok: false, message: "Couldn't reach voice server to check key." };
  }
}

export async function listVoices(key: string): Promise<Voice[]> {
  if (key.startsWith("sk-")) {
    return DEFAULT_OMNI_VOICES;
  }
  try {
    const res = await fetch(`${ELEVENLABS_API}/voices`, {
      headers: { "xi-api-key": key },
      signal: AbortSignal.timeout(10_000),
    });
    if (res.ok) {
      const body = await res.json();
      return (body?.voices ?? [])
        .map((v: any): Voice => ({
          id: String(v.voice_id ?? ""),
          label: String(v.name ?? "Voice"),
          description: [v.labels?.accent, v.labels?.description].filter(Boolean).join(" · ") || undefined,
        }))
        .filter((v: Voice) => v.id);
    }
  } catch {}
  return DEFAULT_OMNI_VOICES;
}

export async function synthesize(text: string, voiceId: string, key: string): Promise<Audio> {
  if (key.startsWith("sk-")) {
    const res = await fetch(`${OMNIROUTE_API}/audio/speech`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
        "accept": "audio/mpeg"
      },
      body: JSON.stringify({
        model: "Audio Combo",
        input: text,
        voice: voiceId || "alloy",
        response_format: "mp3"
      }),
      signal: AbortSignal.timeout(30_000),
    });
    if (res.ok) {
      return { bytes: new Uint8Array(await res.arrayBuffer()), mime: "audio/mpeg" };
    }
  }

  // Fallback to standard ElevenLabs
  const res = await fetch(`${ELEVENLABS_API}/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_64`, {
    method: "POST",
    headers: { "xi-api-key": key, "content-type": "application/json", accept: "audio/mpeg" },
    body: JSON.stringify({ text, model_id: "eleven_flash_v2_5" }),
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) throw new Error(`Voice synthesis failed with status ${res.status}`);
  return { bytes: new Uint8Array(await res.arrayBuffer()), mime: "audio/mpeg" };
}
