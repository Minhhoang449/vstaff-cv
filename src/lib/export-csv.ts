/** Xuất file Excel (.xls) dạng bảng HTML — luôn tách đúng cột trên Excel VN/US. */

function htmlEscape(value: string | number | null | undefined) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Giữ tên cũ để không phải sửa mọi call site — nội dung là Excel HTML. */
export function csvEscape(value: string | number | null | undefined) {
  return htmlEscape(value);
}

export function buildCsv(
  headers: string[],
  rows: Array<Array<string | number | null | undefined>>
) {
  const head = headers
    .map((h) => `<th style="background:#f4f4f5;font-weight:600;border:1px solid #d4d4d8;padding:6px 10px">${htmlEscape(h)}</th>`)
    .join("");
  const body = rows
    .map(
      (row) =>
        `<tr>${row
          .map(
            (cell) =>
              `<td style="border:1px solid #e4e4e7;padding:6px 10px;mso-number-format:'\\@'">${htmlEscape(cell)}</td>`
          )
          .join("")}</tr>`
    )
    .join("");

  return (
    `\uFEFF<html xmlns:o="urn:schemas-microsoft-com:office:office" ` +
    `xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">` +
    `<head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>` +
    `<x:ExcelWorksheet><x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/>` +
    `</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->` +
    `</head><body><table border="1" cellspacing="0" cellpadding="0">${head}${body}</table></body></html>`
  );
}

export function downloadCsv(filename: string, content: string) {
  const base = filename.replace(/\.csv$/i, "").replace(/\.xls$/i, "");
  const blob = new Blob([content], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${base}.xls`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
