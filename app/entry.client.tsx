import { RemixBrowser } from '@remix-run/react'
import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { RecoilRoot } from 'recoil'

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RecoilRoot>
        <RemixBrowser />
      </RecoilRoot>
    </StrictMode>,
  )
})
