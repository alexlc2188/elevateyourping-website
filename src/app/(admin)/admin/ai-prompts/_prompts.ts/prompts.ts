export interface TranscriptPromptConfig {
  label: string;
  description: string;
  getPrompt: (
    label: string,
    type: string,
    duration?: number,
    drillNumber?: number,
    previewId?: string,
  ) => string;
}

export interface ThumbnailPromptConfig {
  label: string;
  description: string;
  getPrompt: (label: string, description: string) => string;
}

export interface ShortSummaryPromptConfig {
  label: string;
  description: string;
  getPrompt: (
    label: string,
    description: string,
    fullTranscript: string,
  ) => string;
}

export type PromptConfig = TranscriptPromptConfig | ThumbnailPromptConfig;

export type PromptKey =
  | "videoTranscriptPrompt"
  | "thumbnailPrompt"
  | "shortSummaryPrompt";

export function generateThumbnailPrompt(label: string, description: string) {
  const gender = Math.random() > 0.5 ? "male" : "female";

  return `A high-quality, realistic image of a ${gender} table tennis player executing a ${label.toLowerCase()}. The player is in a low athletic stance with knees bent, positioned in front of a blue table tennis table, holding a red paddle near the ready position.

Scene: indoor table tennis training hall with a matte red floor, dark background, and a subtle red banner with white Chinese characters on the wall. Lighting is directional and soft, focused on the player with cinematic shadows.

Outfit: professional sportswear in dark blue and black tones with subtle sponsor logos. Facial expression is serious and focused.

Shot with a 50mm lens, medium-framed from a low angle, mimicking a sports documentary still.

Focus: Make the ${label.toLowerCase()} visually clear based on this drill description — "${description}".`;
}

export const prompts: Record<string, PromptConfig> = {
  videoTranscriptPrompt: {
    label: "Video Script Prompt",
    description: "Generate a structured training script and metadata JSON.",
    getPrompt: (
      label: string,
      type: string,
      duration = 300,
      drillNumber = 1,
      previewId = "",
    ) => {
      return `You are helping me generate structured content for a table tennis training app.

Use the following inputs:
- Drill label: "${label}"
- Drill type: "${type}"
- Duration: ${duration} seconds
- Drill number: ${drillNumber}

Write a full 5–6 minute **spoken training video script** for our coach Alex to read on camera. The tone should be instructional, motivational, and friendly — aimed at intermediate players.

**Structure the script** into these sections:
1. **Intro (tight shot on Alex)** – What the drill is and why it’s useful
2. **Technique Breakdown** – Step-by-step explanation of proper form
3. **Common Mistakes** – What to avoid and why
4. **Practice Guidance** – How to train it with or without a partner
5. **Closing Line** – Always end with: “This is what it will look like.”

Speak naturally as if Alex is talking to the camera.

After writing the full script, insert it **after** the JSON metadata described below.

---

### JSON

Wrap the following JSON in triple backticks and the "json" language tag like this: \`\`\`json

{
  "label": "${label}",
  "duration": ${duration},
  "drillNumber": ${drillNumber},
  "previewId": "${previewId}",
  "videoId": "",
  "thumbnail": "/stills/one-shot1.jpg",
  "type": "${type}",
  "description": ""
}

\`\`\`

---


# Training Video Script

## Drill: ${label}

Then begin the script content after this heading: \`# Training Video Script\`.`;
    },
  },
  thumbnailPrompt: {
    label: "Thumbnail Image Prompt",
    description: "Generate a thumbnail image prompt using label + description.",
    getPrompt: (label: string, description: string) => {
      return generateThumbnailPrompt(label, description);
    },
  },
  shortSummaryPrompt: {
    label: "Short Exercise Summary",
    description:
      "Summarize a full video transcript into a short 20-second instructional voice-over for the drill.",
    getPrompt: (label: string, fullTranscript: string) => {
      return `You are helping create a 20-second voice-over summary for a table tennis training drill.
      
      Here is the full training video script:
      
      "${fullTranscript}"
      
      Now, write a short voice-over that starts directly with how to perform the drill. Do **not** introduce the drill name or explain its purpose — jump straight into the instructions, as if you're giving a voice-over for a visual demo of the drill.
      
      Guidelines:
      - Speak in the voice of a coach instructing the player in real time.
      - Focus on technique, form, and execution.
      - Do **not** say the drill name, its benefits, or any introduction/closing.
      - Use clear, motivational language.
      - Keep it under 20 seconds when read aloud (~40–60 words).
      
      Start your output directly with the instructions — no headings or preamble.`;
    },
  },
  brollListPrompt: {
    label: "B-Roll Shot List",
    description:
      "Generate a list of essential B-roll shots to capture based on a full training video script.",
    getPrompt: (label: string, fullTranscript: string) => {
      return `You are helping plan a table tennis training video shoot for a short production with limited time available.
  
  The drill is titled: "${label}". Please start your response with the heading: "# Drill: ${label}"
  
  Here is the full video script:
  
  "${fullTranscript}"
  
  Do not include any other title or heading like "B-Roll Shot List".
  
  Focus only on structured, sectioned B-roll bullet points (e.g., Intro, Technique, Common Mistakes).
  
  Now, create a short and focused list of only the most essential B-roll footage needed to support this video — avoid anything repetitive or excessive. Break down the list based on the sections of the script (e.g., intro, technique, common mistakes, practice, closing).
  
  Guidelines:
  - Use concise bullet points.
  - Specify angles (e.g. side, diagonal, profile) where relevant.
  - Mention ideal lens or framing when useful (e.g. full-body, close-up).
  - Focus on shots that illustrate the technique, common mistakes, and practice routines clearly.
  - This list will be used by a videographer with limited time and setup flexibility, so focus only on what's absolutely necessary.`;
    },
  },
};
