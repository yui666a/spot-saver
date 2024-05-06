import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import {
  useLoaderData,
  useNavigate,
  type ClientLoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/react'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { AppFooter } from '~/components/AppFooter'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { WrappedGoogleMap } from '~/components/organisms/GoogleMaps/GoogleMaps'
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
    // return redirect($path('/:handle', { handle: user.handle }))
    // return redirect($path('/'))
  }
  return user
}

export default function IndexPage() {
  const navigate = useNavigate()

  const user = useLoaderData<typeof clientLoader>()
  const [inputText, setInputText] = useState('')
  const [, setAllSpots] = useRecoilState(spotsState)
  const [categories, setCategories] = useRecoilState(categoriesState)

  const spots = useRecoilValue(selectedSpotsState)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    console.log('user', user)
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
            <>
              <IconButton onClick={handleMenu}>
                {user.photoURL ? (
                  <Avatar src={user.photoURL} />
                ) : (
                  <Avatar>{user.displayName?.slice(0, 1)}</Avatar>
                )}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => navigate('/settings')}>設定</MenuItem>
                <MenuItem onClick={handleClose}>ログアウト</MenuItem>
              </Menu>
            </>
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
