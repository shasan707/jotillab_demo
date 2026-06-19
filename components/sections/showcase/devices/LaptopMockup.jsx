import { DeviceGlow } from './DeviceGlow'

export function LaptopMockup({ children, glass = false }) {
  const borderStyle = glass
    ? '2px solid rgba(255, 255, 255, 0.5)'
    : '2px solid #1a1a1e'

  const shellBg = glass
    ? 'linear-gradient(160deg, rgba(255,255,255,0.8) 0%, rgba(240,240,245,0.6) 50%, rgba(255,255,255,0.7) 100%)'
    : undefined

  return (
    <div className="flex flex-col items-center relative">
      <DeviceGlow radius={32} inset={-32} intensity={0.9} />
      {/* Screen */}
      <div
        className="w-160 rounded-t-xl overflow-hidden relative"
        style={{
          border: borderStyle,
          borderBottom: 'none',
          background: glass ? shellBg : undefined,
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
                '0 4px 12px rgba(15,17,41,0.12)',
                '0 12px 32px rgba(15,17,41,0.18)',
                '0 32px 64px rgba(15,17,41,0.14)',
              ].join(', '),
        }}
      >
        {/* Browser chrome */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 border-b border-black/5"
          style={{
            background: glass
              ? 'rgba(250, 250, 252, 0.7)'
              : 'linear-gradient(180deg, #f8f8f8, #f0f0f0)',
            backdropFilter: glass ? 'blur(12px)' : 'none',
            WebkitBackdropFilter: glass ? 'blur(12px)' : 'none',
          }}
        >
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 mx-6">
            <div className="bg-white/80 rounded-md px-3 py-1 text-[10px] text-gray-400 text-center border border-black/5">
              app.jotillabs.com
            </div>
          </div>
        </div>
        <div className="bg-white aspect-[16/10] overflow-hidden relative">
          {children}
        </div>
      </div>
      {/* Keyboard deck */}
      <div
        className="w-180 h-4 rounded-b-lg"
        style={{
          background: glass
            ? 'linear-gradient(180deg, rgba(230,230,235,0.7), rgba(210,210,218,0.6))'
            : 'linear-gradient(180deg, #c8c8cc, #b0b0b4)',
          boxShadow: glass
            ? '0 2px 6px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)'
            : '0 2px 6px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)',
          backdropFilter: glass ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: glass ? 'blur(12px)' : 'none',
        }}
      />
      {/* Glass sheen overlay */}
      {glass && (
        <div className="absolute inset-0 rounded-t-xl pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.1) 100%)' }} />
      )}
    </div>
  )
}
