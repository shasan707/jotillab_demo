import { Studio } from './Studio'

export const dynamic = 'force-static'

export const metadata = {
  title: 'Studio',
  robots: { index: false, follow: false },
}

export default function StudioPage() {
  return <Studio />
}
