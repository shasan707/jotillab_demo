'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

/* Fixed overlay because the root layout wraps every route in Navbar/Footer;
   the Studio needs the full viewport to itself. */
export function Studio() {
  return (
    <div className="fixed inset-0 z-[200] bg-white">
      <NextStudio config={config} />
    </div>
  )
}
