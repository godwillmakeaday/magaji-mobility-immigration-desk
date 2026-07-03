// ---------------------------------------------------------------------------
// Magaji Law — WhatsApp lead flow helpers
//
// The number is read from NEXT_PUBLIC_WHATSAPP_NUMBER at build time. Set it in
// .env (see .env.example). International format, digits only, no "+" or spaces.
// Falls back to a visible placeholder if the env var is not set.
// ---------------------------------------------------------------------------

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "234XXXXXXXXXX";

/** Build a wa.me deep link with a pre-filled, URL-encoded message. */
export function buildWhatsAppLink(message: string): string {
  const digits = WHATSAPP_NUMBER.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/**
 * Render a labelled line for the message body. Falls back to an em dash when a
 * value is empty so the recipient can still see which field was left blank.
 */
export function line(label: string, value?: string): string {
  const v = value && value.trim() ? value.trim() : "—";
  return `${label}: ${v}`;
}
