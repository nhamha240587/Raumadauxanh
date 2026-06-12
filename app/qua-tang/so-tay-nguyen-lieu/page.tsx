'use client'
import { Noto_Sans } from 'next/font/google'
import { useEffect } from 'react'

const noto = Noto_Sans({ subsets: ['vietnamese'], weight: ['400', '600', '700', '900'] })

const flavors = [
  {
    name: 'Rau Má Đậu Xanh Thuần Chay',
    emoji: '🟢',
    color: '#1B5E20',
    desc: 'Vị bùi ngọt cổ điển, màu xanh ngọc bích, phù hợp mọi độ tuổi',
    for10: [
      { name: 'Rau má tươi (lá nhỏ, xanh đậm)', qty: '500g', buy: '1kg → dùng 2 mẻ' },
      { name: 'Đậu xanh cà (bỏ vỏ)', qty: '300g', buy: '500g–1kg/lần, ngâm 2h trước' },
      { name: 'Đường trắng tinh luyện', qty: '150g', buy: 'Túi 1kg, dùng được 6–7 mẻ' },
      { name: 'Sữa đặc có đường (Ông Thọ)', qty: '80g', buy: '1 hộp 380g dùng 4–5 mẻ' },
      { name: 'Nước lọc sạch', qty: '2 lít', buy: 'Nước bình 20L ~ 15k' },
      { name: 'Đá viên sạch', qty: '1kg', buy: 'Túi 3kg ~ 15k, dùng 3 mẻ' },
    ],
    tips: [
      'Chọn rau má lá nhỏ, cuống ngắn, màu xanh đậm — không chọn loại lá to, xanh nhạt',
      'Rửa rau má 3 lần: thau to → vòi chảy → ngâm muối 5 phút → xả lại',
      'Chần rau má đúng 10–15 giây ở nước 85°C, sốc lạnh ngay để giữ màu xanh 3–4 ngày',
      'Đậu xanh cà hấp chín mềm, sên với đường và sữa đặc trên lửa nhỏ đến khi dẻo đều',
      'Tỷ lệ vàng xay: 100g rau má + 200ml nước → lọc qua rây 2 lần → nước cốt mượt mà',
    ],
    where: [
      { item: 'Rau má tươi', where: 'Chợ đầu mối hoặc vườn trồng địa phương', price: '25.000–35.000đ/kg' },
      { item: 'Đậu xanh cà', where: 'Đại lý gạo, chợ sỉ thực phẩm', price: '50.000–60.000đ/kg' },
      { item: 'Đường trắng', where: 'Đại lý đường, siêu thị bán sỉ', price: '20.000–25.000đ/kg' },
    ],
  },
  {
    name: 'Rau Má Sữa Dừa',
    emoji: '🥥',
    color: '#2E7D32',
    desc: 'Béo ngậy nồng nàn, lớp sữa trắng phủ trên nền xanh — hot trend Instagram',
    for10: [
      { name: 'Rau má tươi', qty: '500g', buy: 'Xem vị 1' },
      { name: 'Sữa dừa nước cốt (Chaokoh/Aroy-D)', qty: '800ml', buy: '2 lon 400ml ~ 60k' },
      { name: 'Đậu xanh cà', qty: '200g', buy: 'Xem vị 1' },
      { name: 'Đường trắng', qty: '120g', buy: 'Xem vị 1' },
      { name: 'Muối hạt', qty: '10g', buy: '1 túi 200g dùng cả tháng' },
      { name: 'Nước lọc', qty: '1.2 lít', buy: 'Xem vị 1' },
      { name: 'Đá viên', qty: '1kg', buy: 'Xem vị 1' },
    ],
    tips: [
      'Dùng sữa dừa lon nguyên chất (Chaokoh hoặc Aroy-D) — KHÔNG dùng sữa dừa pha bột',
      'Lắc đều lon sữa dừa trước khi mở để phần kem và nước hoà đều',
      'Thêm một chút muối vào sữa dừa để cân bằng vị béo và tăng chiều sâu hương vị',
      'Rót sữa dừa nhẹ nhàng lên mặt ly sau cùng để tạo lớp phân cách đẹp mắt',
      'Giá bán đề xuất: 45.000–50.000đ/ly — khách sẵn sàng trả thêm vì visual đẹp',
    ],
    where: [
      { item: 'Sữa dừa Chaokoh', where: 'Siêu thị, đại lý thực phẩm nhập khẩu', price: '28.000–35.000đ/lon 400ml' },
      { item: 'Sữa dừa Aroy-D', where: 'Hệ thống siêu thị BigC, MM Mega Market', price: '32.000–40.000đ/lon 400ml' },
    ],
  },
  {
    name: 'Rau Má Sầu Riêng',
    emoji: '🍈',
    color: '#388E3C',
    desc: '"Vua vị giác" — Thớ thịt sầu riêng giữ nguyên, hương đặc trưng, khách nghiện',
    for10: [
      { name: 'Rau má tươi', qty: '500g', buy: 'Xem vị 1' },
      { name: 'Thịt sầu riêng (loại Ri6 hoặc Musang King)', qty: '400g', buy: '1kg → 2.5 mẻ, chọn loại đông lạnh nếu không đúng mùa' },
      { name: 'Sữa tươi không đường', qty: '1 lít', buy: 'Bình 1L VinaMilk/TH True Milk' },
      { name: 'Sữa đặc có đường', qty: '150g', buy: 'Xem vị 1' },
      { name: 'Đường trắng', qty: '100g', buy: 'Xem vị 1' },
      { name: 'Nước lọc', qty: '800ml', buy: 'Xem vị 1' },
      { name: 'Đá viên', qty: '1kg', buy: 'Xem vị 1' },
    ],
    tips: [
      'Dùng sầu riêng tươi khi vào mùa (tháng 5–8) cho hương vị tốt nhất và giá rẻ hơn',
      'Ngoài mùa: dùng sầu riêng đông lạnh cấp đông nguyên miếng (tránh loại đã xay nhuyễn)',
      'KHÔNG xay sầu riêng hoàn toàn — bóp nhẹ để giữ thớ thịt, tạo sự khác biệt với đối thủ',
      'Tỷ lệ vàng: 40g sầu riêng + 100ml sữa tươi + 15g sữa đặc cho 1 ly 500ml',
      'Giá bán đề xuất: 55.000–65.000đ/ly — "vị premium" khách dễ chấp nhận giá cao',
    ],
    where: [
      { item: 'Sầu riêng Ri6 tươi', where: 'Chợ trái cây, vựa sầu riêng sỉ', price: '80.000–120.000đ/kg (tùy mùa)' },
      { item: 'Sầu riêng đông lạnh', where: 'Kho đông lạnh, MM Mega Market, đại lý thực phẩm', price: '130.000–180.000đ/kg' },
    ],
  },
  {
    name: 'Rau Má Khoai Môn',
    emoji: '🟣',
    color: '#43A047',
    desc: 'Màu tím nhạt đẹp mắt, vị bùi dẻo đặc trưng — ăn khách trên mạng xã hội',
    for10: [
      { name: 'Rau má tươi', qty: '500g', buy: 'Xem vị 1' },
      { name: 'Khoai môn tím (Bến Tre / Đà Lạt)', qty: '500g', buy: 'Hấp chín, bóc vỏ, nghiền mịn trước khi dùng' },
      { name: 'Sữa tươi không đường', qty: '1 lít', buy: 'Xem vị 3' },
      { name: 'Sữa đặc có đường', qty: '100g', buy: 'Xem vị 1' },
      { name: 'Đường trắng', qty: '100g', buy: 'Xem vị 1' },
      { name: 'Vanilla extract (tuỳ chọn)', qty: '2ml', buy: 'Tăng hương thơm, 1 lọ nhỏ dùng cả tháng' },
      { name: 'Đá viên', qty: '1kg', buy: 'Xem vị 1' },
    ],
    tips: [
      'Chọn khoai môn Bến Tre (tím bên trong) hoặc khoai môn Đà Lạt — không dùng khoai môn trắng',
      'Hấp khoai môn đến khi xiên tăm xuyên qua dễ dàng — xay nóng luôn khi còn ấm',
      'Lọc khoai môn qua rây để loại bỏ xơ — nước cốt mịn mượt, không có cặn',
      'Màu tím tự nhiên của khoai rất đẹp trên mạng xã hội — đăng nhiều ảnh/video sẽ ra đơn nhanh',
      'Giá bán đề xuất: 45.000–50.000đ/ly. Combo "Khoai môn + Sầu riêng" bán rất tốt',
    ],
    where: [
      { item: 'Khoai môn tím Bến Tre', where: 'Chợ đầu mối, vựa rau củ sỉ', price: '30.000–45.000đ/kg' },
      { item: 'Khoai môn Đà Lạt', where: 'Siêu thị, chợ thực phẩm sạch', price: '35.000–55.000đ/kg' },
    ],
  },
  {
    name: 'Rau Má Bí Đỏ',
    emoji: '🟠',
    color: '#66BB6A',
    desc: 'Màu cam vàng óng ả, vị ngọt tự nhiên nhẹ nhàng, thu hút khách family & trẻ em',
    for10: [
      { name: 'Rau má tươi', qty: '500g', buy: 'Xem vị 1' },
      { name: 'Bí đỏ (bí Nhật hoặc bí đỏ thường)', qty: '500g', buy: 'Hấp chín, lọc nhuyễn, bảo quản tủ lạnh 2–3 ngày' },
      { name: 'Sữa tươi không đường', qty: '800ml', buy: 'Xem vị 3' },
      { name: 'Sữa đặc có đường', qty: '80g', buy: 'Bí đã ngọt tự nhiên, giảm lượng sữa đặc' },
      { name: 'Đường trắng', qty: '60g', buy: 'Ít hơn các vị khác do bí đã ngọt' },
      { name: 'Quế bột (tuỳ chọn)', qty: '1g', buy: 'Tạo hương ấm đặc trưng, 1 hộp nhỏ dùng rất lâu' },
      { name: 'Đá viên', qty: '1kg', buy: 'Xem vị 1' },
    ],
    tips: [
      'Bí Nhật (kabocha) ngọt hơn và màu đẹp hơn bí đỏ thường — nhưng giá cao gấp đôi',
      'Hấp bí đến khi mềm hoàn toàn, lọc qua rây để loại hết xơ',
      'Màu cam tươi của bí đỏ rất đẹp khi chụp ảnh — đặc biệt hấp dẫn phân khúc khách trẻ và gia đình',
      'Thêm 1 nhúm quế bột nhỏ khi xay tạo hương ấm đặc trưng — bán được giá cao hơn 5.000đ/ly',
      'Giá bán đề xuất: 40.000–45.000đ/ly. Vị dễ làm nhất trong 5 vị, phù hợp người mới bắt đầu',
    ],
    where: [
      { item: 'Bí Nhật (kabocha)', where: 'Siêu thị, chợ thực phẩm sạch, chuỗi rau sạch', price: '35.000–50.000đ/kg' },
      { item: 'Bí đỏ thường', where: 'Chợ rau củ, siêu thị', price: '15.000–25.000đ/kg' },
    ],
  },
]

export default function SoTayNguyenLieuPage() {
  useEffect(() => { document.title = 'Sổ Tay Nguyên Liệu 5 Vị Rau Má – Bếp Cô Hạ' }, [])
  return (
    <div className={noto.className} style={{ background: '#fff', minHeight: '100vh' }}>
      <div className="no-print" style={{ background: '#1B5E20', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ color: '#fff' }}>
          <strong style={{ fontSize: 16 }}>🌿 Bếp Cô Hạ</strong>
          <span style={{ color: '#A5D6A7', fontSize: 13, marginLeft: 12 }}>Sổ Tay Nguyên Liệu 5 Vị Rau Má</span>
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
          .flavor-block { page-break-inside: avoid; }
        }
        @page { margin: 1.5cm; size: A4; }
      `}</style>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28, borderBottom: '3px solid #2E7D32', paddingBottom: 20 }}>
          <div style={{ fontSize: 13, color: '#43A047', fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>QUÀ TẶNG KÈM KHÓA HỌC · BẾP CÔ HẠ</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1B5E20', margin: '0 0 6px' }}>📓 Sổ Tay Nguyên Liệu 5 Vị Rau Má</h1>
          <p style={{ fontSize: 14, color: '#555', margin: 0 }}>Mua Đúng, Không Mua Thừa — In Ra Mang Đi Chợ</p>
        </div>

        {/* How to use */}
        <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', borderRadius: 10, padding: '14px 18px', marginBottom: 28, fontSize: 12 }}>
          <p style={{ fontWeight: 700, color: '#1B5E20', margin: '0 0 8px' }}>📌 CÁCH SỬ DỤNG SỔ TAY NÀY:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[
              '✅ In ra và mang đi chợ — gạch từng nguyên liệu đã mua',
              '✅ Mỗi bảng = nguyên liệu cho 10 ly — nhân lên theo nhu cầu',
              '✅ Mua theo "Gợi ý mua" để tiết kiệm chi phí tối đa',
              '✅ Giữ sổ tay này bên cạnh bếp khi chế biến để đối chiếu',
            ].map(tip => <p key={tip} style={{ margin: 0, color: '#444' }}>{tip}</p>)}
          </div>
        </div>

        {/* Flavor sections */}
        {flavors.map((flavor, fi) => (
          <div key={flavor.name} className="flavor-block" style={{ marginBottom: 36 }}>
            {/* Flavor header */}
            <div style={{ background: flavor.color, color: '#fff', padding: '12px 18px', borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>{flavor.emoji}</span>
              <div>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>VỊ {fi + 1}: {flavor.name.toUpperCase()}</p>
                <p style={{ margin: 0, fontSize: 12, opacity: 0.85 }}>{flavor.desc}</p>
              </div>
            </div>

            {/* Ingredients table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#F1F8E9' }}>
                  {['', 'Nguyên liệu', 'Lượng cần (10 ly)', 'Gợi ý mua', 'Đã mua ✓'].map(h => (
                    <th key={h} style={{ border: '1px solid #C8E6C9', padding: '8px 10px', textAlign: 'left', color: flavor.color, fontWeight: 700, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flavor.for10.map((item, i) => (
                  <tr key={item.name} style={{ background: i % 2 === 0 ? '#fff' : '#F9FBF9' }}>
                    <td style={{ border: '1px solid #E0E0E0', padding: '8px 10px', textAlign: 'center', width: 28 }}>
                      <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid #2E7D32', borderRadius: 3 }}></span>
                    </td>
                    <td style={{ border: '1px solid #E0E0E0', padding: '8px 10px', fontWeight: 600 }}>{item.name}</td>
                    <td style={{ border: '1px solid #E0E0E0', padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: flavor.color }}>{item.qty}</td>
                    <td style={{ border: '1px solid #E0E0E0', padding: '8px 10px', fontSize: 11, color: '#555' }}>{item.buy}</td>
                    <td style={{ border: '1px solid #E0E0E0', padding: '8px 10px', width: 60 }}></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Tips */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid #C8E6C9', borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', borderRight: '1px solid #C8E6C9', background: '#F9FBF9' }}>
                <p style={{ fontWeight: 700, color: flavor.color, fontSize: 12, margin: '0 0 8px' }}>💡 MẸO CHẾ BIẾN & BẢO QUẢN:</p>
                {flavor.tips.map((tip, i) => (
                  <p key={i} style={{ margin: '0 0 5px', fontSize: 11.5, color: '#333', lineHeight: 1.5 }}>• {tip}</p>
                ))}
              </div>
              <div style={{ padding: '14px 16px', background: '#fff' }}>
                <p style={{ fontWeight: 700, color: flavor.color, fontSize: 12, margin: '0 0 8px' }}>🛒 MUA Ở ĐÂU & GIÁ THAM KHẢO:</p>
                {flavor.where.map((w, i) => (
                  <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: i < flavor.where.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 12, color: '#333' }}>{w.item}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#555' }}>📍 {w.where}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: flavor.color, fontWeight: 700 }}>💰 {w.price}</p>
                  </div>
                ))}
                <div style={{ marginTop: 8, padding: 10, background: '#F1F8E9', borderRadius: 8 }}>
                  <p style={{ margin: 0, fontSize: 11, color: '#555' }}>📝 Ghi chú thêm:</p>
                  <div style={{ borderBottom: '1px dashed #C8E6C9', marginTop: 20 }}></div>
                  <div style={{ borderBottom: '1px dashed #C8E6C9', marginTop: 20 }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Shopping list summary */}
        <div style={{ border: '2px solid #1B5E20', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
          <h2 style={{ color: '#1B5E20', fontSize: 16, fontWeight: 900, margin: '0 0 16px' }}>🛒 DANH SÁCH MUA CHUNG (Tất cả 5 vị)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
            {[
              { item: 'Rau má tươi', note: '~2–3kg/ngày nếu bán 50 ly', check: true },
              { item: 'Đậu xanh cà (bỏ vỏ)', note: 'Mua 5kg, dùng 1–2 tuần', check: true },
              { item: 'Đường trắng tinh', note: 'Bao 50kg giá sỉ ~900k', check: true },
              { item: 'Sữa đặc Ông Thọ', note: 'Thùng 48 hộp ~1.2tr', check: true },
              { item: 'Sữa tươi không đường', note: 'Thùng 12 hộp 1L', check: true },
              { item: 'Sữa dừa Chaokoh/Aroy-D', note: 'Thùng 24 lon', check: true },
              { item: 'Sầu riêng đông lạnh', note: 'Mua 2–3kg khi có chương trình giảm', check: true },
              { item: 'Khoai môn tím', note: 'Mua 3–5kg/tuần', check: true },
              { item: 'Bí đỏ/Bí Nhật', note: '3–5kg/tuần, mua tại chợ đầu mối', check: true },
              { item: 'Ly nhựa 500ml + nắp', note: 'Đặt 1000 cái in logo, ~170k', check: true },
              { item: 'Ống hút', note: '1000 ống, ~80k', check: true },
              { item: 'Đá viên sạch', note: 'Đặt giao hàng ngày hoặc tự làm đá', check: true },
            ].map(({ item, note, check }) => (
              <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px dashed #E0E0E0' }}>
                <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #2E7D32', borderRadius: 3, flexShrink: 0, marginTop: 2 }}></span>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 12 }}>{item}</p>
                  <p style={{ margin: 0, fontSize: 10.5, color: '#666' }}>{note}</p>
                </div>
              </div>
            ))}
          </div>
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
