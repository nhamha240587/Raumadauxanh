'use client'
import { Noto_Sans } from 'next/font/google'

import { useEffect } from 'react'

const noto = Noto_Sans({ subsets: ['vietnamese'], weight: ['400', '600', '700', '900'] })

const flavors = [
  {
    name: 'Rau Má Đậu Xanh Thuần Chay',
    emoji: '🟢',
    price: 40000,
    items: [
      { name: 'Rau má tươi', qty: '50g', unit: 'kg', unitPrice: 30000, note: 'Chọn loại lá nhỏ, xanh đậm' },
      { name: 'Đậu xanh cà (đã bỏ vỏ)', qty: '30g', unit: 'kg', unitPrice: 55000, note: 'Ngâm 2h, hấp chín mềm' },
      { name: 'Đường trắng tinh', qty: '15g', unit: 'kg', unitPrice: 22000, note: 'Hoặc đường phèn tuỳ khẩu vị' },
      { name: 'Sữa đặc có đường', qty: '10g', unit: 'hộp 380g', unitPrice: 28000, note: 'Tạo vị béo nhẹ' },
      { name: 'Nước lọc', qty: '200ml', unit: 'bình 20L', unitPrice: 15000, note: '' },
      { name: 'Đá viên', qty: '100g', unit: 'túi 3kg', unitPrice: 15000, note: '' },
      { name: 'Ly nhựa 500ml + nắp', qty: '1 cái', unit: '100 cái', unitPrice: 85000, note: '' },
      { name: 'Ống hút', qty: '1 cái', unit: '100 cái', unitPrice: 12000, note: '' },
    ],
  },
  {
    name: 'Rau Má Sữa Dừa',
    emoji: '🥥',
    price: 45000,
    items: [
      { name: 'Rau má tươi', qty: '50g', unit: 'kg', unitPrice: 30000, note: '' },
      { name: 'Sữa dừa (nước cốt)', qty: '80ml', unit: 'lon 400ml', unitPrice: 30000, note: 'Chaokoh hoặc Aroy-D' },
      { name: 'Đậu xanh cà', qty: '20g', unit: 'kg', unitPrice: 55000, note: '' },
      { name: 'Đường trắng', qty: '12g', unit: 'kg', unitPrice: 22000, note: '' },
      { name: 'Muối hạt', qty: '1g', unit: 'kg', unitPrice: 8000, note: 'Cân bằng vị béo' },
      { name: 'Nước lọc', qty: '120ml', unit: 'bình 20L', unitPrice: 15000, note: '' },
      { name: 'Đá viên', qty: '100g', unit: 'túi 3kg', unitPrice: 15000, note: '' },
      { name: 'Ly + nắp + ống hút', qty: '1 bộ', unit: '100 bộ', unitPrice: 97000, note: '' },
    ],
  },
  {
    name: 'Rau Má Sầu Riêng',
    emoji: '🍈',
    price: 55000,
    items: [
      { name: 'Rau má tươi', qty: '50g', unit: 'kg', unitPrice: 30000, note: '' },
      { name: 'Thịt sầu riêng (loại ngon)', qty: '40g', unit: 'kg', unitPrice: 120000, note: 'Ri6 hoặc Musang King' },
      { name: 'Sữa tươi không đường', qty: '100ml', unit: 'hộp 1L', unitPrice: 32000, note: '' },
      { name: 'Sữa đặc', qty: '15g', unit: 'hộp 380g', unitPrice: 28000, note: '' },
      { name: 'Đường trắng', qty: '10g', unit: 'kg', unitPrice: 22000, note: '' },
      { name: 'Nước lọc', qty: '80ml', unit: 'bình 20L', unitPrice: 15000, note: '' },
      { name: 'Đá viên', qty: '100g', unit: 'túi 3kg', unitPrice: 15000, note: '' },
      { name: 'Ly + nắp + ống hút', qty: '1 bộ', unit: '100 bộ', unitPrice: 97000, note: '' },
    ],
  },
  {
    name: 'Rau Má Khoai Môn',
    emoji: '🟣',
    price: 45000,
    items: [
      { name: 'Rau má tươi', qty: '50g', unit: 'kg', unitPrice: 30000, note: '' },
      { name: 'Khoai môn tím (đã hấp chín)', qty: '50g', unit: 'kg', unitPrice: 35000, note: 'Khoai môn Bến Tre' },
      { name: 'Sữa tươi', qty: '100ml', unit: 'hộp 1L', unitPrice: 32000, note: '' },
      { name: 'Sữa đặc', qty: '10g', unit: 'hộp 380g', unitPrice: 28000, note: '' },
      { name: 'Đường', qty: '10g', unit: 'kg', unitPrice: 22000, note: '' },
      { name: 'Nước lọc', qty: '100ml', unit: 'bình 20L', unitPrice: 15000, note: '' },
      { name: 'Đá viên', qty: '100g', unit: 'túi 3kg', unitPrice: 15000, note: '' },
      { name: 'Ly + nắp + ống hút', qty: '1 bộ', unit: '100 bộ', unitPrice: 97000, note: '' },
    ],
  },
  {
    name: 'Rau Má Bí Đỏ',
    emoji: '🟠',
    price: 42000,
    items: [
      { name: 'Rau má tươi', qty: '50g', unit: 'kg', unitPrice: 30000, note: '' },
      { name: 'Bí đỏ (đã hấp + lọc nhuyễn)', qty: '50g', unit: 'kg', unitPrice: 18000, note: 'Bí Nhật ngọt hơn' },
      { name: 'Sữa tươi', qty: '80ml', unit: 'hộp 1L', unitPrice: 32000, note: '' },
      { name: 'Sữa đặc', qty: '10g', unit: 'hộp 380g', unitPrice: 28000, note: '' },
      { name: 'Đường', qty: '8g', unit: 'kg', unitPrice: 22000, note: 'Bí đã ngọt tự nhiên' },
      { name: 'Nước lọc', qty: '120ml', unit: 'bình 20L', unitPrice: 15000, note: '' },
      { name: 'Đá viên', qty: '100g', unit: 'túi 3kg', unitPrice: 15000, note: '' },
      { name: 'Ly + nắp + ống hút', qty: '1 bộ', unit: '100 bộ', unitPrice: 97000, note: '' },
    ],
  },
]

function calcCost(items: typeof flavors[0]['items']) {
  return items.reduce((sum, item) => {
    const qty = parseFloat(item.qty)
    const unit = item.qty.includes('ml') ? 1 / 1000 : item.qty.includes('g') ? 1 / 1000 : 1
    return sum + (qty * unit * item.unitPrice)
  }, 0)
}

export default function FoodCostPage() {
  useEffect(() => { document.title = 'Bảng Tính Food Cost Rau Má – Bếp Cô Hạ' }, [])
  return (
    <div className={noto.className} style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Print button — hidden when printing */}
      <div className="no-print" style={{ background: '#1B5E20', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ color: '#fff' }}>
          <strong style={{ fontSize: 16 }}>🌿 Bếp Cô Hạ</strong>
          <span style={{ color: '#A5D6A7', fontSize: 13, marginLeft: 12 }}>Bảng Tính Food Cost Rau Má Đậu Xanh</span>
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
          table { page-break-inside: avoid; }
          .page-break { page-break-before: always; }
        }
        @page { margin: 1.5cm; size: A4; }
      `}</style>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32, borderBottom: '3px solid #2E7D32', paddingBottom: 20 }}>
          <div style={{ fontSize: 13, color: '#43A047', fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>QUÀ TẶNG KÈM KHÓA HỌC · BẾP CÔ HẠ</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1B5E20', margin: '0 0 6px' }}>📊 Bảng Tính Food Cost Tự Động</h1>
          <p style={{ fontSize: 14, color: '#555', margin: 0 }}>Biết Ngay Lãi Bao Nhiêu Mỗi Ly — Kinh Doanh Rau Má Đậu Xanh</p>
        </div>

        {/* Formula box */}
        <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', borderRadius: 12, padding: '16px 20px', marginBottom: 28 }}>
          <p style={{ fontWeight: 700, color: '#1B5E20', marginBottom: 10, fontSize: 14 }}>🧮 CÔNG THỨC CỐT LÕI CẦN NHỚ:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              ['Food Cost %', '(Giá vốn nguyên liệu ÷ Giá bán) × 100%'],
              ['Lợi nhuận gộp/ly', 'Giá bán − Giá vốn nguyên liệu'],
              ['Điểm hoà vốn (ly/ngày)', 'Chi phí cố định/ngày ÷ Lợi nhuận gộp/ly'],
              ['Doanh thu/ngày', 'Số ly bán × Giá bán'],
            ].map(([label, formula]) => (
              <div key={label} style={{ background: '#fff', borderRadius: 8, padding: '10px 14px', border: '1px solid #C8E6C9' }}>
                <p style={{ fontSize: 11, color: '#43A047', fontWeight: 700, margin: '0 0 3px', textTransform: 'uppercase' }}>{label}</p>
                <p style={{ fontSize: 12, color: '#333', margin: 0 }}>{formula}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#555', marginTop: 10, marginBottom: 0 }}>
            💡 <strong>Mục tiêu:</strong> Food Cost % nên ở mức <strong style={{ color: '#1B5E20' }}>30–40%</strong> để đảm bảo lợi nhuận bền vững sau khi trừ chi phí vận hành.
          </p>
        </div>

        {/* Per-flavor cost tables */}
        {flavors.map((flavor, idx) => {
          const estimatedCost = Math.round(calcCost(flavor.items))
          const profit = flavor.price - estimatedCost
          const fcPct = Math.round((estimatedCost / flavor.price) * 100)
          return (
            <div key={flavor.name} style={{ marginBottom: 32 }} className={idx > 0 && idx % 2 === 0 ? 'page-break' : ''}>
              <div style={{ background: '#1B5E20', color: '#fff', padding: '10px 16px', borderRadius: '10px 10px 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>{flavor.emoji}</span>
                <strong style={{ fontSize: 15 }}>{idx + 1}. {flavor.name}</strong>
                <span style={{ marginLeft: 'auto', fontSize: 13, color: '#A5D6A7' }}>Giá bán đề xuất: <strong style={{ color: '#FDD835' }}>{flavor.price.toLocaleString('vi-VN')}đ/ly</strong></span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#E8F5E9' }}>
                    {['Nguyên liệu', 'Lượng/ly', 'Đơn vị tính', 'Đơn giá (đ)', 'Thành tiền (đ)', 'Ghi chú'].map(h => (
                      <th key={h} style={{ border: '1px solid #C8E6C9', padding: '7px 10px', textAlign: 'left', color: '#1B5E20', fontWeight: 700, fontSize: 11 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {flavor.items.map((item, i) => {
                    const qtyNum = parseFloat(item.qty)
                    const unitMul = item.qty.includes('ml') ? 1 / 1000 : item.qty.includes('g') ? 1 / 1000 : 1
                    const total = Math.round(qtyNum * unitMul * item.unitPrice)
                    return (
                      <tr key={item.name} style={{ background: i % 2 === 0 ? '#fff' : '#F9FBF9' }}>
                        <td style={{ border: '1px solid #E0E0E0', padding: '7px 10px', fontWeight: 600 }}>{item.name}</td>
                        <td style={{ border: '1px solid #E0E0E0', padding: '7px 10px', textAlign: 'center' }}>{item.qty}</td>
                        <td style={{ border: '1px solid #E0E0E0', padding: '7px 10px' }}>{item.unit}</td>
                        <td style={{ border: '1px solid #E0E0E0', padding: '7px 10px', textAlign: 'right' }}>{item.unitPrice.toLocaleString('vi-VN')}</td>
                        <td style={{ border: '1px solid #E0E0E0', padding: '7px 10px', textAlign: 'right', fontWeight: 600 }}>{total > 0 ? total.toLocaleString('vi-VN') : '___'}</td>
                        <td style={{ border: '1px solid #E0E0E0', padding: '7px 10px', color: '#666', fontSize: 11 }}>{item.note}</td>
                      </tr>
                    )
                  })}
                  <tr style={{ background: '#FFF8E1', fontWeight: 700 }}>
                    <td colSpan={4} style={{ border: '1px solid #FFE082', padding: '8px 10px', color: '#F57F17' }}>TỔNG GIÁ VỐN NGUYÊN LIỆU/LY (ước tính)</td>
                    <td style={{ border: '1px solid #FFE082', padding: '8px 10px', textAlign: 'right', color: '#E53935', fontSize: 14 }}>≈ {estimatedCost.toLocaleString('vi-VN')}đ</td>
                    <td style={{ border: '1px solid #FFE082', padding: '8px 10px' }}></td>
                  </tr>
                </tbody>
              </table>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, border: '1px solid #C8E6C9', borderTop: 'none' }}>
                {[
                  { label: 'Giá bán đề xuất', value: `${flavor.price.toLocaleString('vi-VN')}đ`, color: '#1B5E20' },
                  { label: 'Lợi nhuận gộp/ly', value: `${profit.toLocaleString('vi-VN')}đ`, color: '#2E7D32' },
                  { label: 'Food Cost %', value: `≈ ${fcPct}%`, color: fcPct <= 38 ? '#2E7D32' : '#E65100' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ padding: '10px 14px', textAlign: 'center', borderRight: '1px solid #C8E6C9' }}>
                    <p style={{ fontSize: 10, color: '#666', margin: '0 0 3px', textTransform: 'uppercase', fontWeight: 600 }}>{label}</p>
                    <p style={{ fontSize: 17, fontWeight: 900, color, margin: 0 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Break-even table */}
        <div className="page-break" style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#1B5E20', marginBottom: 16 }}>📈 Bảng Tính Điểm Hoà Vốn Theo Ngày</h2>
          <div style={{ background: '#FFF3E0', border: '1px solid #FFCC80', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 12 }}>
            <p style={{ margin: 0, color: '#E65100', fontWeight: 600 }}>💡 Chi phí cố định/ngày = (Thuê mặt bằng + Điện/nước + Lao động + Khấu hao dụng cụ) ÷ 30</p>
            <p style={{ margin: '6px 0 0', color: '#555' }}>Ví dụ: Thuê 3tr + điện 500k + lao động 5tr + dụng cụ 1tr = 9.500.000đ/tháng ÷ 30 = 316.667đ/ngày</p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#1B5E20', color: '#fff' }}>
                {['Tình huống', 'Chi phí CĐ/ngày', 'Lợi nhuận gộp/ly', 'Cần bán (ly/ngày)', 'Bán 30 ly/ngày', 'Bán 50 ly/ngày'].map(h => (
                  <th key={h} style={{ border: '1px solid #388E3C', padding: '8px 10px', textAlign: 'center', fontWeight: 700, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { case: 'Xe đẩy nhỏ (chi phí thấp)', fixed: 120000, profit: 26000 },
                { case: 'Quán nhỏ tự vận hành', fixed: 317000, profit: 26000 },
                { case: 'Quán nhỏ có 1 nhân viên', fixed: 483000, profit: 26000 },
                { case: 'Gian hàng chợ / trường học', fixed: 200000, profit: 26000 },
              ].map(({ case: c, fixed, profit }, i) => {
                const breakEven = Math.ceil(fixed / profit)
                const rev30 = (30 * 40000 - 30 * profit - fixed).toLocaleString('vi-VN')
                const rev50 = (50 * 40000 - 50 * profit - fixed).toLocaleString('vi-VN')
                return (
                  <tr key={c} style={{ background: i % 2 === 0 ? '#fff' : '#F9FBF9' }}>
                    <td style={{ border: '1px solid #E0E0E0', padding: '8px 10px', fontWeight: 600 }}>{c}</td>
                    <td style={{ border: '1px solid #E0E0E0', padding: '8px 10px', textAlign: 'right' }}>{fixed.toLocaleString('vi-VN')}đ</td>
                    <td style={{ border: '1px solid #E0E0E0', padding: '8px 10px', textAlign: 'right' }}>≈ {profit.toLocaleString('vi-VN')}đ</td>
                    <td style={{ border: '1px solid #E0E0E0', padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#E53935' }}>{breakEven} ly</td>
                    <td style={{ border: '1px solid #E0E0E0', padding: '8px 10px', textAlign: 'right', color: '#2E7D32', fontWeight: 700 }}>+{rev30}đ</td>
                    <td style={{ border: '1px solid #E0E0E0', padding: '8px 10px', textAlign: 'right', color: '#1B5E20', fontWeight: 700 }}>+{rev50}đ</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p style={{ fontSize: 11, color: '#666', marginTop: 10 }}>* Số liệu mang tính tham khảo. Giá nguyên liệu thực tế có thể dao động theo vùng và mùa vụ. Cập nhật lại khi giá thay đổi.</p>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40, paddingTop: 20, borderTop: '2px solid #C8E6C9', textAlign: 'center' }}>
          <p style={{ color: '#43A047', fontWeight: 700, fontSize: 13 }}>🌿 Bếp Cô Hạ · Hacofood.vn</p>
          <p style={{ color: '#999', fontSize: 11 }}>Tài liệu này thuộc về học viên Khóa Học Rau Má Đậu Xanh. Vui lòng không chia sẻ ra ngoài.</p>
        </div>
      </div>
    </div>
  )
}
