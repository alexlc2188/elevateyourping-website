import { useEffect, useState } from "react";
import { Page, Text, Document, StyleSheet, pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    lineHeight: 1.6,
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
});

const ScriptPDF = ({ script, title }: { script: string; title: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.heading}>{title}</Text>
      {script.split("\n").map((line, idx) => {
        const cleaned = line.replace(/\u0000/g, "").trim();

        // Match markdown-like headings: "- **Intro**", "**Technique**", "### Practice"
        const headingMatch = cleaned.match(
          /^[-*#\s]*\**\s*(Intro|Technique Breakdown|Common Mistakes|Practice Guidance|Closing Line)\s*\**$/i,
        );
        if (headingMatch) {
          return (
            <Text
              key={idx}
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginTop: 20,
                marginBottom: 6,
                textDecoration: "underline",
              }}>
              {headingMatch[1]}
            </Text>
          );
        }

        // If it's a bullet point, render with ☐
        if (/^[-–•]/.test(cleaned)) {
          return (
            <Text key={idx} style={{ marginBottom: 4 }}>
              - {cleaned.replace(/^[-–•]\s*/, "")}
            </Text>
          );
        }

        // Fallback: plain line
        return (
          <Text key={idx} style={{ marginBottom: 4 }}>
            {cleaned}
          </Text>
        );
      })}
    </Page>
  </Document>
);

export function ScriptPdfExporter({
  fullOutput,
  label,
}: {
  fullOutput: string;
  label?: string;
}) {
  const [scriptText, setScriptText] = useState("");

  // useEffect(() => {
  //   try {
  //     const scriptMatch = fullOutput.match(
  //       /#\s*Training Video Script\s*\n([\s\S]*)/,
  //     );
  //     if (!scriptMatch) throw new Error("Script section not found");

  //     const script = scriptMatch[1].trim();
  //     setScriptText(script);

  //     // Extract from "# Drill: XYZ" or fallback to body content
  //     const headingLabelMatch = fullOutput.match(/#+\s*Drill:\s*(.+)/i);
  //     const labelFromHeading =
  //       headingLabelMatch?.[1]?.trim() ||
  //       script.match(/Drill Number \d+: the ([^\n.]+)/i)?.[1]?.trim() ||
  //       script
  //         .match(/\*\*Intro.*?\*\*\s*\n.*?the ([A-Za-z ]+?) drill/i)?.[1]
  //         ?.trim() ||
  //       "Drill";

  //     setLabel(labelFromHeading);
  //   } catch (e) {
  //     console.error("PDF parse error:", e);
  //   }
  // }, [fullOutput]);

  useEffect(() => {
    let cleanedOutput = fullOutput.trim();

    // Remove unnecessary internal headings
    cleanedOutput = cleanedOutput
      .replace(/^#\s*B-Roll Shot List\s*\n?/i, "")
      .replace(/^#\s*Drill:\s*.*\n?/i, "")
      .replace(/^🎥\s*B-Roll Shot List\s*\n?/i, "")
      .trim();

    setScriptText(cleanedOutput);
  }, [fullOutput]);

  const handleDownload = async () => {
    const blob = await pdf(
      <ScriptPDF script={scriptText} title={label || "Generated Output"} />,
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${label?.trim().replace(/\s+/g, "_").toLowerCase()}.pdf`;
    link.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scriptText);
      alert("Script copied to clipboard!");
    } catch (err) {
      alert("Failed to copy.");
    }
  };

  if (!scriptText) return null;

  return (
    <div className="flex gap-4 pt-2">
      <Button onClick={handleDownload} variant="secondary">
        Download PDF
      </Button>
      <Button onClick={handleCopy} variant="outline">
        Copy Script
      </Button>
    </div>
  );
}
