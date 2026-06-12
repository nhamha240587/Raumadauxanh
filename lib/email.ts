import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || 'dummy_key_for_build')
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'Bếp Cô Hạ <no-reply@hacofood.vn>'

export async function sendCourseConfirmEmail(to: { name: string; email: string; amount: number }) {
  const groupLink = process.env.NEXT_PUBLIC_COURSE_GROUP_LINK || '#'
  const amountText = to.amount.toLocaleString('vi-VN') + 'đ'

  return getResend().emails.send({
    from: FROM_EMAIL,
    to: [to.email],
    subject: '✅ Xác nhận đăng ký – Khóa Học Rau Má Đậu Xanh | Bếp Cô Hạ',
    html: `
<!DOCTYPE html>
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
        <h3 style="color:#1B5E20;margin-top:0;font-size:16px;">📌 Bước tiếp theo:</h3>
        <p style="margin:0 0 16px;color:#374151;font-size:14px;line-height:1.7;">
          1. Vào nhóm kín học viên bên dưới<br/>
          2. Xem video hướng dẫn trong nhóm<br/>
          3. Thực hành và đặt câu hỏi trực tiếp với Cô Hạ
        </p>
        <a href="${groupLink}" style="display:inline-block;background:#2E7D32;color:#fff;padding:13px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
          🌿 Vào nhóm học viên ngay
        </a>
      </div>
      <div style="background:#FFF8E1;border-radius:8px;padding:16px 20px;margin:20px 0;font-size:13px;color:#795548;">
        <strong>💡 Lưu ý:</strong> Giữ email này để truy cập lại khi cần.<br/>
        Nếu có thắc mắc, nhắn tin trực tiếp cho Cô Hạ trong nhóm nhé!
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
