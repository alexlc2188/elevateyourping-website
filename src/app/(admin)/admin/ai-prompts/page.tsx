"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateThumbnailPrompt, prompts } from "./_prompts.ts/prompts";
import { ManualScriptUploader } from "./_components/manualScriptUploader";
import { ScriptPdfExporter } from "./_components/scriptPdfExporter";
import { BackButton } from "@/components/back-button";

function parseCourseStructure(
  input: string,
): { label: string; type: string }[] {
  const lines = input.split(/\r?\n/);
  const drills: { label: string; type: string }[] = [];
  let currentType = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (!trimmed.startsWith("*")) {
      const key = trimmed.toLowerCase().replace(":", "");
      if (["technique", "rally", "serve", "return", "footwork"].includes(key)) {
        currentType = key;
      }
    } else if (currentType) {
      const label = trimmed.replace(/^\* /, "").trim();
      if (label.toLowerCase() !== "nothing") {
        drills.push({ label, type: currentType });
      }
    }
  }
  return drills;
}

export default function PromptToolPage() {
  const [selectedPromptKey, setSelectedPromptKey] = useState<string>(
    "videoTranscriptPrompt",
  );
  const [label, setLabel] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [batchText, setBatchText] = useState<string>("");
  const [batchResults, setBatchResults] = useState<string[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [shortSummaryResult, setShortSummaryResult] = useState<string>("");
  const [brollListResult, setBrollListResult] = useState<string>("");

  // Add state for mode selection:
  const [inputMode, setInputMode] = useState<"gpt" | "manual">("gpt");

  const [manualJsonInput, setManualJsonInput] = useState<string>("");
  const [manualScriptOutput, setManualScriptOutput] = useState<string>("");

  const handleThumbnailSubmit = async () => {
    setLoading(true);
    setThumbnailUrl("");

    const prompt = generateThumbnailPrompt(
      label,
      `This is a ${label} drill focusing on: ${description}`,
    );

    try {
      const res = await fetch("/api/automations/generate-thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data?.imageUrl) {
        setThumbnailUrl(data.imageUrl);
      } else {
        alert("No image was returned from OpenAI.");
      }
    } catch (err) {
      console.error("Thumbnail generation error:", err);
      alert("Something went wrong while generating the thumbnail.");
    } finally {
      setLoading(false);
    }
  };

  const handleShortSummary = async () => {
    setLoading(true);
    setShortSummaryResult("");
    const prompt = prompts.shortSummaryPrompt.getPrompt(
      label,
      manualScriptOutput,
    );

    try {
      const res = await fetch("/api/automations/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setShortSummaryResult(data.result);
    } catch (err) {
      alert("Failed to generate short summary.");
    } finally {
      setLoading(false);
    }
  };

  const handleBrollList = async () => {
    setLoading(true);
    setBrollListResult("");
    const prompt = prompts.brollListPrompt.getPrompt(label, manualScriptOutput);

    try {
      const res = await fetch("/api/automations/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setBrollListResult(data.result);
    } catch (err) {
      alert("Failed to generate B-roll list.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVideoScript = async () => {
    setLoading(true);
    setBatchResults([]);

    try {
      const drills = parseCourseStructure(batchText);
      const results: string[] = [];

      for (let i = 0; i < drills.length; i++) {
        const { label, type } = drills[i];
        const prompt = prompts.videoTranscriptPrompt.getPrompt(
          label,
          type,
          300,
          i + 1,
          "",
        );

        const res = await fetch("/api/automations/generate-script", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });

        if (!res.ok) throw new Error(`Request failed for drill "${label}"`);

        const data = await res.json();
        if (!data.result) throw new Error("Invalid API response format");

        results.push(data.result);
      }

      setBatchResults(results);
    } catch (err) {
      console.error("Script generation failed:", err);
      alert("Something went wrong while generating scripts.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <BackButton />
      <div className="mx-auto space-y-4 w-full justify-start flex flex-col items-center ">
        <h1 className="text-2xl font-bold">Prompt Generator</h1>

        {/* Toggle Between Modes */}
        <div className="space-y-2">
          <Label>Select Input Mode</Label>
          <ToggleGroup
            type="single"
            value={inputMode}
            onValueChange={(v) => setInputMode(v as any)}>
            <ToggleGroupItem value="gpt">Use GPT Prompt</ToggleGroupItem>
            <ToggleGroupItem value="manual">Export to PDF</ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* ------------------ GPT MODE ------------------ */}
        {inputMode === "gpt" && (
          <>
            <div className="space-y-2 mt-8">
              <Label>Select a prompt type</Label>
              <Select
                value={selectedPromptKey}
                onValueChange={setSelectedPromptKey}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a prompt" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(prompts).map(([key, p]) => (
                    <SelectItem key={key} value={key}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {selectedPromptKey === "videoTranscriptPrompt"
                  ? "Paste a structured course layout and generate scripts for each drill."
                  : prompts[selectedPromptKey]?.description ??
                    "No description available."}
              </p>
            </div>

            {selectedPromptKey === "videoTranscriptPrompt" && (
              <>
                <div className="space-y-2 mt-8">
                  <Label htmlFor="batch">Course Structure Input</Label>
                  <Textarea
                    id="batch"
                    value={batchText}
                    onChange={(e) => setBatchText(e.target.value)}
                    placeholder={`technique\n* Forehand Drive\n* Backhand Drive\n...`}
                    className="min-h-[200px] min-w-[500px]  mx-auto bg-muted/30 p-6 rounded-xl space-y-4 shadow"
                  />
                </div>
                <Button
                  onClick={handleGenerateVideoScript}
                  disabled={loading}
                  className="">
                  {loading ? "Generating..." : "Generate Scripts"}
                </Button>

                {batchResults.length > 0 &&
                  batchResults.map((result, idx) => (
                    <div key={idx} className="space-y-2 border rounded-lg p-4">
                      <Label className=" text-xl">Drill {idx + 1}</Label>
                      <Textarea
                        className="min-h-[200px] w-full resize-none border-none"
                        value={result}
                        readOnly
                      />
                    </div>
                  ))}
              </>
            )}

            {selectedPromptKey === "thumbnailPrompt" && (
              <div className="space-y-6 mt-6 w-8/12 mx-auto ">
                <div className="space-y-2">
                  <Label htmlFor="label">Drill Label</Label>
                  <Input
                    id="label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g. Forehand Loop"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Drill description</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Forehand chop drill. The training partner places the ball to your forehand side. Aim to return the ball diagonally. Use a defensive stroke — focus on a smooth, downward motion with a relaxed grip and precise timing."
                  />
                </div>
                <Label>Thumbnail Prompt</Label>
                <Textarea
                  className="min-h-[200px] "
                  readOnly
                  value={generateThumbnailPrompt(
                    label,
                    `This is a ${label} drill focusing on: ${description}`,
                  )}
                />
                <Button
                  className="mt-4"
                  onClick={handleThumbnailSubmit}
                  disabled={loading}>
                  {loading ? "Generating..." : "Generate Thumbnail Image"}
                </Button>
                {thumbnailUrl && (
                  <div className="mt-4">
                    <Label>Generated Image</Label>
                    <img
                      src={thumbnailUrl}
                      alt="Generated Thumbnail"
                      className="rounded-lg w-full mt-2"
                    />
                  </div>
                )}
              </div>
            )}
            {/* --------- SHORT SUMMARY TOOL --------- */}
            {selectedPromptKey === "shortSummaryPrompt" && (
              <section className="w-full pt-6 mt-12 border-t">
                <div className="max-w-4xl mx-auto bg-muted/30 p-6 rounded-xl space-y-6 shadow">
                  <h2 className="text-xl font-semibold">
                    Generate 20-Second Drill Summary
                  </h2>

                  <div className="space-y-2">
                    <Label htmlFor="summaryInput">
                      Paste Full Video Script
                    </Label>
                    <Textarea
                      id="summaryInput"
                      value={manualScriptOutput}
                      onChange={(e) => setManualScriptOutput(e.target.value)}
                      placeholder="Paste the full script content here..."
                      className="min-h-[300px] w-full resize-y"
                    />
                  </div>

                  <Button onClick={handleShortSummary} disabled={loading}>
                    {loading ? "Generating..." : "Generate 20s Summary"}
                  </Button>

                  {shortSummaryResult && (
                    <>
                      <Label className="pt-4">Summary Output</Label>
                      <Textarea
                        className="min-h-[150px] w-full resize-y"
                        value={shortSummaryResult}
                        readOnly
                      />
                    </>
                  )}
                </div>
              </section>
            )}
            {selectedPromptKey === "brollListPrompt" && (
              <section className="w-full pt-6 mt-12 border-t">
                <div className="max-w-4xl mx-auto bg-muted/30 p-6 rounded-xl space-y-6 shadow">
                  <h2 className="text-xl font-semibold">
                    Generate B-Roll Shot List
                  </h2>
                  <div className="space-y-2">
                    <Label htmlFor="label">Drill Title (used in PDF)</Label>
                    <Input
                      id="label"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder="e.g. Forehand Drive"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brollScriptInput">
                      Paste Full Video Script
                    </Label>
                    <Textarea
                      id="brollScriptInput"
                      value={manualScriptOutput}
                      onChange={(e) => setManualScriptOutput(e.target.value)}
                      placeholder="Paste the full script content here..."
                      className="min-h-[300px] w-full resize-y"
                    />
                  </div>

                  <Button onClick={handleBrollList} disabled={loading}>
                    {loading ? "Generating..." : "Generate B-Roll List"}
                  </Button>

                  {brollListResult && (
                    <>
                      <Label className="pt-4">B-Roll Output</Label>
                      <Textarea
                        className="min-h-[250px] w-full resize-y"
                        value={brollListResult}
                        readOnly
                      />
                      <ScriptPdfExporter
                        label={label}
                        fullOutput={`# B-Roll Shot List\n\n${brollListResult}`}
                      />
                    </>
                  )}
                </div>
              </section>
            )}
          </>
        )}

        {/* ------------------ MANUAL MODE ------------------ */}
        {inputMode === "manual" && (
          <ManualScriptUploader
            manualJsonInput={manualJsonInput}
            setManualJsonInput={setManualJsonInput}
            manualScriptOutput={manualScriptOutput}
            setManualScriptOutput={setManualScriptOutput}
            setLabel={setLabel}
          />
        )}
      </div>
    </div>
  );
}
