import { join } from "node:path";
import { Font } from "@react-pdf/renderer";

let registered = false;

/**
 * Roboto (Latin/VN) + Noto Sans JP/SC/KR fallback.
 * react-pdf substitutes per codepoint when fontFamily is a string[].
 */
export const CV_PDF_FONT_FAMILY = [
  "VstaffCv",
  "VstaffCvJp",
  "VstaffCvSc",
  "VstaffCvKr",
] as const;

/** Đăng ký font Unicode — Helvetica không hỗ trợ tiếng Việt / CJK. */
export function registerCvPdfFonts() {
  if (registered) return;
  const dir = join(process.cwd(), "src", "assets", "fonts");

  Font.register({
    family: "VstaffCv",
    fonts: [
      { src: join(dir, "Roboto-Regular.ttf"), fontWeight: 400 },
      { src: join(dir, "Roboto-Bold.ttf"), fontWeight: 700 },
    ],
  });

  // CJK: chỉ regular — fallback theo glyph, không theo weight
  Font.register({
    family: "VstaffCvJp",
    src: join(dir, "NotoSansJP-Regular.ttf"),
  });
  Font.register({
    family: "VstaffCvSc",
    src: join(dir, "NotoSansSC-Regular.ttf"),
  });
  Font.register({
    family: "VstaffCvKr",
    src: join(dir, "NotoSansKR-Regular.ttf"),
  });

  registered = true;
}
