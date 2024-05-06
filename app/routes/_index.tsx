import { Stack, TextField } from '@mui/material'
import {
  Link,
  redirect,
  useLoaderData,
  type ClientLoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/react'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $path } from 'remix-routes'
import { AppFooter } from '~/components/AppFooter'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { WrappedGoogleMap } from '~/components/organisms/GoogleMaps/GoogleMaps'
import { Button } from '~/components/ui'
import { listUserCategories } from '~/models/categories'
import { listUserSpots } from '~/models/spots'
import { categoriesState } from '~/recoil/atoms/categories'
import { spotsState } from '~/recoil/atoms/spots'
import { selectedSpotsState } from '~/recoil/selector/selectedSpotsState'
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
  const [inputText, setInputText] = useState('')
  const [, setAllSpots] = useRecoilState(spotsState)
  const [categories, setCategories] = useRecoilState(categoriesState)

  const spots = useRecoilValue(selectedSpotsState)

  // const [spots, setSpots] = useState<Array<Spot>>([])

  useEffect(() => {
    const useName = 'Hitoshi_Aiso'

    const fetchUserCategories = () => {
      listUserCategories(useName)
        .then((categories) => {
          setCategories(categories)
        })
        .catch((error) => {
          console.error(error)
        })
    }
    const fetchUserSpots = () => {
      listUserSpots(useName)
        .then((spots) => {
          setAllSpots(spots)
        })
        .catch((error) => {
          console.error(error)
        })
    }

    fetchUserCategories()
    fetchUserSpots()
  }, [])

  return (
    <div className="grid min-h-screen grid-rows-[1fr_auto]">
      <AppHeadingSection className="items-center px-0 ">
        {/* <h1 className="text-xl">Spot Saver</h1> */}

        <Stack direction="row">
          <TextField
            size="small"
            placeholder="ここで検索"
            onChange={(e) => {
              setInputText(e.target.value)
            }}
            fullWidth
          />
          {user?.handle ? (
            <Button variant="outline" className="rounded-full" asChild>
              <Link to={$path('/:handle', { handle: user.handle })}>
                自分のページへ
              </Link>
            </Button>
          ) : (
            <SignInModal />
          )}
        </Stack>

        <WrappedGoogleMap spots={spots} />
      </AppHeadingSection>

      <AppFooter categories={categories} />
    </div>
  )
}
