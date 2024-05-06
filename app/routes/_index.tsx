import { Stack, TextField } from '@mui/material'
import {
  Link,
  redirect,
  useLoaderData,
  type ClientLoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { $path } from 'remix-routes'
import { AppFooter } from '~/components/AppFooter'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { WrappedGoogleMap } from '~/components/organisms/GoogleMaps/GoogleMaps'
import { Button } from '~/components/ui'
import { Spot, listUserSpots } from '~/models/spots'
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
  const [spots, setSpots] = useState<Array<Spot>>([])

  useEffect(() => {
    const getLatLng = async () => {
      const place = 'オステリア ラ フェニーチェ'
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=${apiKey}`,
      )
      if (response.data.results && response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location
        console.log({ lat, lng })
      }
    }
    getLatLng()

    function fetchUserCategories() {
      listUserSpots('Hitoshi_Aiso')
        .then((spots) => {
          setSpots(spots)
        })
        .catch((error) => {
          console.error(error)
        })
    }

    fetchUserCategories()
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

      <AppFooter />
    </div>
  )
}
