import { getSePayConfig } from "@/lib/payments/config";

/** Một số BIN Napas thường dùng — hiển thị tên ngân hàng trên checkout. */
const BANK_BY_BIN: Record<string, { name: string; shortName: string }> = {
  "970422": { name: "Ngân hàng TMCP Quân đội", shortName: "MB Bank" },
  "970436": { name: "Ngân hàng TMCP Ngoại thương Việt Nam", shortName: "Vietcombank" },
  "970418": { name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam", shortName: "BIDV" },
  "970415": { name: "Ngân hàng TMCP Công thương Việt Nam", shortName: "VietinBank" },
  "970407": { name: "Ngân hàng TMCP Kỹ thương Việt Nam", shortName: "Techcombank" },
  "970416": { name: "Ngân hàng TMCP Á Châu", shortName: "ACB" },
  "970432": { name: "Ngân hàng TMCP Việt Nam Thịnh Vượng", shortName: "VPBank" },
  "970423": { name: "Ngân hàng TMCP Tiên Phong", shortName: "TPBank" },
  "970403": { name: "Ngân hàng TMCP Sài Gòn Thương Tín", shortName: "Sacombank" },
  "970437": { name: "Ngân hàng TMCP Phát triển TP.HCM", shortName: "HDBank" },
};

export function bankNameFromBin(bin: string): { name: string; shortName: string } {
  const key = bin.trim();
  return BANK_BY_BIN[key] || { name: `Ngân hàng (BIN ${key})`, shortName: key || "—" };
}

/** Tạo URL ảnh VietQR (img.vietqr.io) — chuyển khoản đúng STK + số tiền + nội dung. */
export function buildVietQrImageUrl(opts: { amount: number; addInfo: string }) {
  const { bankAccount, bankBin, accountName } = getSePayConfig();
  if (!bankAccount || !bankBin) return null;

  const params = new URLSearchParams({
    amount: String(Math.round(opts.amount)),
    addInfo: opts.addInfo,
    accountName,
  });

  return `https://img.vietqr.io/image/${bankBin}-${bankAccount}-compact2.png?${params.toString()}`;
}

export function getBankTransferInfo() {
  const c = getSePayConfig();
  const named = bankNameFromBin(c.bankBin);
  return {
    bankAccount: c.bankAccount,
    bankBin: c.bankBin,
    accountName: c.accountName,
    bankName: named.name,
    bankShortName: named.shortName,
    configured: Boolean(c.bankAccount && c.bankBin),
  };
}
