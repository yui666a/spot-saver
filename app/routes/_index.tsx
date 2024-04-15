import {
  Link,
  redirect,
  useLoaderData,
  type ClientLoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/react'
import { $path } from 'remix-routes'
import { AppFooter } from '~/components/AppFooter'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { WrappedGoogleMap } from '~/components/organisms/GoogleMaps/GoogleMaps'
import { Button } from '~/components/ui'
import { SignInModal } from '~/routes/auth+/sign_in'
import { isAuthenticated } from '~/services/auth'

export const meta: MetaFunction = () => {
  return [
    { title: 'Spot Saver' },
    {
      name: 'description',
      content: 'Google Maps でラベルが画一的になるものを解決するアプリ',
    },
  ]
}

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const user = await isAuthenticated(request)
  if (user?.handle) {
    return redirect($path('/:handle', { handle: user.handle }))
  }
  return user
}

export default function IndexPage() {
  const user = useLoaderData<typeof clientLoader>()

  return (
    <div className="grid min-h-screen grid-rows-[1fr_auto]">
      <AppHeadingSection className="items-center">
        <h1 className="text-xl">Spot Saver</h1>

        {user?.handle ? (
          <Button variant="outline" className="rounded-full" asChild>
            <Link to={$path('/:handle', { handle: user.handle })}>
              自分のページへ
            </Link>
          </Button>
        ) : (
          <SignInModal />
        )}

        <WrappedGoogleMap />
      </AppHeadingSection>

      <AppFooter />
    </div>
  )
}
