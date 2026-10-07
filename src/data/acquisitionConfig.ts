import { buildWhatsAppUrl, validateProviderUrl, validateWhatsAppNumber } from "../lib/acquisition";

// Public destinations only, supplied through Next.js environment configuration.
export const acquisitionConfig = {
  whatsappNumber: validateWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
  calUrl: validateProviderUrl(process.env.NEXT_PUBLIC_CAL_URL, "cal"),
  tallyFormUrl: validateProviderUrl(process.env.NEXT_PUBLIC_TALLY_FORM_URL, "tally"),
};

export function createWhatsAppLink({ message }: { message?: string } = {}) {
  return buildWhatsAppUrl(acquisitionConfig.whatsappNumber, message);
}
