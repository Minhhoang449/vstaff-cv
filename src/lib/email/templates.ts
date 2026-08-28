export type EmailTemplateVars = {
  ten_ung_vien?: string;
  chuc_danh?: string;
  ten_cong_ty?: string;
  ten_nguoi_gui?: string;
};

const PLACEHOLDER_RE = /\{\{\s*(ten_ung_vien|chuc_danh|ten_cong_ty|ten_nguoi_gui)\s*\}\}/g;

export function applyEmailTemplate(text: string, vars: EmailTemplateVars) {
  return text.replace(PLACEHOLDER_RE, (_match, key: keyof EmailTemplateVars) => {
    const value = vars[key];
    return value?.trim() ? value.trim() : "";
  });
}
