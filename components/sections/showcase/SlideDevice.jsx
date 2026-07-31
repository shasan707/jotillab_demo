'use client'

import { useState, useCallback, useRef } from 'react'
import { PhoneMockup } from './devices/PhoneMockup'
import { LaptopMockup } from './devices/LaptopMockup'
import { MonitorMockup } from './devices/MonitorMockup'
import { BrowserMockup } from './devices/BrowserMockup'
import { ReceptionistScreen } from './screens/ReceptionistScreen'
import { MessengerScreen } from './screens/MessengerScreen'
import { OutreachScreen } from './screens/OutreachScreen'
import { SpaceScreen } from './screens/SpaceScreen'
import { AvatarScreen } from './screens/AvatarScreen'
import { DevsScreen } from './screens/DevsScreen'
import { ConsultScreen } from './screens/ConsultScreen'
import { EducationScreen } from './screens/EducationScreen'

const SCREENS = {
  receptionist: ReceptionistScreen,
  messenger: MessengerScreen,
  outreach: OutreachScreen,
  space: SpaceScreen,
  avatar: AvatarScreen,
  jotildevs: DevsScreen,
  jotilconsult: ConsultScreen,
  jotileducation: EducationScreen,
}

const DEVICES = {
  phone: PhoneMockup,
  laptop: LaptopMockup,
  monitor: MonitorMockup,
  browser: BrowserMockup,
}

const TILT = {
  phone: 'none',
  laptop: 'none',
  monitor: 'none',
  browser: 'none',
}

const BROWSER_URL = {
  space: 'app.jotillabs.com',
  avatar: 'app.jotillabs.com/avatar',
  jotildevs: 'devs.jotillabs.com/builder',
  jotilconsult: 'app.jotillabs.com/audit',
  jotileducation: 'learn.jotillabs.com',
}

export function SlideDevice({ slug, deviceType, isActive, messengerProgressRef, spaceProgressRef, onStep }) {
  const Device = DEVICES[deviceType]
  const Screen = SCREENS[slug]
  const vibrate = deviceType === 'phone' && slug === 'receptionist'
  const [highlightedCards, setHighlightedCards] = useState(new Set())
  const timersRef = useRef({})

  const onAction = useCallback((cardId) => {
    setHighlightedCards((prev) => new Set([...prev, cardId]))
    if (timersRef.current[cardId]) clearTimeout(timersRef.current[cardId])
    timersRef.current[cardId] = setTimeout(() => {
      setHighlightedCards((prev) => {
        const next = new Set(prev)
        next.delete(cardId)
        return next
      })
    }, 1800)
  }, [])

  const isMessenger = slug === 'messenger'

  return (
    <div data-device-frame data-device-type={deviceType}>
      <div
        className="device-inner"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
        }}
        data-device
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: TILT[deviceType],
          }}
        >
          <div className="relative" style={{ transform: 'translateZ(0px)' }}>
            {isMessenger ? (
              <div className="relative" style={{ width: 320, height: 660 }}>
                <Device glass>
                  <div className="w-full h-full bg-gray-50/50" />
                </Device>
                <div
                  className="absolute"
                  style={{
                    top: 10, left: 10,
                    width: 300, height: 640,
                    overflow: 'visible',
                  }}
                >
                  <Screen
                    isActive={isActive}
                    onAction={onAction}
                    onStep={onStep}
                    progressRef={messengerProgressRef}
                  />
                </div>
              </div>
            ) : (
              <Device
                vibrate={vibrate && isActive}
                glass
                {...(deviceType === 'browser' && BROWSER_URL[slug]
                  ? { url: BROWSER_URL[slug] }
                  : {})}
              >
                <Screen
                  isActive={isActive}
                  onAction={onAction}
                  onStep={onStep}
                  progressRef={spaceProgressRef}
                />
              </Device>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
