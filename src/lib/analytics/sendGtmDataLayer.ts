export type DataLayerEvent =
  | { event: "page_view"; page_path: string }
  | { event: "consent_granted" }
  | { event: "login_button_click" }
  | {
      event: "video_play" | "video_pause" | "video_complete";
      video_url: string;
      video_title: string;
      exercise_type: string;
    }
  | {
      event: "purchase";
      value: number;
      currency: string;
      transaction_id?: string;
      items: Array<{
        item_id: string;
        item_name: string;
        quantity: number;
        price: number;
      }>;
    };
//   | { event: 'purchase'; value: number; currency: string }
// Add more GTM events as needed

export const windowExists = typeof window !== "undefined";

export default function sendGtmDataLayer(data: DataLayerEvent) {
  if (windowExists && window.dataLayer) {
    window.dataLayer.push(data);
  }
}
