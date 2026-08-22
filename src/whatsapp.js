export const WHATSAPP_NUMBER = "917725097277";
export const CALL_TEL = "+917725097277";

export function whatsappBookingUrl(serviceName) {
  const text = serviceName
    ? `Hi, I'd like to book a repair for ${serviceName}.`
    : "Hi, I'd like to book a repair.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
