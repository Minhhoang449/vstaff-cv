/** Ngành nghề / lĩnh vực — dùng cho modal trang chủ */
export type Industry = {
  id: string;
  name: string;
  group: string;
};

export const INDUSTRIES: Industry[] = [
  { id: "it-software", name: "Công nghệ thông tin", group: "Công nghệ" },
  { id: "it-data", name: "Phân tích dữ liệu / AI", group: "Công nghệ" },
  { id: "it-network", name: "Mạng / Bảo mật", group: "Công nghệ" },
  { id: "marketing", name: "Marketing / Truyền thông", group: "Kinh doanh" },
  { id: "sales", name: "Kinh doanh / Bán hàng", group: "Kinh doanh" },
  { id: "finance", name: "Tài chính / Ngân hàng", group: "Kinh doanh" },
  { id: "accounting", name: "Kế toán / Kiểm toán", group: "Kinh doanh" },
  { id: "hr", name: "Nhân sự / Đào tạo", group: "Vận hành" },
  { id: "admin", name: "Hành chính / Văn phòng", group: "Vận hành" },
  { id: "logistics", name: "Logistics / Chuỗi cung ứng", group: "Vận hành" },
  { id: "manufacturing", name: "Sản xuất / Cơ khí", group: "Kỹ thuật" },
  { id: "construction", name: "Xây dựng / Bất động sản", group: "Kỹ thuật" },
  { id: "design", name: "Thiết kế / UI-UX", group: "Sáng tạo" },
  { id: "content", name: "Nội dung / Biên tập", group: "Sáng tạo" },
  { id: "education", name: "Giáo dục / Đào tạo", group: "Xã hội" },
  { id: "healthcare", name: "Y tế / Dược", group: "Xã hội" },
  { id: "hospitality", name: "Nhà hàng / Khách sạn", group: "Dịch vụ" },
  { id: "customer-service", name: "Chăm sóc khách hàng", group: "Dịch vụ" },
  { id: "legal", name: "Pháp lý / Compliance", group: "Chuyên môn" },
  { id: "other", name: "Khác", group: "Khác" },
];

export function groupIndustries(items: Industry[] = INDUSTRIES) {
  const map = new Map<string, Industry[]>();
  for (const item of items) {
    const list = map.get(item.group) ?? [];
    list.push(item);
    map.set(item.group, list);
  }
  return Array.from(map.entries());
}
