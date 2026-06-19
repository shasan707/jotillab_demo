import { DeviceGlow } from './DeviceGlow'

export function PhoneMockup({ children, vibrate = false, glass = false }) {
  if (!glass) {
    return (
      <div className="relative" style={{ perspective: 1200 }}>
        <DeviceGlow radius={62} inset={-22} />
        <div className="absolute left-[-2.5px] top-[90px] w-[3px] h-[20px] rounded-l-sm" style={{ background: 'linear-gradient(180deg, #3a3a40, #2a2a30)' }} />
        <div className="absolute left-[-2.5px] top-[124px] w-[3px] h-[32px] rounded-l-sm" style={{ background: 'linear-gradient(180deg, #3a3a40, #2a2a30)' }} />
        <div className="absolute left-[-2.5px] top-[164px] w-[3px] h-[32px] rounded-l-sm" style={{ background: 'linear-gradient(180deg, #3a3a40, #2a2a30)' }} />
        <div className="absolute right-[-2.5px] top-[130px] w-[3px] h-[40px] rounded-r-sm" style={{ background: 'linear-gradient(180deg, #3a3a40, #2a2a30)' }} />
        <div className={`w-[320px] h-[660px] rounded-[46px] p-[10px] relative ${vibrate ? 'animate-phone-vibrate' : ''}`}
          style={{
            background: 'linear-gradient(160deg, #2c2c30 0%, #1c1c20 40%, #0e0e12 100%)',
            boxShadow: [
              'inset 0 1px 0 rgba(255,255,255,0.08)',
              'inset 0 -1px 0 rgba(0,0,0,0.3)',
              '0 1px 2px rgba(0,0,0,0.15)',
              '0 4px 12px rgba(15,17,41,0.15)',
              '0 12px 32px rgba(15,17,41,0.2)',
              '0 32px 64px rgba(15,17,41,0.18)',
            ].join(', '),
          }}>
          <div className="absolute top-0 left-[25%] right-[25%] h-px rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
          <div className="absolute top-[12px] left-1/2 -translate-x-1/2 z-10 flex items-center justify-center" style={{ width: 92, height: 26, borderRadius: 13, background: '#0a0a0e' }}>
            <div className="rounded-full" style={{ width: 8, height: 8, background: 'radial-gradient(circle at 35% 35%, #1e1e3a, #0a0a0e)', boxShadow: 'inset 0 0 2px rgba(100,100,180,0.2)' }} />
          </div>
          <div className="w-full h-full rounded-[36px] overflow-hidden bg-white relative">
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative" style={{ perspective: 1200 }}>
      <DeviceGlow radius={62} inset={-22} intensity={0.85} />
      {/* Side buttons -- light silver for glass variant */}
      <div className="absolute left-[-2px] top-[90px] w-[2.5px] h-[20px] rounded-l-sm" style={{ background: 'linear-gradient(180deg, #d8d8dc, #c0c0c4)' }} />
      <div className="absolute left-[-2px] top-[124px] w-[2.5px] h-[32px] rounded-l-sm" style={{ background: 'linear-gradient(180deg, #d8d8dc, #c0c0c4)' }} />
      <div className="absolute left-[-2px] top-[164px] w-[2.5px] h-[32px] rounded-l-sm" style={{ background: 'linear-gradient(180deg, #d8d8dc, #c0c0c4)' }} />
      <div className="absolute right-[-2px] top-[130px] w-[2.5px] h-[40px] rounded-r-sm" style={{ background: 'linear-gradient(180deg, #d8d8dc, #c0c0c4)' }} />

      <div
        className={`w-[320px] h-[660px] rounded-[46px] p-[10px] relative ${vibrate ? 'animate-phone-vibrate' : ''}`}
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.85) 0%, rgba(240,240,245,0.7) 30%, rgba(220,220,230,0.5) 70%, rgba(255,255,255,0.6) 100%)',
          backdropFilter: 'blur(20px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
          boxShadow: [
            'inset 0 1px 0 rgba(255,255,255,0.9)',
            'inset 0 -1px 0 rgba(255,255,255,0.3)',
            'inset 1px 0 0 rgba(255,255,255,0.5)',
            'inset -1px 0 0 rgba(255,255,255,0.5)',
            '0 1px 3px rgba(0,0,0,0.04)',
            '0 4px 16px rgba(0,0,0,0.06)',
            '0 12px 40px rgba(0,0,0,0.08)',
            '0 32px 80px rgba(0,0,0,0.06)',
          ].join(', '),
        }}
      >
        {/* Top edge highlight -- brighter for glass */}
        <div className="absolute top-0 left-[15%] right-[15%] h-[1px] rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)' }} />

        {/* Left edge highlight */}
        <div className="absolute left-0 top-[15%] bottom-[15%] w-[1px] rounded-full" style={{ background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.6), transparent)' }} />

        {/* Bottom subtle reflection */}
        <div className="absolute bottom-0 left-[20%] right-[20%] h-[1px] rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />

        {/* Dynamic Island */}
        <div className="absolute top-[12px] left-1/2 -translate-x-1/2 z-10 flex items-center justify-center" style={{ width: 92, height: 26, borderRadius: 13, background: '#0a0a0e' }}>
          <div className="rounded-full" style={{ width: 8, height: 8, background: 'radial-gradient(circle at 35% 35%, #1e1e3a, #0a0a0e)', boxShadow: 'inset 0 0 2px rgba(100,100,180,0.2)' }} />
        </div>

        {/* Screen area */}
        <div className="w-full h-full rounded-[36px] overflow-hidden bg-white relative">
          {children}
          {/* Diagonal glass reflection across screen */}
          <div className="absolute inset-0 pointer-events-none z-10" style={{ background: 'linear-gradient(125deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 25%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 80%, rgba(255,255,255,0.08) 100%)' }} />
        </div>

        {/* Full-body glass sheen overlay */}
        <div className="absolute inset-0 rounded-[46px] pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.15) 100%)' }} />
      </div>
    </div>
  )
}
