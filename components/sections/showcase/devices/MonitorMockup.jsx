import { DeviceGlow } from './DeviceGlow'

export function MonitorMockup({ children, glass = false }) {
  return (
    <div className="flex flex-col items-center relative">
      <DeviceGlow radius={26} inset={-30} intensity={0.9} />
      {/* Screen */}
      <div
        className="w-[460px] rounded-xl overflow-hidden relative"
        style={{
          border: glass ? '2px solid rgba(255,255,255,0.5)' : '2px solid #1a1a1e',
          background: glass
            ? 'linear-gradient(160deg, rgba(255,255,255,0.8) 0%, rgba(240,240,245,0.6) 50%, rgba(255,255,255,0.7) 100%)'
            : undefined,
          backdropFilter: glass ? 'blur(20px) saturate(1.2)' : undefined,
          WebkitBackdropFilter: glass ? 'blur(20px) saturate(1.2)' : undefined,
          boxShadow: glass
            ? [
                'inset 0 1px 0 rgba(255,255,255,0.8)',
                '0 4px 16px rgba(0,0,0,0.05)',
                '0 12px 40px rgba(0,0,0,0.06)',
                '0 32px 80px rgba(0,0,0,0.05)',
              ].join(', ')
            : [
                'inset 0 0 0 1px rgba(255,255,255,0.04)',
                '0 4px 12px rgba(15,17,41,0.12)',
                '0 12px 32px rgba(15,17,41,0.18)',
                '0 32px 64px rgba(15,17,41,0.14)',
              ].join(', '),
        }}
      >
        <div className="bg-white aspect-[16/10] overflow-hidden relative">
          {children}
        </div>
        {/* Chin */}
        <div
          className="h-[6px] flex items-center justify-center"
          style={{ background: glass ? 'rgba(230,230,235,0.5)' : 'linear-gradient(180deg, #2a2a2e, #1a1a1e)' }}
        />
      </div>
      {/* Stand neck */}
      <div
        className="w-[60px] h-[28px]"
        style={{
          background: glass ? 'rgba(220, 220, 226, 0.5)' : 'linear-gradient(90deg, #c0c0c4, #d4d4d8, #c0c0c4)',
          backdropFilter: glass ? 'blur(8px)' : undefined,
          WebkitBackdropFilter: glass ? 'blur(8px)' : undefined,
        }}
      />
      {/* Stand base */}
      <div
        className="w-[120px] h-[6px] rounded-b-md"
        style={{
          background: glass ? 'rgba(210, 210, 218, 0.5)' : 'linear-gradient(180deg, #c8c8cc, #b0b0b4)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
        }}
      />
      {/* Glass sheen overlay */}
      {glass && (
        <div className="absolute inset-0 rounded-xl pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.1) 100%)' }} />
      )}
    </div>
  )
}
