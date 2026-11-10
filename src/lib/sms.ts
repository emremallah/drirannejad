/**
 * FarazSMS (IPPanel) REST API — https://docs.farazsms.com
 * OTP messages must be sent through an approved *pattern* (template); plain-text
 * sends go through manual review and are too slow for login codes.
 *
 * Env:
 *   FARAZSMS_API_KEY       API key from the panel (required)
 *   FARAZSMS_PATTERN_CODE  approved OTP pattern code (required to send)
 *   FARAZSMS_PATTERN_VAR   variable name of the code inside the pattern (default "code")
 *   FARAZSMS_LINE_NUMBER   sender line (default "90008361", FarazSMS's shared service line)
 */
const BASE_URL = "https://api.iranpayamak.com/ws/v1";

export class SmsError extends Error {}

export function smsConfigured() {
  return Boolean(process.env.FARAZSMS_API_KEY && process.env.FARAZSMS_PATTERN_CODE);
}

export async function sendOtpSms(phone: string, code: string) {
  const apiKey = process.env.FARAZSMS_API_KEY;
  const pattern = process.env.FARAZSMS_PATTERN_CODE;

  if (!apiKey || !pattern) {
    // Local development without a pattern: print the code instead of failing.
    if (process.env.NODE_ENV !== "production") {
      console.info(`[sms:dev] OTP for ${phone}: ${code}`);
      return;
    }
    throw new SmsError("سرویس پیامک پیکربندی نشده است.");
  }

  const response = await fetch(`${BASE_URL}/sms/pattern`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Api-Key": apiKey,
    },
    body: JSON.stringify({
      code: pattern,
      attributes: { [process.env.FARAZSMS_PATTERN_VAR || "code"]: code },
      recipient: phone,
      line_number: process.env.FARAZSMS_LINE_NUMBER || "90008361",
      number_format: "english",
    }),
    signal: AbortSignal.timeout(15_000),
    cache: "no-store",
  }).catch((error: unknown) => {
    console.error("[sms] request failed", error);
    throw new SmsError("ارتباط با سرویس پیامک برقرار نشد. دوباره تلاش کنید.");
  });

  const data = (await response.json().catch(() => null)) as { status?: string; message?: unknown } | null;
  if (!response.ok || data?.status === "error") {
    console.error("[sms] send failed", response.status, JSON.stringify(data));
    if (response.status === 404) {
      throw new SmsError("الگوی پیامک هنوز در پنل فراز تأیید نشده است. بعد از تأیید، ارسال کد فعال می‌شود.");
    }
    throw new SmsError(providerMessage(data?.message));
  }
}

/** FarazSMS puts the reason in `message`, either as text or as field errors. */
function providerMessage(message: unknown) {
  if (typeof message === "string" && message.trim()) return message.trim();
  if (message && typeof message === "object") {
    for (const value of Object.values(message)) {
      const text = Array.isArray(value) ? value.find((item) => typeof item === "string") : value;
      if (typeof text === "string" && text.trim()) return text.trim();
    }
  }
  return "ارسال پیامک انجام نشد. کمی بعد دوباره تلاش کنید.";
}
