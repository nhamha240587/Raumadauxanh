import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || 'dummy_key_for_build')
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'Bếp Cô Hạ <no-reply@hacofood.vn>'

export async function sendCourseConfirmEmail(to: { name: string; email: string; amount: number; paymentRef?: string }) {
  const groupLink = process.env.COURSE_GROUP_LINK || process.env.NEXT_PUBLIC_COURSE_GROUP_LINK || '#'
  const siteUrl = process.env.BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://hacofood.vn')
  const amountText = to.amount.toLocaleString('vi-VN') + 'đ'

  const refParam = to.paymentRef ? `?ref=${encodeURIComponent(to.paymentRef)}` : ''
  const giftsHtml = [
    { icon: '📊', name: 'Bảng Tính Food Cost Tự Động', path: '/qua-tang/bang-tinh-food-cost', value: '499.000đ' },
    { icon: '✅', name: 'Checklist 47 Bước Ra Quán Chuẩn', path: '/qua-tang/checklist-mo-quan', value: '399.000đ' },
    { icon: '📓', name: 'Sổ Tay Nguyên Liệu 5 Vị', path: '/qua-tang/so-tay-nguyen-lieu', value: '299.000đ' },
  ].map(g => `
    <div style="background:#F9FBF9;border:1px solid #C8E6C9;border-radius:10px;padding:12px 16px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
      <div>
        <p style="margin:0;font-weight:700;color:#1B5E20;font-size:14px;">${g.icon} ${g.name}</p>
        <p style="margin:3px 0 0;font-size:12px;color:#888;">Trị giá <s>${g.value}</s> — Tặng kèm miễn phí</p>
      </div>
      <a href="${siteUrl}${g.path}${refParam}" target="_blank"
        style="display:inline-block;background:#1B5E20;color:#fff;padding:8px 14px;border-radius:7px;text-decoration:none;font-weight:700;font-size:12px;white-space:nowrap;flex-shrink:0;">
        📥 Tải PDF
      </a>
    </div>`).join('')

  return getResend().emails.send({
    from: FROM_EMAIL,
    to: [to.email],
    subject: '✅ Xác nhận đăng ký – Khóa Học Rau Má Đậu Xanh | Bếp Cô Hạ',
    html: `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f0fff4;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#1B5E20,#2E7D32);padding:36px 32px;text-align:center;">
      <p style="font-size:48px;margin:0 0 8px;">🌿</p>
      <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800;">Khóa Học Rau Má Đậu Xanh</h1>
      <p style="color:#A5D6A7;margin:6px 0 0;font-size:14px;">Bếp Cô Hạ · Hacofood.vn</p>
    </div>
    <div style="padding:36px 32px;">
      <h2 style="color:#1B5E20;font-size:20px;margin-top:0;">Xin chào ${to.name}! 🎉</h2>
      <p style="color:#374151;line-height:1.8;font-size:15px;">
        Cô Hạ xác nhận đã nhận được thanh toán <strong>${amountText}</strong> từ bạn.<br/>
        Chào mừng bạn vào lớp học Rau Má Đậu Xanh!
      </p>

      <div style="background:#f0fff4;border-left:4px solid #2E7D32;border-radius:8px;padding:20px 24px;margin:24px 0;">
        <h3 style="color:#1B5E20;margin-top:0;font-size:15px;">📌 Bước 1 — Vào nhóm học viên kín</h3>
        <p style="margin:0 0 14px;color:#374151;font-size:14px;line-height:1.7;">
          Toàn bộ video bài giảng, hỗ trợ và cộng đồng học viên đều có trong nhóm này.
        </p>
        <a href="${groupLink}" style="display:inline-block;background:#2E7D32;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
          🌿 Vào nhóm học viên ngay
        </a>
      </div>

      <div style="margin:24px 0;">
        <h3 style="color:#1B5E20;font-size:15px;margin-bottom:6px;">🎁 Bước 2 — Tải 3 tài liệu quà tặng của bạn</h3>
        <p style="color:#374151;font-size:13px;margin:0 0 12px;">Nhấn vào từng nút, mở trang lên rồi bấm <strong>"Tải PDF / In ra"</strong> để lưu về máy.</p>
        ${giftsHtml}
      </div>

      <div style="background:#FFF8E1;border-radius:8px;padding:16px 20px;margin:20px 0;font-size:13px;color:#795548;">
        <strong>💡 Lưu ý:</strong> Giữ email này để tải lại tài liệu bất kỳ lúc nào.<br/>
        Có thắc mắc? Nhắn Cô Hạ trong nhóm kín — hỗ trợ đến khi bạn thành công!
      </div>
    </div>
    <div style="background:#F9FBE7;padding:20px 32px;text-align:center;font-size:12px;color:#9CA3AF;">
      © Bếp Cô Hạ · Hacofood.vn · Email này được gửi tự động, vui lòng không reply
    </div>
  </div>
</body>
</html>`,
  })
}
