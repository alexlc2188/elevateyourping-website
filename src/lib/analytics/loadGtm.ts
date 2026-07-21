// utils/loadGtm.ts
export function loadGTM(gtmId: string) {
  if (typeof window === "undefined") return;
  if (document.getElementById("gtm-script")) return; // Prevent duplicates

  const script = document.createElement("script");
  script.id = "gtm-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
  document.head.appendChild(script);

  // Optional: create the dataLayer if not present
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "gtm.js", "gtm.start": new Date().getTime() });
}
