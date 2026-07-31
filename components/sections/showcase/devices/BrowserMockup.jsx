import { DeviceGlow } from './DeviceGlow'

export function BrowserMockup({ children, glass = false, url = 'app.jotillabs.com' }) {
  return (
    <div className="flex flex-col items-center relative">
      <DeviceGlow radius={20} inset={-30} intensity={0.9} />
      <div
        className="w-[820px] rounded-2xl overflow-hidden relative"
        style={{
          border: glass
            ? '1px solid rgba(255,255,255,0.55)'
            : '1px solid rgba(0,0,0,0.06)',
          background: glass
            ? 'linear-gradient(160deg, #ffffff 0%, #f1f1f6 50%, #fbfbff 100%)'
            : '#ffffff',
          boxShadow: glass
            ? [
                'inset 0 1px 0 rgba(255,255,255,0.85)',
                '0 4px 16px rgba(0,0,0,0.05)',
                '0 12px 40px rgba(0,0,0,0.06)',
                '0 32px 80px rgba(0,0,0,0.05)',
              ].join(', ')
            : [
                '0 1px 0 rgba(255,255,255,0.5) inset',
                '0 4px 12px rgba(15,17,41,0.10)',
                '0 14px 36px rgba(15,17,41,0.14)',
                '0 36px 72px rgba(15,17,41,0.12)',
              ].join(', '),
        }}
      >
        {/* Browser chrome */}
        <div
          className="flex items-center gap-3 px-5 py-3 border-b border-black/5"
          style={{
            background: glass
              ? '#fafafc'
              : 'linear-gradient(180deg, #f8f8fa, #eeeef2)',
          }}
        >
          {/* Traffic-light dots */}
          <div className="flex gap-2 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          {/* URL bar */}
          <div className="flex-1 mx-8">
            <div
              className="bg-white/90 rounded-md px-4 py-1.5 text-[12px] text-gray-500 text-center border border-black/5"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              {url}
            </div>
          </div>
          {/* Right-side spacer to balance the dots */}
          <div className="w-[60px] shrink-0" />
        </div>
        {/* Screen content */}
        <div className="bg-white aspect-[16/10] overflow-hidden relative">
          {children}
          {glass && (
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.10) 100%)',
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
