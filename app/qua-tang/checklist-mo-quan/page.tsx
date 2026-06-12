'use client'
import { Noto_Sans } from 'next/font/google'
import { useEffect } from 'react'

const noto = Noto_Sans({ subsets: ['vietnamese'], weight: ['400', '600', '700', '900'] })

const groups = [
  {
    title: 'NHÓM 1: LÊN KẾ HOẠCH & XÁC ĐỊNH MÔ HÌNH',
    icon: '📋',
    color: '#1B5E20',
    steps: [
      'Xác định mô hình kinh doanh: xe đẩy / quán nhỏ / gian hàng chợ / trường học',
      'Chọn địa điểm: gần trường học, văn phòng, chợ, khu dân cư đông',
      'Khảo sát đối thủ xung quanh: giá bán, vị bán, số lượng khách',
      'Tính vốn ban đầu chi tiết: nguyên liệu + dụng cụ + mặt bằng + chi phí phát sinh',
      'Đặt tên quán dễ nhớ, liên quan đến rau má hoặc bếp nhà',
      'Thiết kế logo và bảng hiệu đơn giản (Canva miễn phí là đủ)',
      'Mở tài khoản ngân hàng riêng cho kinh doanh (tách tiền cá nhân)',
      'Lên menu ban đầu: bắt đầu 2–3 vị, thêm dần khi đã quen vận hành',
    ],
  },
  {
    title: 'NHÓM 2: THIẾT BỊ & DỤNG CỤ CẦN MUA',
    icon: '🔧',
    color: '#2E7D32',
    steps: [
      'Máy xay sinh tố công nghiệp (≥1000W): Blender Electrolux, Hamilton Beach',
      'Tủ đá / tủ mát bảo quản nguyên liệu (ít nhất 100L)',
      'Nồi inox 2–3 lít để hấp và sên đậu xanh',
      'Rây lọc inox mịn đường kính ≥20cm + thau hứng',
      'Cân điện tử 5kg chính xác ±1g (đo nguyên liệu chuẩn gram)',
      'Thau inox 5–10L để ngâm rau má, xả rau',
      'Hộp GN inox hoặc hộp nhựa thực phẩm có nắp (bảo quản đậu, sốt)',
      'Máy dập nắp ly (nếu bán mang đi) hoặc ly nắp lẫy',
      'Bình đựng nước cốt rau má (500ml–1L, có chia vạch)',
      'Tạp dề, găng tay nilon, khăn vải sạch cho nhân viên',
    ],
  },
  {
    title: 'NHÓM 3: NGUYÊN LIỆU & NHÀ CUNG CẤP',
    icon: '🛒',
    color: '#388E3C',
    steps: [
      'Tìm nguồn rau má tươi ổn định: chợ đầu mối, vườn trồng tại địa phương',
      'Đặt hàng đậu xanh cà (loại đã bỏ vỏ) — mua sỉ 5–10kg lần đầu thử chất lượng',
      'Mua sữa tươi đi bình/thùng 10L (giá rẻ hơn hộp nhỏ 3–4 lần)',
      'Sữa dừa Chaokoh hoặc Aroy-D — mua thùng 24 lon để tiết kiệm',
      'Đường trắng tinh luyện, mua bao 50kg giá sỉ từ đại lý',
      'Sữa đặc Ông Thọ hoặc Ngôi Sao, mua thùng 48 hộp',
      'Đặt mua ly, nắp, ống hút, túi nilon in tên quán (số lượng 500–1000 cái)',
    ],
  },
  {
    title: 'NHÓM 4: SƠ CHẾ & QUY TRÌNH LÀM CHUẨN',
    icon: '🍃',
    color: '#43A047',
    steps: [
      'Nhặt rau má: loại bỏ lá vàng, cuống già, tạp chất',
      'Rửa rau má 3 lần nước: lần 1 thau to, lần 2 xả chảy, lần 3 ngâm muối loãng 5 phút',
      'Chần rau má chuẩn nhiệt: 10–15 giây ở nước 85–90°C (theo công thức Cô Hạ)',
      'Sốc lạnh ngay sau chần: thả vào thau đá lạnh 2–3 phút để giữ màu xanh',
      'Xay nước cốt tỷ lệ vàng theo từng vị (xem bài giảng video)',
      'Lọc qua rây mịn ít nhất 2 lần: loại bỏ xơ, ra nước cốt mượt mà',
      'Bảo quản nước cốt trong hộp kín, để ngăn lạnh ≤4°C, dùng trong 24–48h',
      'Sên đậu xanh đúng lửa: nhỏ liu riu, khuấy liên tục, đến khi dẻo mịn',
      'Chia đậu thành khẩu phần sẵn (30g/hộp nhỏ) để ra ly nhanh',
    ],
  },
  {
    title: 'NHÓM 5: VẬN HÀNH BÁN HÀNG & MARKETING',
    icon: '📣',
    color: '#66BB6A',
    steps: [
      'Chụp ảnh sản phẩm đẹp: ánh sáng tự nhiên, phông trắng/xanh, ly đầy tầng',
      'Đăng lên Facebook, TikTok, Zalo mỗi ngày ít nhất 1 bài/video',
      'Chạy story Facebook/Zalo: mỗi buổi sáng đăng "Hôm nay mở bán X vị"',
      'Tạo combo ưu đãi: mua 2 ly giảm 10k, mua 5 ly tặng 1 ly',
      'Xin feedback khách hàng và đăng lên mạng kèm hình sản phẩm',
      'Tham gia hội nhóm bán hàng online địa phương để tăng tiếp cận',
      'Làm thẻ khách hàng thân thiết: mua 10 ly tặng 1 ly',
    ],
  },
  {
    title: 'NHÓM 6: NGÀY ĐẦU KHAI TRƯƠNG',
    icon: '🎉',
    color: '#2E7D32',
    steps: [
      'Chuẩn bị nguyên liệu gấp 1.5 lần dự tính (phòng trường hợp đông khách)',
      'Mời người thân, bạn bè đến ủng hộ và chụp ảnh không khí khai trương',
      'Chạy ưu đãi ngày khai trương: giảm 20% hoặc mua 2 tặng 1',
      'Chuẩn bị QR Sepay để nhận chuyển khoản không tiền mặt',
      'Ghi lại số lượng bán, vị nào bán chạy nhất trong ngày đầu',
      'Tổng kết cuối ngày: doanh thu, chi phí, tồn kho, bài học cần cải thiện',
    ],
  },
]

export default function ChecklistPage() {
  const total = groups.reduce((s, g) => s + g.steps.length, 0)
  useEffect(() => { document.title = 'Checklist 47 Bước Ra Quán Rau Má – Bếp Cô Hạ' }, [])
  return (
    <div className={noto.className} style={{ background: '#fff', minHeight: '100vh' }}>
      <div className="no-print" style={{ background: '#1B5E20', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ color: '#fff' }}>
          <strong style={{ fontSize: 16 }}>🌿 Bếp Cô Hạ</strong>
          <span style={{ color: '#A5D6A7', fontSize: 13, marginLeft: 12 }}>Checklist 47 Bước Ra Quán Chuẩn</span>
        </div>
        <button
          onClick={() => typeof window !== 'undefined' && window.print()}
          style={{ background: '#F9A825', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
        >
          📥 Tải PDF / In ra
        </button>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { font-size: 11pt; }
          .group-block { page-break-inside: avoid; }
        }
        @page { margin: 1.5cm; size: A4; }
        .checkbox { display: inline-block; width: 16px; height: 16px; border: 2px solid #2E7D32; border-radius: 3px; margin-right: 10px; flex-shrink: 0; vertical-align: middle; }
      `}</style>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28, borderBottom: '3px solid #2E7D32', paddingBottom: 20 }}>
          <div style={{ fontSize: 13, color: '#43A047', fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>QUÀ TẶNG KÈM KHÓA HỌC · BẾP CÔ HẠ</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1B5E20', margin: '0 0 6px' }}>✅ Checklist {total} Bước Ra Quán Chuẩn</h1>
          <p style={{ fontSize: 14, color: '#555', margin: 0 }}>Không Bỏ Sót Thứ Gì — Kinh Doanh Rau Má Đậu Xanh Từ A–Z</p>
        </div>

        {/* How to use */}
        <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', borderRadius: 10, padding: '14px 18px', marginBottom: 28, fontSize: 12 }}>
          <p style={{ fontWeight: 700, color: '#1B5E20', margin: '0 0 6px' }}>📌 CÁCH SỬ DỤNG CHECKLIST NÀY:</p>
          <p style={{ margin: '0 0 4px', color: '#444' }}>1. In ra (A4, khổ dọc) và dán lên tường nơi làm việc hoặc trong sổ tay kinh doanh</p>
          <p style={{ margin: '0 0 4px', color: '#444' }}>2. Gạch (✓) từng ô khi đã hoàn thành — không bỏ qua bước nào dù có vẻ nhỏ</p>
          <p style={{ margin: 0, color: '#444' }}>3. Hoàn thành 100% checklist trước ngày khai trương chính thức để tránh phát sinh bất ngờ</p>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 28, background: '#F1F8E9', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 6px', fontSize: 12, color: '#1B5E20', fontWeight: 700 }}>TIẾN ĐỘ CHUẨN BỊ</p>
            <div style={{ background: '#C8E6C9', borderRadius: 10, height: 12, overflow: 'hidden' }}>
              <div style={{ width: '0%', height: '100%', background: '#2E7D32', borderRadius: 10 }}></div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#1B5E20' }}>0</span>
            <span style={{ color: '#666', fontSize: 13 }}>/{total}</span>
            <p style={{ margin: 0, fontSize: 10, color: '#666' }}>bước hoàn thành</p>
          </div>
        </div>

        {/* Checklist groups */}
        {groups.map((group, gi) => (
          <div key={group.title} className="group-block" style={{ marginBottom: 24 }}>
            <div style={{ background: group.color, color: '#fff', padding: '10px 16px', borderRadius: '10px 10px 0 0', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>{group.icon}</span>
              <strong style={{ fontSize: 14 }}>{group.title}</strong>
              <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.8 }}>{group.steps.length} bước</span>
            </div>
            <div style={{ border: `1px solid ${group.color}30`, borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
              {group.steps.map((step, si) => {
                const num = groups.slice(0, gi).reduce((s, g) => s + g.steps.length, 0) + si + 1
                return (
                  <div key={step} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 16px',
                    background: si % 2 === 0 ? '#fff' : '#F9FBF9',
                    borderBottom: si < group.steps.length - 1 ? '1px solid #F0F0F0' : 'none',
                  }}>
                    <span className="checkbox"></span>
                    <span style={{ fontSize: 12, color: '#888', fontWeight: 700, minWidth: 24, paddingTop: 1 }}>{num}.</span>
                    <p style={{ margin: 0, fontSize: 13, color: '#333', lineHeight: 1.5, flex: 1 }}>{step}</p>
                    <div style={{ minWidth: 80, borderBottom: '1px dashed #ddd', marginTop: 10, marginLeft: 8 }}></div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Notes section */}
        <div style={{ marginTop: 20, border: '2px dashed #C8E6C9', borderRadius: 10, padding: '16px 20px' }}>
          <p style={{ fontWeight: 700, color: '#1B5E20', marginBottom: 12, fontSize: 14 }}>📝 GHI CHÚ RIÊNG CỦA BẠN:</p>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ borderBottom: '1px solid #E0E0E0', marginBottom: 12, paddingBottom: 12, minHeight: 30 }}></div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 32, paddingTop: 16, borderTop: '2px solid #C8E6C9', textAlign: 'center' }}>
          <p style={{ color: '#43A047', fontWeight: 700, fontSize: 13 }}>🌿 Bếp Cô Hạ · Hacofood.vn</p>
          <p style={{ color: '#999', fontSize: 11 }}>Tài liệu này thuộc về học viên Khóa Học Rau Má Đậu Xanh. Vui lòng không chia sẻ ra ngoài.</p>
        </div>
      </div>
    </div>
  )
}
