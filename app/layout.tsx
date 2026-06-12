import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Khóa Học Rau Má Đậu Xanh – Bếp Cô Hạ | Hacofood.vn",
  description:
    "Học làm rau má đậu xanh sánh mịn không tách nước. Công thức chuẩn vị 5 loại sốt kinh doanh từ Cô Hạ. Học xong làm được ngay – bán được ngay. Chỉ 299.000đ.",
  keywords: ["rau má đậu xanh", "khóa học rau má", "bếp cô hạ", "hacofood", "kinh doanh đồ uống"],
  openGraph: {
    title: "Khóa Học Rau Má Đậu Xanh – Bếp Cô Hạ",
    description: "Công thức chuẩn vị · Dễ làm · Dễ bán. Chỉ 299.000đ, giảm 70%!",
    url: "https://hacofood.vn/rau-ma-dau-xanh",
    siteName: "Hacofood.vn",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
