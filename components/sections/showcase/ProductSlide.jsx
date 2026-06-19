import { SlideText } from './SlideText'
import { SlideDevice } from './SlideDevice'

export function ProductSlide({ product, index, isActive, messengerProgressRef, spaceProgressRef }) {
  const isEven = index % 2 === 1

  return (
    <div
      className="flex items-center justify-center px-6 lg:px-[60px]"
      data-index={index}
    >
      <div
        className="w-full max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        style={{ direction: isEven ? 'rtl' : 'ltr' }}
      >
        <div className="min-w-0" style={{ direction: 'ltr' }}>
          <SlideText product={product} />
        </div>
        <div className="min-w-0" style={{ direction: 'ltr' }}>
          <SlideDevice
            slug={product.slug}
            deviceType={product.deviceType}
            isActive={isActive}
            messengerProgressRef={messengerProgressRef}
            spaceProgressRef={spaceProgressRef}
          />
        </div>
      </div>
    </div>
  )
}
