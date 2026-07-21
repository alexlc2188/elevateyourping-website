"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScriptPdfExporter } from "./scriptPdfExporter";

interface Props {
  manualJsonInput: string;
  setManualJsonInput: (val: string) => void;
  manualScriptOutput: string;
  setManualScriptOutput: (val: string) => void;
  setLabel: (label: string) => void;
}

export function ManualScriptUploader({
  manualJsonInput,
  setManualJsonInput,
  manualScriptOutput,
  setManualScriptOutput,
  setLabel,
}: Props) {
  function extractScriptFromManual(text: string) {
    try {
      const scriptMatch = text.match(/# Training Video Script\s*\n([\s\S]*)/);
      if (!scriptMatch) throw new Error("Expected sections not found.");

      const fullScript = scriptMatch[1].trim();

      // Prioritize extracting label from "### Drill: XYZ"
      const headingLabelMatch = text.match(/### Drill:\s*(.+)/);
      const inferredLabel =
        headingLabelMatch?.[1]?.trim() ||
        fullScript.match(/Drill Number \d+: the ([^\n.]+)/i)?.[1]?.trim() ||
        fullScript
          .match(/\*\*Intro.*?\*\*\s*\n.*?the ([A-Za-z ]+?) drill/i)?.[1]
          ?.trim() ||
        "Drill";

      setManualScriptOutput(fullScript);
      setLabel(inferredLabel);
    } catch (err) {
      console.error("extractScriptFromManual error:", err);
      alert(
        "Invalid format. Make sure it includes # Training Video Script and starts with ### Drill: Your Label.",
      );
    }
  }

  return (
    <section className="w-full pt-6 mt-6 border-t">
      <div className="max-w-4xl mx-auto bg-muted/30 p-6 rounded-xl space-y-6 shadow">
        <h2 className="text-xl font-semibold">Manual Script Upload</h2>
        <Textarea
          id="manualInput"
          value={manualJsonInput}
          onChange={(e) => setManualJsonInput(e.target.value)}
          placeholder={`Paste a script starting with "# Training Video Script" followed by the content.`}
          className="min-h-[300px] w-full resize-y"
        />
        <Button onClick={() => extractScriptFromManual(manualJsonInput)}>
          Extract Script and Generate PDF
        </Button>
        {manualScriptOutput && (
          <>
            <span className="block text-2xl ">PDF Converter Ready</span>
            <ScriptPdfExporter fullOutput={manualJsonInput} />
          </>
        )}
      </div>
    </section>
  );
}
