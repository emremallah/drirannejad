const PERSIAN = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC = "٠١٢٣٤٥٦٧٨٩";

/** Converts Persian/Arabic digits to English ones. */
export function toEnglishDigits(value: string) {
  return value.replace(/[۰-۹٠-٩]/g, (ch) => {
    const p = PERSIAN.indexOf(ch);
    return String(p >= 0 ? p : ARABIC.indexOf(ch));
  });
}

/**
 * Normalizes an Iranian mobile number to the 09xxxxxxxxx form.
 * Accepts +98 / 0098 / 98 prefixes, Persian digits, spaces and dashes.
 * Returns "" when the value is not a valid Iranian mobile number.
 */
export function normalizePhone(value: string) {
  let digits = toEnglishDigits(String(value ?? "")).replace(/[^\d]/g, "");
  if (digits.startsWith("0098")) digits = digits.slice(4);
  else if (digits.startsWith("98") && digits.length === 12) digits = digits.slice(2);
  if (digits.length === 10 && digits.startsWith("9")) digits = `0${digits}`;
  return /^09\d{9}$/.test(digits) ? digits : "";
}
