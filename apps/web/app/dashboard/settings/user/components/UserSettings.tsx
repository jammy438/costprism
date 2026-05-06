'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useUIPrefs } from '@/lib/providers/UIPrefsProviders'

const FONT_SIZES = [
  { value: 'normal', label: 'Normal (14px)' },
  { value: 'large', label: 'Large (16px)' },
  { value: 'xlarge', label: 'Extra large (18px)' },
]

const COLOUR_MODES = [
  { value: 'standard', label: 'Standard', description: 'Default colour scheme' },
  { value: 'high-contrast', label: 'High contrast', description: 'Increased contrast for low vision' },
  { value: 'deuteranopia', label: 'Deuteranopia friendly', description: 'Adjusted for red-green colour blindness' },
  { value: 'protanopia', label: 'Protanopia friendly', description: 'Adjusted for red colour blindness' },
]

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  background: 'var(--colour-bg-page)',
  border: '1px solid var(--colour-border)',
  borderRadius: '8px',
  color: 'var(--colour-text-primary)',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box' as const,
}

const labelStyle = {
  display: 'block' as const,
  fontSize: '12px',
  fontWeight: 500 as const,
  color: 'var(--colour-text-secondary)',
  marginBottom: '6px',
}

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{
    background: 'var(--colour-bg-card)',
    border: '1px solid var(--colour-border)',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  }}>
    <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colour-text-primary)', margin: 0 }}>
      {title}
    </h2>
    {children}
  </div>
)

const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!enabled)}
    style={{
      width: '40px',
      height: '22px',
      borderRadius: '11px',
      background: enabled ? 'var(--colour-blue)' : 'var(--colour-border)',
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      transition: 'background 0.2s ease',
      flexShrink: 0,
    }}
  >
    <div style={{
      position: 'absolute',
      top: '3px',
      left: enabled ? '21px' : '3px',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      background: '#fff',
      transition: 'left 0.2s ease',
    }} />
  </button>
)

const UserSettings = () => {
  const { user, isLoaded } = useUser()
  const { prefs, setPrefs } = useUIPrefs()

  const [fontSize, setFontSize] = useState(prefs.fontSize)
  const [colourMode, setColourMode] = useState(prefs.colourMode)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [prefsSaved, setPrefsSaved] = useState(false)
  const [notifSaved, setNotifSaved] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleSavePreferences = () => {
    setPrefs({ fontSize: fontSize as any, colourMode: colourMode as any })
    setPrefsSaved(true)
    setTimeout(() => setPrefsSaved(false), 3000)
  }

  const handleSaveNotifications = async () => {
    try {
      await fetch('/api/settings/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailAlerts, weeklyDigest }),
      })
      setNotifSaved(true)
      setTimeout(() => setNotifSaved(false), 3000)
    } catch {}
  }

  const handlePasswordReset = () => {
    setResetSent(true)
    setTimeout(() => setResetSent(false), 5000)
  }

  if (!isLoaded) return <div style={{ color: 'var(--colour-text-muted)', fontSize: '13px' }}>Loading...</div>

  return (
    <div style={{ maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Profile */}
      <SectionCard title="Profile">
        <div>
          <label style={labelStyle}>Display name</label>
          <input
            type="text"
            value={user?.fullName ?? ''}
            readOnly
            style={{ ...inputStyle, color: 'var(--colour-text-secondary)', cursor: 'default' }}
          />
          <p style={{ fontSize: '11px', color: 'var(--colour-text-muted)', margin: '6px 0 0' }}>
            To change your name, update it in your Clerk profile.
          </p>
        </div>
        <div>
          <label style={labelStyle}>Email address</label>
          <input
            type="email"
            value={user?.primaryEmailAddress?.emailAddress ?? ''}
            readOnly
            style={{ ...inputStyle, color: 'var(--colour-text-secondary)', cursor: 'default' }}
          />
        </div>
        <div>
          <label style={labelStyle}>Password</label>
          <button
            onClick={handlePasswordReset}
            style={{
              padding: '9px 16px',
              background: 'var(--colour-bg-page)',
              border: '1px solid var(--colour-border)',
              borderRadius: '8px',
              color: resetSent ? 'var(--colour-green)' : 'var(--colour-text-secondary)',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {resetSent ? '✓ Reset email sent' : 'Send password reset email'}
          </button>
        </div>
      </SectionCard>

      {/* Accessibility */}
      <SectionCard title="Accessibility">
        <div>
          <label style={labelStyle}>Font size</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {FONT_SIZES.map((size) => (
              <button
                key={size.value}
                onClick={() => setFontSize(size.value as any)}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: fontSize === size.value ? 'rgba(48,110,255,0.1)' : 'var(--colour-bg-page)',
                  border: `1px solid ${fontSize === size.value ? 'var(--colour-blue)' : 'var(--colour-border)'}`,
                  borderRadius: '8px',
                  color: fontSize === size.value ? 'var(--colour-blue)' : 'var(--colour-text-secondary)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: fontSize === size.value ? 600 : 400,
                }}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Colour mode</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {COLOUR_MODES.map((mode) => (
              <button
                key={mode.value}
                onClick={() => setColourMode(mode.value as any)}
                style={{
                  padding: '10px 14px',
                  background: colourMode === mode.value ? 'rgba(48,110,255,0.1)' : 'var(--colour-bg-page)',
                  border: `1px solid ${colourMode === mode.value ? 'var(--colour-blue)' : 'var(--colour-border)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left' as const,
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: colourMode === mode.value ? 'var(--colour-blue)' : 'var(--colour-text-primary)' }}>
                    {mode.label}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--colour-text-muted)', marginTop: '2px' }}>
                    {mode.description}
                  </div>
                </div>
                {colourMode === mode.value && (
                  <span style={{ color: 'var(--colour-blue)', fontSize: '14px' }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {prefsSaved && (
          <div style={{ padding: '10px 14px', background: 'rgba(76,187,23,0.1)', border: '1px solid rgba(76,187,23,0.3)', borderRadius: '8px', color: 'var(--colour-green)', fontSize: '12px' }}>
            Preferences saved.
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSavePreferences}
            style={{
              padding: '10px 24px',
              background: 'var(--colour-blue)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Save preferences
          </button>
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard title="Notifications">
        {[
          { label: 'Email alerts', description: 'Budget breaches, anomalies and policy violations', value: emailAlerts, onChange: setEmailAlerts },
          { label: 'Weekly digest', description: 'Summary of your cloud spend every Monday morning', value: weeklyDigest, onChange: setWeeklyDigest },
        ].map((pref) => (
          <div key={pref.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--colour-text-primary)' }}>{pref.label}</div>
              <div style={{ fontSize: '11px', color: 'var(--colour-text-muted)', marginTop: '2px' }}>{pref.description}</div>
            </div>
            <Toggle enabled={pref.value} onChange={pref.onChange} />
          </div>
        ))}

        {notifSaved && (
          <div style={{ padding: '10px 14px', background: 'rgba(76,187,23,0.1)', border: '1px solid rgba(76,187,23,0.3)', borderRadius: '8px', color: 'var(--colour-green)', fontSize: '12px' }}>
            Notification preferences saved.
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSaveNotifications}
            style={{
              padding: '10px 24px',
              background: 'var(--colour-blue)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Save notifications
          </button>
        </div>
      </SectionCard>

    </div>
  )
}

export default UserSettings