'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function AccessGuard({ children }: { children: React.ReactNode }) {
  const params = useSearchParams()
  const ref = params.get('ref')
  const [status, setStatus] = useState<'loading' | 'ok' | 'denied'>('loading')

  useEffect(() => {
    if (!ref) { setStatus('denied'); return }
    fetch(`/api/check-payment?ref=${encodeURIComponent(ref)}`)
      .then(r => r.json())
      .then(d => setStatus(d.paid ? 'ok' : 'denied'))
      .catch(() => setStatus('denied'))
  }, [ref])

  if (status === 'loading') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0fff4' }}>
      <p style={{ color: '#2E7D32', fontSize: 16 }}>🌿 Đang xác minh quyền truy cập...</p>
    </div>
  )

  if (status === 'denied') return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f0fff4', padding: 24 }}>
      <p style={{ fontSize: 48, margin: '0 0 16px' }}>🔒</p>
      <h2 style={{ color: '#1B5E20', fontSize: 22, margin: '0 0 12px', textAlign: 'center' }}>Tài liệu dành riêng cho học viên</h2>
      <p style={{ color: '#555', fontSize: 15, textAlign: 'center', maxWidth: 400, lineHeight: 1.7 }}>
        Trang này chỉ mở được qua link trong email xác nhận thanh toán.<br/>
        Kiểm tra hộp thư của bạn sau khi đăng ký khóa học.
      </p>
      <a href="/" style={{ marginTop: 24, background: '#2E7D32', color: '#fff', padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
        Về trang đăng ký
      </a>
    </div>
  )

  return <>{children}</>
}
