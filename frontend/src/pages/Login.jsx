import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif",
      background: '#f8f7ff',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');

        @keyframes floatA { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-18px) rotate(3deg); } }
        @keyframes floatB { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-12px) rotate(-4deg); } }
        @keyframes floatC { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-22px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(99,82,210,0.25); } 70% { box-shadow: 0 0 0 10px rgba(99,82,210,0); } 100% { box-shadow: 0 0 0 0 rgba(99,82,210,0); } }

        .ft-input {
          width: 100%;
          padding: 13px 16px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          background: #fff;
          border: 1.5px solid #e8e4ff;
          border-radius: 12px;
          outline: none;
          color: #1a1535;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .ft-input::placeholder { color: #b0a8d4; }
        .ft-input:focus { border-color: #6352d2; box-shadow: 0 0 0 4px rgba(99,82,210,0.10); }
        .ft-input:hover:not(:focus) { border-color: #c4baf0; }

        .ft-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #6352d2 0%, #8b5cf6 100%);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          letter-spacing: 0.3px;
          transition: opacity 0.2s, transform 0.15s;
          animation: pulse-ring 2.5s infinite;
        }
        .ft-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .ft-btn:active:not(:disabled) { transform: translateY(0px); }
        .ft-btn:disabled { opacity: 0.6; cursor: not-allowed; animation: none; }

        .show-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #9b8fd4;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          padding: 0;
          transition: color 0.2s;
        }
        .show-btn:hover { color: #6352d2; }

        .card-anim { animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both; }
        .card-anim-delay { animation: fadeUp 0.55s 0.1s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      {/* Left decorative panel */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(145deg, #4c3aad 0%, #6b4de6 45%, #9b6ef5 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 48px',
        position: 'relative',
        overflow: 'hidden',
        minWidth: 0,
      }} className="left-panel">
        <style>{`
          @media (max-width: 768px) { .left-panel { display: none !important; } }
        `}</style>

        {/* Blobs */}
        <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'320px', height:'320px', borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
        <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:'260px', height:'260px', borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />

        {/* Floating shapes */}
        <div style={{ animation:'floatA 6s ease-in-out infinite', position:'absolute', top:'18%', left:'12%', width:'48px', height:'48px', borderRadius:'14px', background:'rgba(255,255,255,0.13)', transform:'rotate(15deg)' }} />
        <div style={{ animation:'floatB 8s ease-in-out infinite', position:'absolute', bottom:'22%', right:'14%', width:'36px', height:'36px', borderRadius:'50%', background:'rgba(255,255,255,0.10)' }} />
        <div style={{ animation:'floatC 7s ease-in-out infinite', position:'absolute', top:'55%', left:'8%', width:'24px', height:'24px', borderRadius:'8px', background:'rgba(255,255,255,0.15)', transform:'rotate(-20deg)' }} />

        {/* Content */}
        <div style={{ position:'relative', zIndex:1, textAlign:'center', color:'#fff' }}>
          <div style={{
            width:'72px', height:'72px', borderRadius:'22px',
            background:'rgba(255,255,255,0.18)',
            display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 28px',
            backdropFilter:'blur(8px)',
            border:'1.5px solid rgba(255,255,255,0.25)',
            fontSize:'26px', fontWeight:'800',
            letterSpacing:'-0.5px',
          }}>FT</div>

          <h1 style={{ fontSize:'32px', fontWeight:'800', margin:'0 0 12px', letterSpacing:'-0.5px', lineHeight:1.2 }}>
            Future<br/>Transformation
          </h1>
          <p style={{ fontSize:'15px', opacity:0.75, margin:'0 0 40px', fontFamily:"'DM Sans', sans-serif", fontWeight:400 }}>
            Knowledge Management System
          </p>

          {/* Feature pills */}
          {['Smart Document Search', 'AI-Powered Answers', 'Team Knowledge Hub'].map((f, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:'10px',
              background:'rgba(255,255,255,0.10)',
              border:'1px solid rgba(255,255,255,0.18)',
              borderRadius:'100px', padding:'8px 16px',
              marginBottom:'10px', fontSize:'13px',
              backdropFilter:'blur(4px)',
              justifyContent:'center',
            }}>
              <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#c4f0a8', flexShrink:0 }} />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right login panel */}
      <div style={{
        width:'100%',
        maxWidth:'480px',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        padding:'40px 32px',
        background:'#f8f7ff',
        flexShrink:0,
      }}>
        <div style={{ width:'100%', maxWidth:'380px' }}>

          {/* Mobile logo */}
          <div className="card-anim" style={{ textAlign:'center', marginBottom:'36px' }}>
            <div style={{
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              width:'56px', height:'56px', borderRadius:'18px',
              background:'linear-gradient(135deg, #6352d2, #8b5cf6)',
              marginBottom:'16px',
              fontSize:'22px', fontWeight:'800', color:'#fff',
              letterSpacing:'-0.5px',
            }}>FT</div>
            <h2 style={{ fontSize:'24px', fontWeight:'800', color:'#1a1535', margin:'0 0 6px', letterSpacing:'-0.4px' }}>
              Welcome back
            </h2>
            <p style={{ fontSize:'14px', color:'#7c6faa', margin:0, fontFamily:"'DM Sans', sans-serif" }}>
              Sign in to your workspace
            </p>
          </div>

          {/* Card */}
          <div className="card-anim-delay" style={{
            background:'#fff',
            borderRadius:'20px',
            padding:'32px 28px',
            border:'1.5px solid #ede9ff',
            boxShadow:'0 8px 32px rgba(99,82,210,0.08)',
          }}>

            {error && (
              <div style={{
                marginBottom:'20px', padding:'12px 14px',
                background:'#fff1f1', border:'1.5px solid #ffd4d4',
                borderRadius:'10px', fontSize:'13px', color:'#c0392b',
                fontFamily:"'DM Sans', sans-serif",
                display:'flex', alignItems:'center', gap:'8px',
              }}>
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom:'18px' }}>
                <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#5a4e8a', marginBottom:'7px', letterSpacing:'0.3px', textTransform:'uppercase' }}>
                  Email address
                </label>
                <input
                  type="email"
                  className="ft-input"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom:'24px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'7px' }}>
                  <label style={{ fontSize:'12px', fontWeight:'600', color:'#5a4e8a', letterSpacing:'0.3px', textTransform:'uppercase' }}>
                    Password
                  </label>
                  <button type="button" className="show-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="ft-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="ft-btn" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in →'}
              </button>
            </form>
          </div>

          <p style={{ textAlign:'center', marginTop:'24px', fontSize:'12px', color:'#b0a8d4', fontFamily:"'DM Sans', sans-serif" }}>
            © {new Date().getFullYear()} Future Transformation. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}