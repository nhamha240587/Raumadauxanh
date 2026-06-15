import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Khóa Học Rau Má Đậu Xanh – Bếp Cô Hạ | Hacofood.vn",
  description:
    "Học làm rau má đậu xanh sánh mịn không tách nước. Công thức chuẩn vị 5 loại sốt kinh doanh từ Cô Hạ. Học xong làm được ngay – bán được ngay. Chỉ 299.000đ.",
  keywords: ["rau má đậu xanh", "khóa học rau má", "bếp cô hạ", "hacofood", "kinh doanh đồ uống"],
  openGraph: {
    title: "Khóa Học Rau Má Đậu Xanh – Bếp Cô Hạ",
    description: "Công thức chuẩn vị · Màu xanh giữ 3–4 ngày · Dễ làm · Dễ bán. Chỉ 299.000đ!",
    url: "https://raumadauxanh.hacofood.vn",
    siteName: "Hacofood.vn – Bếp Cô Hạ",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "https://raumadauxanh.hacofood.vn/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Khóa Học Rau Má Đậu Xanh – Bếp Cô Hạ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khóa Học Rau Má Đậu Xanh – Bếp Cô Hạ",
    description: "Công thức chuẩn vị · Màu xanh giữ 3–4 ngày · Dễ làm · Dễ bán. Chỉ 299.000đ!",
    images: ["https://raumadauxanh.hacofood.vn/images/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
