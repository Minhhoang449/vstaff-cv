import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { CV_PDF_FONT_FAMILY } from "@/lib/cv/register-cv-fonts";
import { siteConfig } from "@/lib/site";

export type PaymentInvoicePdfData = {
  invoiceNo: string;
  orderCode: string;
  issuedAt: string;
  paidAt: string;
  buyerName: string;
  buyerEmail: string;
  buyerAddress?: string;
  buyerPhone?: string;
  planName: string;
  durationLabel: string;
  cvLimitLabel: string;
  amount: number;
  originalAmount: number | null;
  promoCode: string | null;
  amountLabel: string;
  originalAmountLabel: string | null;
  savedLabel: string | null;
  sepayTxnId: string | null;
  gateway: string | null;
  logoSrc?: string | null;
};

const styles = StyleSheet.create({
  page: {
    fontFamily: CV_PDF_FONT_FAMILY as unknown as string,
    fontSize: 10,
    color: "#14202b",
    paddingTop: 40,
    paddingBottom: 48,
    paddingHorizontal: 40,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#d4cec2",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 36,
    height: 36,
  },
  brandName: {
    fontSize: 18,
    fontWeight: 700,
    color: "#0c4452",
  },
  brandSub: {
    marginTop: 2,
    fontSize: 9,
    color: "#5a6570",
  },
  titleBlock: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: "#0c4452",
  },
  meta: {
    marginTop: 4,
    fontSize: 9,
    color: "#5a6570",
    textAlign: "right",
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#8a6a28",
    marginBottom: 8,
  },
  twoCol: {
    flexDirection: "row",
    gap: 24,
  },
  col: {
    flex: 1,
  },
  line: {
    marginBottom: 4,
    lineHeight: 1.45,
  },
  label: {
    color: "#5a6570",
  },
  value: {
    fontWeight: 700,
    color: "#14202b",
  },
  table: {
    borderWidth: 1,
    borderColor: "#e5e1d8",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: "#0c4452",
    color: "#f3f1ec",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e1d8",
  },
  cellDesc: { flex: 3 },
  cellQty: { flex: 1, textAlign: "center" },
  cellAmount: { flex: 1.4, textAlign: "right" },
  headText: { fontSize: 9, fontWeight: 700, color: "#f3f1ec" },
  totals: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 24,
    marginBottom: 4,
    minWidth: 220,
  },
  totalLabel: {
    color: "#5a6570",
    width: 100,
    textAlign: "right",
  },
  totalValue: {
    width: 110,
    textAlign: "right",
    fontWeight: 700,
  },
  grandTotal: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#0c4452",
  },
  grandValue: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0c4452",
  },
  footer: {
    position: "absolute",
    left: 40,
    right: 40,
    bottom: 28,
    fontSize: 8,
    color: "#5a6570",
    borderTopWidth: 1,
    borderTopColor: "#e5e1d8",
    paddingTop: 8,
  },
  note: {
    marginTop: 20,
    fontSize: 9,
    color: "#5a6570",
    lineHeight: 1.5,
  },
});

export function PaymentInvoicePdf({ data }: { data: PaymentInvoicePdfData }) {
  return (
    <Document
      title={`Hóa đơn ${data.invoiceNo}`}
      author="Vstaff"
      subject={`Thanh toán gói ${data.planName}`}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            {data.logoSrc ? <Image src={data.logoSrc} style={styles.logo} /> : null}
            <View>
              <Text style={styles.brandName}>Vstaff</Text>
              <Text style={styles.brandSub}>Dịch vụ headhunter / kho CV</Text>
            </View>
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>HÓA ĐƠN THANH TOÁN</Text>
            <Text style={styles.meta}>Số: {data.invoiceNo}</Text>
            <Text style={styles.meta}>Mã đơn: {data.orderCode}</Text>
            <Text style={styles.meta}>Ngày lập: {data.issuedAt}</Text>
          </View>
        </View>

        <View style={[styles.section, styles.twoCol]}>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Bên bán</Text>
            <Text style={styles.line}>
              <Text style={styles.value}>Vstaff</Text>
            </Text>
            <Text style={styles.line}>
              <Text style={styles.label}>Dịch vụ: </Text>
              Nền tảng headhunter số
            </Text>
            <Text style={styles.line}>
              <Text style={styles.label}>Địa chỉ: </Text>
              {siteConfig.address}
            </Text>
            <Text style={styles.line}>
              <Text style={styles.label}>Điện thoại: </Text>
              {siteConfig.phone}
            </Text>
            <Text style={styles.line}>
              <Text style={styles.label}>Thanh toán: </Text>
              SePay / chuyển khoản VietQR
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Bên mua</Text>
            <Text style={styles.line}>
              <Text style={styles.value}>{data.buyerName || "Nhà tuyển dụng"}</Text>
            </Text>
            {data.buyerEmail ? (
              <Text style={styles.line}>
                <Text style={styles.label}>Email: </Text>
                {data.buyerEmail}
              </Text>
            ) : null}
            {data.buyerPhone ? (
              <Text style={styles.line}>
                <Text style={styles.label}>SĐT: </Text>
                {data.buyerPhone}
              </Text>
            ) : null}
            {data.buyerAddress ? (
              <Text style={styles.line}>
                <Text style={styles.label}>Địa chỉ: </Text>
                {data.buyerAddress}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết</Text>
          <View style={styles.table}>
            <View style={styles.tableHead}>
              <Text style={[styles.headText, styles.cellDesc]}>Hạng mục</Text>
              <Text style={[styles.headText, styles.cellQty]}>SL</Text>
              <Text style={[styles.headText, styles.cellAmount]}>Thành tiền</Text>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.cellDesc}>
                <Text style={{ fontWeight: 700 }}>{data.planName}</Text>
                <Text style={{ marginTop: 3, color: "#5a6570", fontSize: 9 }}>
                  {data.durationLabel} · {data.cvLimitLabel}
                </Text>
                {data.promoCode ? (
                  <Text style={{ marginTop: 3, color: "#8a6a28", fontSize: 9 }}>
                    Mã KM: {data.promoCode}
                  </Text>
                ) : null}
              </View>
              <Text style={styles.cellQty}>1</Text>
              <Text style={[styles.cellAmount, { fontWeight: 700 }]}>{data.amountLabel}</Text>
            </View>
          </View>

          <View style={styles.totals}>
            {data.originalAmountLabel ? (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Giá gốc</Text>
                <Text style={styles.totalValue}>{data.originalAmountLabel}</Text>
              </View>
            ) : null}
            {data.savedLabel ? (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Giảm giá</Text>
                <Text style={styles.totalValue}>-{data.savedLabel}</Text>
              </View>
            ) : null}
            <View style={[styles.totalRow, styles.grandTotal]}>
              <Text style={[styles.totalLabel, { fontWeight: 700, color: "#14202b" }]}>
                Đã thanh toán
              </Text>
              <Text style={[styles.totalValue, styles.grandValue]}>{data.amountLabel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thanh toán</Text>
          <Text style={styles.line}>
            <Text style={styles.label}>Trạng thái: </Text>
            <Text style={styles.value}>Thành công</Text>
          </Text>
          <Text style={styles.line}>
            <Text style={styles.label}>Thời điểm: </Text>
            {data.paidAt}
          </Text>
          {data.sepayTxnId ? (
            <Text style={styles.line}>
              <Text style={styles.label}>Mã giao dịch SePay: </Text>
              {data.sepayTxnId}
            </Text>
          ) : null}
          {data.gateway ? (
            <Text style={styles.line}>
              <Text style={styles.label}>Cổng: </Text>
              {data.gateway}
            </Text>
          ) : null}
        </View>

        <Text style={styles.note}>
          Đây là hóa đơn điện tử ghi nhận giao dịch kích hoạt gói dịch vụ trên Vstaff. Không phải
          hóa đơn GTGT theo quy định kế toán — liên hệ Vstaff nếu cần chứng từ kế toán bổ sung.
        </Text>

        <View style={styles.footer} fixed>
          <Text>Vstaff · Hóa đơn {data.invoiceNo} · Mã đơn {data.orderCode}</Text>
        </View>
      </Page>
    </Document>
  );
}
