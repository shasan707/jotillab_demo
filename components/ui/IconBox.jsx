import { cn } from '@/lib/utils'

const sizeMap = {
  sm: 'h-9 w-9',     // 36px
  md: 'h-12 w-12',   // 48px
  lg: 'h-14 w-14',   // 56px
}

const iconSizeMap = {
  sm: '[&>svg]:h-4 [&>svg]:w-4',
  md: '[&>svg]:h-5 [&>svg]:w-5',
  lg: '[&>svg]:h-6 [&>svg]:w-6',
}

export function IconBox({
  children,
  size = 'md',
  className,
  glow = false,
}) {
  return (
    <div
      className={cn(
        'icon-gradient-bg inline-flex items-center justify-center rounded-[14px] shrink-0',
        sizeMap[size],
        iconSizeMap[size],
        glow && 'shadow-[0_0_20px_rgba(56, 89, 168,0.25)]',
        className
      )}
    >
      {children}
    </div>
  )
}
