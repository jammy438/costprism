'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const Step1Welcome = dynamic(() => import('./steps/Step1Welcome'), { ssr: false })
const Step2Connector = dynamic(() => import('./steps/Step2Connector'), { ssr: false })
const Step3Invite = dynamic(() => import('./steps/Step3Invite'), { ssr: false })
const Step4Budget = dynamic(() => import('./steps/Step4Budget'), { ssr: false })
const Step5Ready = dynamic(() => import('./steps/Step5Ready'), { ssr: false })

const STEPS = [
  { number: 1, label: 'Welcome' },
  { number: 2, label: 'Connect' },
  { number: 3, label: 'Invite' },
  { number: 4, label: 'Budget' },
  { number: 5, label: 'Ready' },
]

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [connectorConnected, setConnectorConnected] = useState(false)

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 5))
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1))

  const saveProgress = async (step: number) => {
    try {
      await fetch('/api/onboarding/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step }),
      })
    } catch {
      // non-blocking
    }
  }

  const handleStepComplete = (step: number) => {
    saveProgress(step)
    goNext()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--colour-bg-page)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Logo */}
      <div style={{
        marginBottom: '40px',
        fontSize: '20px',
        fontWeight: 700,
        color: 'var(--colour-blue)',
        letterSpacing: '-0.5px',
      }}>
        CostPrism
      </div>

      {/* Step indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        marginBottom: '40px',
      }}>
        {STEPS.map((step, i) => (
          <div key={step.number} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 600,
                background: currentStep === step.number
                  ? 'var(--colour-blue)'
                  : currentStep > step.number
                  ? 'var(--colour-blue)'
                  : 'var(--colour-bg-card)',
                color: currentStep >= step.number ? '#fff' : 'var(--colour-text-secondary)',
                border: currentStep === step.number
                  ? '2px solid var(--colour-blue)'
                  : currentStep > step.number
                  ? '2px solid var(--colour-blue)'
                  : '2px solid var(--colour-border)',
                transition: 'all 0.2s ease',
              }}>
                {currentStep > step.number ? '✓' : step.number}
              </div>
              <span style={{
                fontSize: '11px',
                color: currentStep === step.number ? 'var(--colour-blue)' : 'var(--colour-text-secondary)',
                fontWeight: currentStep === step.number ? 600 : 400,
              }}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                width: '60px',
                height: '2px',
                background: currentStep > step.number ? 'var(--colour-blue)' : 'var(--colour-border)',
                marginBottom: '20px',
                transition: 'background 0.2s ease',
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div style={{
        width: '100%',
        maxWidth: '560px',
        background: 'var(--colour-bg-card)',
        border: '1px solid var(--colour-border)',
        borderRadius: '16px',
        padding: '40px',
      }}>
        {currentStep === 1 && (
          <Step1Welcome onComplete={() => handleStepComplete(1)} />
        )}
        {currentStep === 2 && (
          <Step2Connector
            onComplete={() => {
              setConnectorConnected(true)
              handleStepComplete(2)
            }}
            onBack={goBack}
          />
        )}
        {currentStep === 3 && (
          <Step3Invite
            onComplete={() => handleStepComplete(3)}
            onSkip={() => handleStepComplete(3)}
            onBack={goBack}
          />
        )}
        {currentStep === 4 && (
          <Step4Budget
            onComplete={() => handleStepComplete(4)}
            onSkip={() => handleStepComplete(4)}
            onBack={goBack}
          />
        )}
        {currentStep === 5 && (
          <Step5Ready connectorConnected={connectorConnected} />
        )}
      </div>
    </div>
  )
}

export default OnboardingPage