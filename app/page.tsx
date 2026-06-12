'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData { name: string; email: string; phone: string }
interface QRData {
  qrUrl: string; bankAccount: string; bankCode: string
  accountName: string; amount: number; content: string; paymentRef: string
}
type Step = 'idle' | 'loading' | 'success' | 'error'

function fmt(n: number) { return n.toLocaleString('vi-VN') + 'đ' }

// ─── Countdown ────────────────────────────────────────────────────────────────
function useCountdown(hours = 5.3) {
  const [time, setTime] = useState({ h: Math.floor(hours), m: Math.round((hours % 1) * 60), s: 0 })
  useEffect(() => {
    const key = 'haco_rauma_cd3'
    const stored = typeof window !== 'undefined' ? localStorage.getItem(key) : null
    const end = stored ? parseInt(stored) : Date.now() + hours * 3600000
    if (!stored) localStorage.setItem(key, String(end))
    const tick = () => {
      const d = Math.max(0, end - Date.now())
      setTime({ h: Math.floor(d / 3600000), m: Math.floor((d % 3600000) / 60000), s: Math.floor((d % 60000) / 1000) })
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [hours])
  return time
}

function CountdownBox({ dark = false }: { dark?: boolean }) {
  const { h, m, s } = useCountdown(5.3)
  const box = dark
    ? 'bg-white/20 text-white border border-white/40 backdrop-blur-sm'
    : 'bg-white text-[#1B5E20] border-2 border-[#A5D6A7] shadow-sm'
  return (
    <div className="flex items-center gap-1.5 justify-center">
      {([['Giờ', h], ['Phút', m], ['Giây', s]] as [string, number][]).map(([label, val]) => (
        <div key={label} className={`${box} rounded-xl px-3 py-2 text-center min-w-[54px]`}>
          <div className="font-mono font-black text-2xl leading-none tabular-nums">{String(val).padStart(2, '0')}</div>
          <div className={`text-[10px] mt-0.5 font-medium tracking-wide ${dark ? 'text-white/70' : 'text-gray-400'}`}>{label.toUpperCase()}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Lead Form ────────────────────────────────────────────────────────────────
function LeadForm({ ctaText, onSuccess }: {
  ctaText: string
  onSuccess: (data: FormData & Record<string, unknown>) => void
}) {
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '' })
  const [step, setStep] = useState<Step>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Vui lòng điền đầy đủ 3 thông tin'); return
    }
    setStep('loading')
    try {
      const res = await fetch('/api/course-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Lỗi')
      setStep('success'); onSuccess({ ...form, ...data })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra'); setStep('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {(['name', 'email', 'phone'] as const).map(f => (
        <input key={f} name={f}
          type={f === 'email' ? 'email' : f === 'phone' ? 'tel' : 'text'}
          placeholder={f === 'name' ? '👤 Họ và tên *' : f === 'email' ? '📧 Email nhận link học *' : '📞 Số điện thoại *'}
          value={form[f]}
          onChange={e => { setForm(v => ({ ...v, [e.target.name]: e.target.value })); setError('') }}
          required
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-base focus:border-[#43A047] focus:outline-none transition-colors placeholder-gray-400 bg-white"
        />
      ))}
      {error && <p className="text-red-500 text-sm text-center bg-red-50 rounded-xl py-2.5 px-3">{error}</p>}
      <button type="submit" disabled={step === 'loading'}
        className="w-full py-4 rounded-xl font-black text-white text-lg transition-all active:scale-[0.98] disabled:opacity-60 shadow-xl bg-gradient-to-r from-[#E53935] to-[#C62828] hover:from-[#C62828] hover:to-[#B71C1C] shadow-red-200">
        {step === 'loading'
          ? <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>Đang xử lý...
            </span>
          : ctaText}
      </button>
      <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
        <span>🔒 Bảo mật tuyệt đối</span>
        <span>·</span>
        <span>✅ Cam kết hoàn tiền 7 ngày</span>
      </div>
    </form>
  )
}

// ─── Payment Modal ────────────────────────────────────────────────────────────
function PaymentModal({ qr, onClose, onPaid }: { qr: QRData; onClose: () => void; onPaid: () => void }) {
  const [checking, setChecking] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { const t = setInterval(() => setTimeLeft(v => Math.max(0, v - 1)), 1000); return () => clearInterval(t) }, [])
  useEffect(() => {
    pollRef.current = setInterval(async () => {
      try {
        const r = await fetch('/api/check-payment?ref=' + qr.paymentRef)
        if (r.ok && (await r.json()).paid) { clearInterval(pollRef.current!); onPaid() }
      } catch { /* silent */ }
    }, 5000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [qr.paymentRef, onPaid])

  const mm = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const ss = (timeLeft % 60).toString().padStart(2, '0')

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-[#2E7D32] to-[#43A047] px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">Thanh toán chuyển khoản</h3>
            <p className="text-green-100 text-sm">Quét mã QR hoặc chuyển khoản thủ công</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <div className="p-5">
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 text-sm">
              <span className="text-amber-600">⏱ Hết hạn sau:</span>
              <span className="font-mono font-bold text-amber-700 text-lg">{mm}:{ss}</span>
            </span>
          </div>
          <div className="flex justify-center mb-4">
            <div className="p-2 rounded-xl border-2 border-gray-100 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr.qrUrl} alt="QR" className="w-44 h-44 object-contain"
                onError={e => { e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`STK:${qr.bankAccount} NH:${qr.bankCode} ${fmt(qr.amount)} ND:${qr.content}`)}` }} />
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            {([['Ngân hàng', qr.bankCode, false], ['Số tài khoản', qr.bankAccount, true], ['Chủ TK', qr.accountName.toUpperCase(), false], ['Số tiền', fmt(qr.amount), false]] as [string, string, boolean][]).map(([l, v, copy]) => (
              <div key={l} className="flex justify-between items-center">
                <span className="text-gray-500">{l}</span>
                {copy
                  ? <button className="font-mono font-bold text-blue-600 hover:text-blue-800" onClick={() => navigator.clipboard?.writeText(v)}>{v} 📋</button>
                  : <span className="font-semibold text-gray-800">{v}</span>}
              </div>
            ))}
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-gray-500">Nội dung CK</span>
              <button className="font-mono font-bold text-red-600 hover:text-red-800" onClick={() => navigator.clipboard?.writeText(qr.content)}>{qr.content} 📋</button>
            </div>
          </div>
          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800 text-center">
            ⚠️ <strong>Nhập đúng nội dung CK</strong> để hệ thống tự xác nhận trong vài phút
          </div>
          <button onClick={() => { setChecking(true); setTimeout(onPaid, 1000) }} disabled={checking}
            className="mt-4 w-full bg-[#2E7D32] hover:bg-[#388E3C] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60">
            {checking ? 'Đang kiểm tra...' : '✅ Tôi đã chuyển khoản xong'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({ name, paymentRef, onClose }: { name: string; paymentRef: string; onClose: () => void }) {
  const [groupLink, setGroupLink] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/success-info?ref=${encodeURIComponent(paymentRef)}`)
      .then(r => r.json())
      .then(d => { if (d.ok) setGroupLink(d.groupLink) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [paymentRef])

  const gifts = [
    { icon: '📊', name: 'Bảng Tính Food Cost Tự Động', path: '/qua-tang/bang-tinh-food-cost' },
    { icon: '✅', name: 'Checklist 47 Bước Ra Quán Chuẩn', path: '/qua-tang/checklist-mo-quan' },
    { icon: '📓', name: 'Sổ Tay Nguyên Liệu 5 Vị', path: '/qua-tang/so-tay-nguyen-lieu' },
  ]

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl my-4">
        <div className="px-6 py-8 bg-gradient-to-br from-[#2E7D32] to-[#66BB6A] text-center">
          <div className="text-5xl mb-2">🎉</div>
          <h2 className="text-white text-2xl font-black">Thanh toán thành công!</h2>
          <p className="text-white/90 mt-1 text-sm">Xin chào <strong>{name}</strong> 👋 Chào mừng vào lớp!</p>
        </div>
        <div className="p-5 space-y-4">
          {/* Bước 1: Vào nhóm */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="font-bold text-green-800 text-sm mb-2">📌 Bước 1 — Vào nhóm học viên kín</p>
            {loading ? (
              <p className="text-gray-400 text-xs">Đang tải link...</p>
            ) : groupLink ? (
              <a href={groupLink} target="_blank" rel="noopener noreferrer"
                className="block w-full py-2.5 rounded-lg font-bold text-white text-sm text-center bg-[#2E7D32]">
                🌿 Vào nhóm học viên ngay
              </a>
            ) : (
              <p className="text-gray-500 text-xs">Link nhóm đã được gửi vào email của bạn. Kiểm tra hộp thư nhé!</p>
            )}
          </div>

          {/* Bước 2: Quà tặng */}
          <div>
            <p className="font-bold text-gray-800 text-sm mb-2">🎁 Bước 2 — Tải 3 tài liệu quà tặng</p>
            <div className="space-y-2">
              {gifts.map(g => (
                <a key={g.path} href={`${g.path}?ref=${encodeURIComponent(paymentRef)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 bg-[#F1F8E9] border border-[#C8E6C9] rounded-lg px-3 py-2 text-sm font-medium text-[#1B5E20] hover:bg-[#E8F5E9]">
                  <span>{g.icon} {g.name}</span>
                  <span className="text-xs bg-[#2E7D32] text-white px-2 py-0.5 rounded font-bold whitespace-nowrap">📥 Tải PDF</span>
                </a>
              ))}
            </div>
          </div>

          <p className="text-gray-400 text-xs text-center">Email xác nhận cũng đã được gửi về hộp thư của bạn.</p>
          <button onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-[#2E7D32] to-[#43A047] shadow-md">
            ✅ Đóng lại
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-[#C8E6C9] rounded-2xl overflow-hidden bg-white">
      <button className="w-full flex justify-between items-center p-4 sm:p-5 text-left gap-3" onClick={() => setOpen(!open)}>
        <span className="font-bold text-gray-800 text-sm sm:text-base">{q}</span>
        <span className={`text-[#43A047] text-2xl leading-none flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-gray-600 text-sm leading-relaxed border-t border-[#E8F5E9] pt-3">{a}</div>}
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function RauMaDauXanhPage() {
  const [qrData, setQrData] = useState<QRData | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successName, setSuccessName] = useState('')
  const [successRef, setSuccessRef] = useState('')
  const [pendingName, setPendingName] = useState('')
  const formRef = useRef<HTMLDivElement>(null)

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const handleSuccess = (data: FormData & Record<string, unknown>) => {
    const qrPayload = data.qr as QRData | undefined
    if (qrPayload?.qrUrl) {
      setPendingName((data as FormData).name)
      setQrData({ ...qrPayload, paymentRef: data.paymentRef as string })
    } else {
      setSuccessName((data as FormData).name)
      setShowSuccess(true)
    }
  }

  return (
    <main className="min-h-screen bg-white font-sans">

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 1 — HERO BANNER                                                */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-[#0D2B0D] to-[#1A3C1A]">
        {/* Top badge */}
        <div className="flex justify-center pt-5 pb-2 px-4">
          <span className="inline-flex items-center gap-2 bg-[#F9A825]/20 border border-[#F9A825]/50 rounded-full px-4 py-1.5 text-[#FDD835] text-xs font-bold tracking-wide">
            🌿 BẾPCÔ HẠ · HACO FOOD
          </span>
        </div>

        {/* Hero banner image — full width, không cắt hình tròn */}
        <div className="max-w-2xl mx-auto px-4 py-2">
          <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Hinh-Co-Ha.png"
              alt="Khóa học Rau Má Đậu Xanh – Bếp Cô Hạ"
              className="w-full object-cover"
            />
          </div>
        </div>

        {/* Hero copy below image */}
        <div className="max-w-lg mx-auto px-4 pt-4 pb-8 text-center">
          <h1 className="text-white text-2xl sm:text-3xl font-black leading-tight mb-3">
            Học xong <span className="text-[#81C784]">làm được ngay</span> —<br/>
            <span className="text-[#F9A825]">Bán được ngay trong 7 ngày!</span>
          </h1>
          <p className="text-green-200 text-sm sm:text-base mb-5 leading-relaxed">
            Công thức chuẩn vị từ Cô Hạ · 5 loại sốt kinh doanh hot trend<br/>
            Màu xanh giữ được 3–4 ngày · Không tách nước · Không mùi hăng
          </p>

          {/* Countdown */}
          <div className="mb-5">
            <p className="text-green-300/80 text-xs mb-2">⏰ Giá ưu đãi kết thúc sau:</p>
            <CountdownBox dark />
          </div>

          <button onClick={scrollToForm}
            className="w-full max-w-sm py-4 rounded-2xl font-black text-white text-lg bg-gradient-to-r from-[#E53935] to-[#C62828] hover:from-[#C62828] hover:to-[#B71C1C] shadow-2xl shadow-red-900/50 active:scale-[0.98] transition-all">
            🌿 ĐĂNG KÝ NGAY — CHỈ 299.000Đ
          </button>
          <p className="text-green-300/50 text-xs mt-2">Tổng giá trị <s>2.196.000đ</s> · Tiết kiệm 1.897.000đ · Hỗ trợ đến khi thành công</p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 2 — SOCIAL PROOF BAR                                           */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section className="bg-[#1B5E20] py-4 px-4">
        <div className="max-w-lg mx-auto">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { num: '200+', label: 'Học viên' },
              { num: '4.9★', label: 'Đánh giá' },
              { num: '7', label: 'Bài học' },
              { num: '24/7', label: 'Hỗ trợ' },
            ].map(({ num, label }) => (
              <div key={label} className="text-white">
                <div className="font-black text-lg sm:text-xl text-[#A5D6A7]">{num}</div>
                <div className="text-[10px] sm:text-xs text-green-300/80 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 3 — HOOK / PAIN AGITATION (Sabri Suby style)                  */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-lg mx-auto">
          <div className="bg-[#FFF3E0] border-l-4 border-[#F57C00] rounded-2xl p-5 mb-8">
            <p className="text-[#E65100] font-black text-base mb-1">⚠️ Sự thật mà 90% người làm rau má không biết:</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Không phải vì nguyên liệu xấu. Không phải vì máy xay cũ.
              Mà vì <strong>một bước duy nhất bị bỏ qua</strong> khiến ly rau má của bạn mất màu sau 2 tiếng, hôi hăng và không bán được.
            </p>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-6 leading-tight">
            Bạn có đang gặp phải<br/>
            <span className="text-red-600">những điều này?</span>
          </h2>

          <div className="space-y-3 mb-8">
            {[
              { pain: 'Rau má xay xong để 2 tiếng là tách lớp, xỉn màu, không bán được' },
              { pain: 'Mùi hăng ngái dù đã thử đủ cách: ép lạnh, ngâm muối, thêm chanh...' },
              { pain: 'Sốt đậu xanh sên xong bị khê đáy nồi, lợn cợn, không ra được ly đẹp' },
              { pain: 'Menu chỉ có 1 vị, khách thử rồi không quay lại vì "không có gì mới"' },
              { pain: 'Không biết định giá, bán rẻ hơn hàng xóm mà vẫn ế, lãi không đủ bù công' },
            ].map(({ pain }) => (
              <div key={pain} className="flex gap-3 items-start bg-red-50 border border-red-100 rounded-xl p-4">
                <span className="text-red-500 text-lg flex-shrink-0 mt-0.5">✗</span>
                <p className="text-gray-700 text-sm leading-relaxed">{pain}</p>
              </div>
            ))}
          </div>

          {/* Villain reveal */}
          <div className="bg-[#E8F5E9] border border-[#A5D6A7] rounded-2xl p-5">
            <p className="font-black text-[#1B5E20] text-base mb-2">💡 Nguyên nhân thật sự là gì?</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Không ai dạy bạn về <strong>kỹ thuật sốc nhiệt chuẩn nhà nghề</strong> —
              bước 15 giây quyết định 80% chất lượng của cả mẻ rau má.
              Thiếu bước này, mọi thứ sau đó đều sai theo.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 4 — HERO MECHANISM (Agent 03)                                  */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-[#F1F8E9]">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block bg-[#C8E6C9] text-[#1B5E20] text-xs font-bold px-3 py-1 rounded-full mb-3">BÍ QUYẾT ĐỘC QUYỀN</span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 leading-tight">
              Giới thiệu:<br/>
              <span className="text-[#2E7D32]">Phương Pháp Xanh Chuẩn 3 Tầng®</span><br/>
              <span className="text-base font-bold text-gray-500">Chỉ có tại Bếp Cô Hạ</span>
            </h2>
            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
              Hệ thống duy nhất giúp bạn đi từ <strong>nguyên liệu thô → ly rau má kinh doanh chuẩn</strong> —
              màu giữ 3–4 ngày, sánh mịn không tách nước, khách mua lần 1 phải mua lần 2.
            </p>
          </div>

          {/* 3-step mechanism */}
          <div className="space-y-4">
            {[
              {
                step: '01',
                title: 'Sốc Nhiệt Giữ Màu',
                sub: 'Nền tảng quyết định tất cả',
                desc: 'Kỹ thuật trần rau má 10–15 giây chuẩn nhiệt độ triệt tiêu mùi hăng, khoá diệp lục giữ màu xanh ngọc bích suốt 3–4 ngày — bí quyết chỉ Cô Hạ mới dạy.',
                color: 'from-[#1B5E20] to-[#2E7D32]',
                icon: '🌡️',
              },
              {
                step: '02',
                title: '5 Sốt Nền Kinh Doanh',
                sub: 'Công thức gram chuẩn không thay đổi',
                desc: 'Đậu xanh · Sữa dừa · Sầu riêng · Khoai môn · Bí đỏ — 5 loại sốt tầng vị đong chuẩn gram, sên đúng lửa, không bao giờ bị khê hay lợn cợn.',
                color: 'from-[#2E7D32] to-[#43A047]',
                icon: '🫙',
              },
              {
                step: '03',
                title: 'Ra Ly Tạo Tầng',
                sub: 'Nâng giá trị gấp đôi bằng mắt nhìn',
                desc: 'Kỹ thuật múc sốt quết thành ly, xếp đá đúng cách, rót nước cốt giữ tầng màu — ly rau má đẹp hút mắt khách tăng thêm 15.000–20.000đ/ly mà không tốn thêm nguyên liệu.',
                color: 'from-[#43A047] to-[#66BB6A]',
                icon: '🧉',
              },
            ].map(({ step, title, sub, desc, color, icon }) => (
              <div key={step} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#C8E6C9] flex">
                <div className={`bg-gradient-to-b ${color} flex flex-col items-center justify-center px-4 py-5 min-w-[72px]`}>
                  <span className="text-2xl mb-1">{icon}</span>
                  <span className="text-white/60 text-[10px] font-black">TẦNG</span>
                  <span className="text-white font-black text-2xl leading-none">{step}</span>
                </div>
                <div className="p-4 flex-1">
                  <p className="text-[10px] text-[#43A047] font-bold uppercase tracking-wider mb-0.5">{sub}</p>
                  <h3 className="font-black text-gray-800 text-base mb-1.5">{title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-[#1B5E20] rounded-2xl p-5 text-center">
            <p className="text-[#A5D6A7] text-xs font-semibold mb-1">KẾT QUẢ SAU KHI HỌC</p>
            <p className="text-white font-black text-lg">Làm được ngay · Bán được ngay · Lãi ngay từ tuần đầu</p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 5 — SẢN PHẨM ĐẦU RA                                           */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block bg-[#C8E6C9] text-[#1B5E20] text-xs font-bold px-3 py-1 rounded-full mb-3">BẠN SẼ LÀM ĐƯỢC</span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-800">
              5 Vị Rau Má Hot Trend<br/>
              <span className="text-[#2E7D32]">Bán Được Với Giá 35.000–55.000đ/ly</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[
              { emoji: '🟢', name: 'Rau Má Đậu Xanh', desc: 'Vị bùi ngọt cổ điển · sốt vàng chanh óng ả dẻo mịn tuyệt đối', margin: '65–70%' },
              { emoji: '🥥', name: 'Rau Má Sữa Dừa', desc: 'Béo ngậy nồng nàn · lớp sữa trắng sánh mượt không tách dầu', margin: '60–65%' },
              { emoji: '🍈', name: 'Rau Má Sầu Riêng', desc: '"Vua vị giác" · giữ nguyên thớ thịt · khách nghiện từ ngụm đầu', margin: '55–60%' },
              { emoji: '🟣', name: 'Rau Má Khoai Môn', desc: 'Màu tím nhạt đẹp mắt · dẻo bùi · ăn khách trên mạng xã hội', margin: '60–65%' },
              { emoji: '🟠', name: 'Rau Má Bí Đỏ', desc: 'Màu cam óng ả · vị ngọt tự nhiên · thu hút khách family', margin: '65–70%' },
            ].map(({ emoji, name, desc, margin }) => (
              <div key={name} className="flex gap-4 items-center p-4 rounded-2xl bg-[#F1F8E9] border border-[#C5E1A5] hover:shadow-md transition-shadow">
                <span className="text-3xl flex-shrink-0">{emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm">{name}</p>
                  <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{desc}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[#2E7D32] font-black text-sm">{margin}</div>
                  <div className="text-gray-400 text-[10px]">biên lợi nhuận</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 p-4 bg-[#FFF8E1] border border-[#FFE082] rounded-2xl text-center">
            <p className="text-[#F57F17] font-bold text-sm">💰 Bán 30 ly/ngày × 40.000đ × lãi 65% = <span className="text-lg font-black">780.000đ/ngày</span></p>
            <p className="text-gray-500 text-xs mt-1">Chỉ cần tủ nhỏ, vốn ban đầu từ 2–3 triệu</p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 6 — NỘI DUNG KHOÁ HỌC                                         */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-[#F9FBF9]">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block bg-[#C8E6C9] text-[#1B5E20] text-xs font-bold px-3 py-1 rounded-full mb-3">7 BÀI HỌC · XEM MÃI MÃI</span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-800">
              Lộ Trình Cầm Tay Chỉ Việc<br/>
              <span className="text-[#2E7D32]">Từ Zero Đến Kinh Doanh</span>
            </h2>
          </div>

          <div className="space-y-2.5">
            {[
              { n: 1, icon: '🌿', title: 'Sơ Chế & Kỹ Thuật Sốc Nhiệt Giữ Màu Chuẩn Kinh Doanh', time: '25 phút', tag: 'Nền tảng quan trọng nhất', highlight: true },
              { n: 2, icon: '🥤', title: 'Xay Lọc Nước Cốt Sánh Mịn & Bảo Quản 3–4 Ngày Không Chua', time: '30 phút', tag: 'Bí quyết tỷ lệ vàng' },
              { n: 3, icon: '🫘', title: 'Công Thức Sốt Đậu Xanh — Vàng Chanh Óng Ả, Không Bao Giờ Khê', time: '35 phút', tag: 'Linh hồn của món' },
              { n: 4, icon: '🥥', title: 'Sữa Dừa Thần Thánh — Béo Ngậy, Không Tách Dầu', time: '30 phút', tag: 'Kỹ thuật điều nhiệt' },
              { n: 5, icon: '🎃', title: 'Sốt Bí Đỏ & Khoai Môn — Thêm 2 Vị Đa Dạng Menu', time: '40 phút', tag: 'Hot trend mạng xã hội' },
              { n: 6, icon: '🍈', title: 'Sốt Sầu Riêng "Vua Vị Giác" — Giữ Thớ Thịt, Khách Nghiện', time: '35 phút', tag: 'Vũ khí bán chạy nhất' },
              { n: 7, icon: '🧉', title: 'Ra Ly Tạo Tầng + Định Giá + Food Cost Chuẩn Kinh Doanh', time: '45 phút', tag: 'Hoàn chỉnh quy trình' },
            ].map(({ n, icon, title, time, tag, highlight }) => (
              <div key={n} className={`flex gap-3 items-start p-4 rounded-2xl border transition-all ${highlight ? 'bg-[#E8F5E9] border-[#81C784] shadow-md' : 'bg-white border-[#E0E0E0] hover:border-[#A5D6A7]'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${highlight ? 'bg-[#2E7D32]' : 'bg-[#F1F8E9]'}`}>
                  {highlight ? <span>{icon}</span> : <span>{icon}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold text-[#43A047] uppercase tracking-wide">Bài {n}</span>
                    {highlight && <span className="bg-[#F9A825] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">⭐ {tag}</span>}
                    {!highlight && <span className="bg-[#E8F5E9] text-[#43A047] text-[9px] font-semibold px-2 py-0.5 rounded-full">{tag}</span>}
                  </div>
                  <p className={`font-bold text-sm leading-snug ${highlight ? 'text-[#1B5E20]' : 'text-gray-800'}`}>{title}</p>
                </div>
                <span className="text-gray-400 text-[10px] flex-shrink-0 mt-1">{time}</span>
              </div>
            ))}
          </div>

          {/* Q&A */}
          <div className="mt-4 flex gap-3 items-start p-4 rounded-2xl bg-[#1B5E20] border border-[#1B5E20]">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0">🎓</div>
            <div>
              <p className="text-[#A5D6A7] text-[10px] font-bold uppercase tracking-wide mb-0.5">Bài tập & Tốt nghiệp</p>
              <p className="text-white font-bold text-sm">Q&A trực tiếp · Cô Hạ chấm bài từng người · Chứng nhận hoàn thành</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 7 — VỀ CÔ HẠ (ảnh portrait đúng)                              */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block bg-[#C8E6C9] text-[#1B5E20] text-xs font-bold px-3 py-1 rounded-full mb-3">NGƯỜI DẠY BẠN</span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-800">Về Cô Hạ</h2>
          </div>

          <div className="bg-[#F1F8E9] rounded-3xl overflow-hidden border border-[#C8E6C9]">
            {/* Portrait photo — chân dung thật của Cô Hạ */}
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/co-ha-flowers.jpg"
                alt="Cô Hạ – Sáng lập Bếp Cô Hạ"
                className="w-full object-cover max-h-80 object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B5E20] via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
                <h3 className="text-white text-xl font-black">Cô Hạ</h3>
                <p className="text-green-200 text-sm">Sáng lập Bếp Cô Hạ · HACO Food</p>
              </div>
            </div>

            <div className="p-5 space-y-3">
              {[
                { icon: '🏆', text: 'Chuyên gia ẩm thực với nhiều năm kinh nghiệm thực chiến tại bếp kinh doanh' },
                { icon: '👩‍🏫', text: 'Đào tạo 200+ học viên thành công mở quán trên cả nước — có video, ảnh kết quả thật' },
                { icon: '🌿', text: 'Người tiên phong chuẩn hóa "Phương Pháp Xanh Chuẩn 3 Tầng" cho đồ uống rau má kinh doanh' },
                { icon: '💬', text: 'Hỗ trợ học viên 24/7 trong nhóm kín — từng bài tập được Cô Hạ nhận xét tận tình' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex gap-3 items-start">
                  <span className="text-xl flex-shrink-0">{icon}</span>
                  <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 8 — TESTIMONIALS                                               */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-[#E8F5E9]">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block bg-[#C8E6C9] text-[#1B5E20] text-xs font-bold px-3 py-1 rounded-full mb-3">HỌC VIÊN NÓI GÌ</span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-800">
              Kết Quả Thật Từ<br/>
              <span className="text-[#2E7D32]">Học Viên Thật</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                name: 'Chị Lan Anh', loc: 'TP. Hồ Chí Minh', stars: 5,
                text: 'Trước học Cô Hạ, rau má của mình cứ để 2 tiếng là tách lớp, màu xỉn, hôi ngái. Học xong bài 1 là mình hiểu ngay lỗi sai ở đâu. Giờ mình mở quán nhỏ, ngày bán 60–80 ly, khách khen màu xanh đẹp và không bao giờ có mùi hăng.',
                result: 'Doanh thu: 2.4 triệu/ngày',
              },
              {
                name: 'Chị Thanh Hương', loc: 'Hà Nội', stars: 5,
                text: 'Bí quyết giữ thớ thịt sầu riêng của Cô Hạ quá hay. Khách mình hay khen "uống mà cảm giác được nhai thật" — họ biết ngay không phải bột hương liệu. Menu sầu riêng tăng doanh thu thêm 40% trong tháng đầu.',
                result: 'Tăng doanh thu +40%',
              },
              {
                name: 'Bạn Minh Tuấn', loc: 'Đà Nẵng', stars: 5,
                text: 'Ban đầu chỉ muốn làm cho gia đình, nhưng công thức chuẩn quá nên mở luôn tủ nhỏ bán buổi sáng. Một tháng thu thêm 8–10 triệu. Cô Hạ hỗ trợ tận tình, hỏi gì cũng trả lời ngay.',
                result: 'Thêm 8–10 triệu/tháng',
              },
            ].map(({ name, loc, stars, text, result }) => (
              <div key={name} className="bg-white rounded-2xl p-5 shadow-sm border border-[#C8E6C9]">
                <div className="flex gap-0.5 mb-3">
                  {Array(stars).fill(0).map((_, i) => <span key={i} className="text-[#F9A825]">★</span>)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic mb-4">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2E7D32] to-[#66BB6A] flex items-center justify-center text-white text-sm font-black">
                      {name[3]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-xs">{name}</p>
                      <p className="text-gray-400 text-[10px]">{loc}</p>
                    </div>
                  </div>
                  <span className="bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold px-2.5 py-1 rounded-full">{result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 9 — GODFATHER OFFER (Value Stack + Guarantee + Scarcity)       */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section ref={formRef} id="dang-ky" className="py-16 px-4 scroll-mt-4 bg-white">
        <div className="max-w-lg mx-auto">

          {/* Offer header */}
          <div className="text-center mb-8">
            <span className="inline-block bg-[#C8E6C9] text-[#1B5E20] text-xs font-bold px-3 py-1 rounded-full mb-3">LỜI ĐỀ NGHỊ ĐẶC BIỆT</span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-2">
              Tất Cả Những Gì Bạn Nhận Được<br/>
              <span className="text-[#2E7D32]">Khi Đăng Ký Hôm Nay</span>
            </h2>
            <div className="mb-3">
              <p className="text-gray-500 text-xs mb-1.5">⏰ Giá ưu đãi kết thúc sau:</p>
              <CountdownBox />
            </div>
          </div>

          {/* Value stack card */}
          <div className="bg-white border-2 border-[#43A047] rounded-3xl overflow-hidden shadow-2xl mb-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2E7D32] to-[#43A047] px-6 py-5 text-center">
              <p className="text-green-100 font-semibold text-sm mb-1">Hệ Thống Rau Má Kinh Doanh 7 Ngày</p>
              <p className="text-green-200 text-xs mb-3">Xanh Chuẩn · Sánh Mịn · Bán Được Ngay</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-green-300/70 line-through text-xl font-bold">2.196.000đ</span>
                <span className="text-white text-5xl font-black">299.000đ</span>
              </div>
              <div className="mt-2 inline-block bg-[#F9A825] text-white text-xs font-black px-4 py-1 rounded-full">
                🎉 TIẾT KIỆM HƠN 1.9 TRIỆU — CHỈ HÔM NAY
              </div>
            </div>

            {/* Value items */}
            <div className="p-5 space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bao gồm trong gói:</p>

              {[
                { name: '7 Video Bài Giảng HD — Xem Đi Xem Lại Mãi Mãi', value: '999.000đ', desc: 'Từ sơ chế → 5 sốt nền → ra ly kinh doanh. Học mọi lúc, mọi nơi.' },
                { name: '🎁 Bảng Tính Food Cost Tự Động — Biết Ngay Lãi Bao Nhiêu Mỗi Ly', value: '499.000đ', desc: 'Điền số vào là ra ngay: giá bán, chi phí, lợi nhuận từng vị — không cần biết kế toán. Tặng kèm file PDF tải về.' },
                { name: '🎁 Checklist 47 Bước Ra Quán Chuẩn — Không Bỏ Sót Thứ Gì', value: '399.000đ', desc: 'Dụng cụ, nguyên liệu, quy trình mở quán từ A–Z. In ra gạch từng ô là xong. Tặng kèm file PDF.' },
                { name: '🎁 Sổ Tay Nguyên Liệu 5 Vị — Mua Đúng, Không Mua Thừa', value: '299.000đ', desc: 'Đi chợ đúng 1 lần, không mua nhầm, không hao phí. In ra mang đi chợ. Tặng kèm file PDF.' },
                { name: '🎁 Nhóm Học Viên Kín VIP — Cô Hạ Hỗ Trợ Đến Khi Thành Công', value: 'Vô giá', desc: 'Cộng đồng 200+ người kinh doanh rau má. Hỏi gì Cô Hạ trả lời. Hỗ trợ không giới hạn thời gian.' },
              ].map(({ name, value, desc }) => (
                <div key={name} className="flex gap-3 items-start bg-[#F9FBF9] rounded-xl p-3 border border-[#E8F5E9]">
                  <span className="text-[#43A047] text-lg flex-shrink-0 mt-0.5">✅</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-gray-800 text-xs sm:text-sm leading-snug">{name}</p>
                      <span className="text-xs font-black text-gray-400 line-through flex-shrink-0">{value}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}

              {/* Total value */}
              <div className="border-t border-dashed border-gray-200 pt-3 mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-500 text-sm font-medium">Tổng giá trị thực:</span>
                  <span className="text-gray-400 line-through font-bold text-base">2.196.000đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-black text-gray-800 text-base">Giá hôm nay:</span>
                  <span className="font-black text-[#E53935] text-3xl">299.000đ</span>
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div className="mx-5 mb-5 p-4 bg-[#FFF8E1] border border-[#FFE082] rounded-2xl flex gap-3 items-start">
              <span className="text-2xl flex-shrink-0">🛡️</span>
              <div>
                <p className="font-black text-[#F57F17] text-sm">Cam Kết Hỗ Trợ Đến Khi Bạn Thành Công</p>
                <p className="text-gray-600 text-xs mt-0.5 leading-relaxed">
                  Học xong mà còn thắc mắc, chưa tự tin làm được → Cô Hạ <strong>hỗ trợ trực tiếp trong nhóm kín</strong> cho đến khi bạn làm thành công. Không giới hạn thời gian, không tính phí thêm.
                </p>
              </div>
            </div>
          </div>

          {/* Scarcity */}
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-500 text-lg">🔥</span>
              <p className="font-black text-red-700 text-sm">Chỉ còn 23 suất giá ưu đãi đợt này</p>
            </div>
            <div className="w-full bg-red-100 rounded-full h-2.5 mb-1.5">
              <div className="bg-gradient-to-r from-red-400 to-red-600 h-2.5 rounded-full" style={{ width: '54%' }} />
            </div>
            <p className="text-red-500 text-xs">54/100 suất đã được đăng ký · Đợt tiếp theo giá 599.000đ</p>
          </div>

          {/* Registration form */}
          <div className="bg-white border-2 border-gray-100 rounded-3xl p-5 sm:p-6 shadow-lg">
            <div className="text-center mb-5">
              <h3 className="font-black text-gray-800 text-xl">Đăng Ký Ngay Hôm Nay</h3>
              <p className="text-gray-400 text-xs mt-1">Điền thông tin để nhận link học và hóa đơn</p>
            </div>
            <LeadForm ctaText="🌿 ĐĂNG KÝ & THANH TOÁN — 299.000Đ" onSuccess={handleSuccess} />
          </div>

          {/* Trust badges */}
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            {[
              { icon: '🔒', label: 'Bảo mật thông tin' },
              { icon: '🤝', label: 'Hỗ trợ đến thành công' },
              { icon: '📱', label: 'Học qua điện thoại' },
            ].map(({ icon, label }) => (
              <div key={label} className="bg-[#F9FBF9] border border-gray-100 rounded-xl p-3">
                <div className="text-2xl mb-1">{icon}</div>
                <p className="text-gray-500 text-[10px] font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 10 — FAQ                                                        */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-[#F1F8E9]">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-gray-800">Câu Hỏi Thường Gặp</h2>
          </div>
          <div className="space-y-3">
            <FAQ q="Học ở đâu? Có phải đến lớp không?" a="Hoàn toàn online qua nhóm kín. Học mọi lúc, mọi nơi — trên điện thoại hay máy tính đều được. Video lưu vĩnh viễn, xem đi xem lại bao nhiêu lần tùy thích." />
            <FAQ q="Tôi không có kinh nghiệm nấu ăn, học được không?" a="Hoàn toàn được! Cô Hạ thiết kế khoá học theo kiểu cầm tay chỉ việc — từ cách chọn rau, đến đong gram, đến thao tác xay lọc. Người mới bắt đầu từ con số 0 học vẫn làm được." />
            <FAQ q="Sau khoá học có thể mở quán kinh doanh luôn không?" a="Có thể! Bài 7 hướng dẫn đầy đủ: định giá bán, tính food cost, quy trình ra ly chuẩn. Bonus Checklist 47 bước và Bảng tính food cost giúp bạn chuẩn bị mở quán không thiếu thứ gì." />
            <FAQ q="Học xong mà vẫn chưa tự tin kinh doanh thì sao?" a="Cô Hạ cam kết hỗ trợ trực tiếp trong nhóm kín cho đến khi bạn tự tin làm được và bán được — không giới hạn thời gian, không tính thêm phí. Bạn hỏi, Cô Hạ trả lời. Bạn làm sai, Cô Hạ chỉnh. Đến khi thành công mới thôi." />
            <FAQ q="Thanh toán như thế nào? Có thể trả góp không?" a="Thanh toán chuyển khoản ngân hàng, quét QR — hệ thống tự xác nhận và gửi link học trong vài phút. Hiện tại chưa có trả góp nhưng 299.000đ là mức giá đã được tối ưu nhất cho đợt này." />
            <FAQ q="Mua xong bao lâu thì được học?" a="Ngay lập tức. Sau khi thanh toán xác nhận, bạn nhận email với link vào nhóm học viên và toàn bộ tài liệu trong vòng 5–10 phút." />
            <FAQ q="299.000đ có đắt không? Tôi lo học xong không dùng được." a="Hãy tính ngược lại: 1 ngày bán 20 ly rau má × 35.000đ = 700.000đ doanh thu. Chỉ cần 1 buổi bán là thu lại học phí. Và bạn có cả hệ thống 5 vị, công thức chuẩn gram, checklist mở quán — dùng được nhiều năm. Rủi ro thật sự là KHÔNG học mà vẫn mò mẫm — vừa tốn nguyên liệu thử sai, vừa mất thời gian, vừa bỏ lỡ khách hàng mỗi ngày." />
            <FAQ q="Tôi đang có công việc, không có nhiều thời gian học." a="Video chỉ 25–45 phút/bài, xem lúc rảnh trên điện thoại — trên xe buýt, lúc ăn trưa, tối trước khi ngủ đều được. Không cần học liên tục — học 1 bài áp dụng ngay, thấy kết quả rồi học tiếp. Nhiều học viên của Cô Hạ vừa đi làm fulltime vừa mở được quán rau má buổi tối hoặc cuối tuần." />
            <FAQ q="Khu vực tôi ít người uống rau má, bán được không?" a="Rau má đậu xanh đang là xu hướng toàn quốc — từ Hà Nội đến TP.HCM, từ thị xã đến huyện nhỏ đều bán được. Thực tế là những nơi chưa có quán lại dễ chiếm thị phần hơn. Học viên Cô Hạ bán thành công ở nhiều tỉnh thành, kể cả vùng nông thôn và khu công nghiệp." />
            <FAQ q="Tôi không có vốn nhiều, có mở quán được không?" a="Hoàn toàn được. Mô hình xe đẩy hoặc bán online (giao hàng, đặt trước) chỉ cần 3–5 triệu vốn ban đầu: dụng cụ cơ bản + nguyên liệu mẻ đầu. Bài 7 trong khóa học hướng dẫn chi tiết cách tính vốn, chọn mô hình phù hợp túi tiền. Bắt đầu nhỏ → bán được → mở rộng dần — không cần đổ vốn lớn ngay từ đầu." />
            <FAQ q="Tôi đã từng học nơi khác rồi nhưng không thành công." a="Cô Hạ hiểu điều này. Lý do học mà không thành công thường là: công thức thiếu chi tiết (không chuẩn gram), không có quy trình kinh doanh đi kèm, hoặc không có ai hỗ trợ khi gặp khó khăn. Khóa học này khác ở chỗ: công thức chuẩn từng gram từng giây, có checklist 47 bước mở quán, và Cô Hạ hỗ trợ trực tiếp trong nhóm kín cho đến khi bạn bán được — không giới hạn thời gian." />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 11 — FINAL CTA                                                  */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#0D2B0D] to-[#1A3C1A] text-white text-center">
        <div className="max-w-lg mx-auto">
          <p className="text-green-400 text-sm font-semibold mb-3">Tóm lại — bạn nhận được gì?</p>
          <h2 className="text-2xl sm:text-3xl font-black mb-4 leading-tight">
            <span className="text-[#81C784]">5 vị rau má</span> hot trend<br/>
            Công thức chuẩn gram · Màu giữ 3–4 ngày<br/>
            <span className="text-[#F9A825]">Bán được ngay trong 7 ngày</span>
          </h2>

          <div className="mb-5 space-y-1.5 text-sm text-green-300">
            {['✅ 7 video HD xem mãi mãi (999k)', '✅ Bảng tính food cost PDF (499k)', '✅ Checklist 47 bước ra quán PDF (399k)', '✅ Sổ tay nguyên liệu 5 vị PDF (299k)', '✅ Nhóm VIP + hỗ trợ không giới hạn (vô giá)', '🤝 Cam kết hỗ trợ đến khi bạn thành công'].map(item => (
              <p key={item} className="text-left max-w-xs mx-auto">{item}</p>
            ))}
          </div>

          <div className="mb-5">
            <p className="text-green-300/70 text-xs mb-2">⏰ Giá 299.000đ kết thúc sau:</p>
            <CountdownBox dark />
          </div>

          <button onClick={scrollToForm}
            className="w-full max-w-sm py-5 rounded-2xl font-black text-white text-xl bg-gradient-to-r from-[#E53935] to-[#C62828] hover:from-[#C62828] hover:to-[#B71C1C] shadow-2xl shadow-black/40 active:scale-[0.98] transition-all mb-3">
            🌿 ĐẶT HỌC NGAY — 299.000Đ
          </button>
          <p className="text-green-300/50 text-xs">Giá gốc <s>999.000đ</s> · Chỉ còn 23 suất · Tăng giá sau khi hết suất</p>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="py-8 px-4 bg-[#071507] text-center">
        <p className="text-green-600/50 text-xs">© 2025 Bếp Cô Hạ · HACO Food · Tất cả quyền được bảo lưu</p>
        <p className="text-green-600/30 text-xs mt-1">hacofood.vn/rau-ma-dau-xanh</p>
      </footer>

      {/* ─── STICKY CTA (hiện khi scroll qua hero) ───────────────────────────── */}
      <StickyBar onCTA={scrollToForm} />

      {/* ─── MODALS ───────────────────────────────────────────────────────────── */}
      {qrData && (
        <PaymentModal qr={qrData} onClose={() => setQrData(null)}
          onPaid={() => { const ref = qrData?.paymentRef || ''; setQrData(null); setSuccessName(pendingName || 'bạn'); setSuccessRef(ref); setShowSuccess(true) }} />
      )}
      {showSuccess && <SuccessScreen name={successName} paymentRef={successRef} onClose={() => setShowSuccess(false)} />}
    </main>
  )
}

// ─── Sticky bottom CTA bar ────────────────────────────────────────────────────
function StickyBar({ onCTA }: { onCTA: () => void }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const handler = () => setShow(window.scrollY > 500)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  if (!show) return null
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t-2 border-[#43A047] shadow-2xl px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-black text-gray-800 text-sm leading-none">Khóa Rau Má Đậu Xanh</p>
        <p className="text-[#E53935] font-black text-lg leading-tight">299.000đ <span className="text-gray-400 font-normal text-xs line-through">999.000đ</span></p>
      </div>
      <button onClick={onCTA}
        className="flex-shrink-0 bg-gradient-to-r from-[#E53935] to-[#C62828] text-white font-black text-sm px-5 py-3 rounded-xl shadow-lg active:scale-95 transition-all">
        ĐĂNG KÝ NGAY
      </button>
    </div>
  )
}
