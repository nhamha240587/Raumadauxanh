const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const COURSE_GROUP_ID = process.env.TELEGRAM_COURSE_GROUP_ID || ''

async function sendMessage(chatId: string, text: string) {
  if (!BOT_TOKEN || !chatId) return
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })
}

export async function notifyCourseLead(data: {
  name: string; email: string; phone: string
  paymentRef: string; status: 'pending' | 'paid'; amount?: number
}) {
  const isPaid = data.status === 'paid'
  const amountText = (data.amount ?? 299000).toLocaleString('vi-VN') + 'đ'
  const msg = `${isPaid ? '🟢' : '🔴'} <b>KHÓA RÂU MÁ ĐẬU XANH – ${isPaid ? 'ĐÃ THANH TOÁN' : 'CHỜ THANH TOÁN'}</b>

• Tên: <b>${data.name}</b>
• Email: ${data.email}
• SĐT: ${data.phone}
• Mã GD: <code>${data.paymentRef}</code>
• Số tiền: <b>${amountText}</b>
• Thời gian: ${new Date().toLocaleString('vi-VN')}`
  await sendMessage(COURSE_GROUP_ID, msg)
}

export async function notifyPaymentMismatch(data: {
  paymentRef: string; received: number; expected: number; content: string
}) {
  const msg = `⚠️ <b>CHUYỂN THIẾU TIỀN – RÂU MÁ ĐẬU XANH</b>

• Mã GD: <code>${data.paymentRef}</code>
• Nhận được: <b>${data.received.toLocaleString('vi-VN')}đ</b>
• Cần: <b>${data.expected.toLocaleString('vi-VN')}đ</b>
• Nội dung CK: ${data.content}
• Thời gian: ${new Date().toLocaleString('vi-VN')}

→ Vui lòng xử lý thủ công!`
  await sendMessage(COURSE_GROUP_ID, msg)
}
