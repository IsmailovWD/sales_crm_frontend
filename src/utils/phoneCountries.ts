export type PhoneCountry = {
  name: string;
  code: string;
  emoji: string;
  dial_code: string;
  format: string;
};

export const phoneCountries: PhoneCountry[] = [
  {
    name: "Turkey",
    code: "TR",
    emoji: "🇹🇷",
    dial_code: "+90",
    format: "(___) ___ __ __",
  },
  {
    name: "China",
    code: "CN",
    emoji: "🇨🇳",
    dial_code: "+86",
    format: "___-____-____",
  },
  {
    name: "South Korea",
    code: "KR",
    emoji: "🇰🇷",
    dial_code: "+82",
    format: "___-____-____",
  },
  {
    name: "Russia",
    code: "RU",
    emoji: "🇷🇺",
    dial_code: "+7",
    format: "(___) ___-__-__",
  },
  {
    name: "Kazakhstan",
    code: "KZ",
    emoji: "🇰🇿",
    dial_code: "+7",
    format: "(___) ___-__-__",
  },
  {
    name: "Kyrgyzstan",
    code: "KG",
    emoji: "🇰🇬",
    dial_code: "+996",
    format: "___-__-__-__",
  },
  {
    name: "Tajikistan",
    code: "TJ",
    emoji: "🇹🇯",
    dial_code: "+992",
    format: "__-___-__-__",
  },
  {
    name: "Uzbekistan",
    code: "UZ",
    emoji: "🇺🇿",
    dial_code: "+998",
    format: "__-___-__-__",
  },
  {
    name: "Turkmenistan",
    code: "TM",
    emoji: "🇹🇲",
    dial_code: "+993",
    format: "_-___-__-__",
  },
];

export function formatPhoneNumber(
  countryCode: string,
  rawNumber: string,
  cursorPos: number
): { formatted: string; cursor: number; dial_code: string } {
  const country = phoneCountries.find((c) => c.code === countryCode);
  if (!country)
    return { formatted: rawNumber, cursor: cursorPos, dial_code: "" };

  const cleaned = rawNumber.replace(/\D/g, "");
  const format = country.format;
  let formattedNumber = "";
  let index = 0;
  let newCursorPos = cursorPos;

  for (const char of format) {
    if (char === "_" && index < cleaned.length) {
      formattedNumber += cleaned[index];
      index++;
    } else if (index < cleaned.length) {
      formattedNumber += char;
      if (index < cursorPos) newCursorPos++;
    }
  }

  return {
    formatted: formattedNumber,
    cursor: newCursorPos,
    dial_code: country.dial_code,
  };
}
export function validatePhoneNumber(
  rule: any,
  value: string,
  countryCode: string,
  t: any
) {
  if (!value) {
    return new Error(
      t("input_errors.{name} is required", { name: t("clients.phone") })
    );
  }

  const country = phoneCountries.find((c) => c.code === countryCode);
  if (!country) {
    return new Error(t("Invalid country selected"));
  }

  const cleaned = value.replace(/\D/g, "");

  if (cleaned.length === 0) {
    return new Error(
      t("input_errors.{name} is required", { name: t("clients.phone") })
    );
  }

  const expectedLength = (country.format.match(/_/g) || []).length;

  if (cleaned.length !== expectedLength) {
    return new Error(
      t(`phone number should match format: {value}`, { value: country.format })
    );
  }

  return true;
}
