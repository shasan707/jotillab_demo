import { DeviceGlow } from './DeviceGlow'

/* One consistent light phone frame for every mockup on the site: silver-white
   bezel, subtle edge highlights, and a discreet light speaker slot instead of
   a black notch/island. The `glass` prop is kept for API compatibility but
   both variants render the same frame. */
export function PhoneMockup({ children, vibrate = false, glass = false }) {
  return (
    <div className="relative" style={{ perspective: 1200 }}>
      <DeviceGlow radius={62} inset={-22} intensity={0.85} />
      {/* Side buttons — light silver */}
      <div className="absolute left-[-2px] top-[90px] w-[2.5px] h-[20px] rounded-l-sm" style={{ background: 'linear-gradient(180deg, #d8d8dc, #c0c0c4)' }} />
      <div className="absolute left-[-2px] top-[124px] w-[2.5px] h-[32px] rounded-l-sm" style={{ background: 'linear-gradient(180deg, #d8d8dc, #c0c0c4)' }} />
      <div className="absolute left-[-2px] top-[164px] w-[2.5px] h-[32px] rounded-l-sm" style={{ background: 'linear-gradient(180deg, #d8d8dc, #c0c0c4)' }} />
      <div className="absolute right-[-2px] top-[130px] w-[2.5px] h-[40px] rounded-r-sm" style={{ background: 'linear-gradient(180deg, #d8d8dc, #c0c0c4)' }} />

      <div
        className={`w-[320px] h-[660px] rounded-[46px] p-[10px] relative ${vibrate ? 'animate-phone-vibrate' : ''}`}
        style={{
          background: 'linear-gradient(160deg, #ffffff 0%, #f1f1f6 30%, #e4e4ec 70%, #fafafe 100%)',
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
        {/* Top edge highlight */}
        <div className="absolute top-0 left-[15%] right-[15%] h-[1px] rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)' }} />

        {/* Left edge highlight */}
        <div className="absolute left-0 top-[15%] bottom-[15%] w-[1px] rounded-full" style={{ background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.6), transparent)' }} />

        {/* Bottom subtle reflection */}
        <div className="absolute bottom-0 left-[20%] right-[20%] h-[1px] rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />

        {/* Discreet light speaker slot (no black island) */}
        <div
          className="absolute top-[16px] left-1/2 -translate-x-1/2 z-10"
          style={{
            width: 56,
            height: 6,
            borderRadius: 3,
            background: 'linear-gradient(180deg, #dfe3ec, #eef1f7)',
            boxShadow: 'inset 0 1px 2px rgba(15,17,41,0.10)',
          }}
        />

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
