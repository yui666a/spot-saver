// import type { ClientLoaderFunctionArgs } from '@remix-run/react'
// import { $path } from 'remix-routes'
// import { requireUser } from '~/services/auth'
// import Setting from './_index'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { deleteUserCategory, listUserCategories } from '~/models/categories'
import { categoriesState } from '~/recoil/atoms/categories'
import { useAuthUser } from '~/services/auth'

const SettingsCategoryPage: React.FC = () => {
  const [categories, setCategories] = useRecoilState(categoriesState)

  const user = useAuthUser()

  useEffect(() => {
    if (!user?.handle) {
      alert('ログインしてください')
      return
    }

    function fetchUserCategories(userHandle: string) {
      listUserCategories(userHandle)
        .then((categories) => {
          setCategories(categories)
        })
        .catch((error) => {
          console.error(error)
        })
    }

    fetchUserCategories(user.handle)
  }, [])

  return (
    <>
      <Typography variant="h5">カテゴリーの編集</Typography>
      <List>
        {categories.length === 0 && (
          <ListItem>
            <ListItemText primary="カテゴリーがありません" />
          </ListItem>
        )}
        {categories.map((category) => (
          <ListItem
            disablePadding
            key={category.id}
            onClick={() => {
              console.log('親')
            }}
          >
            <ListItemButton>
              <Stack
                justifyContent="center"
                alignItems="center"
                sx={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '4rem',
                  background: category.color,
                  fontSize: '3rem',
                  color: 'black',
                  mr: '1rem',
                }}
              >
                {category.icon || category.name.slice(0, 1)}
              </Stack>
              <ListItemText primary={category.name} />
              <EditIcon />
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  deleteUserCategory(user?.handle!, category.id)
                  listUserCategories(user?.handle!)
                    .then((categories) => {
                      setCategories(categories)
                    })
                    .catch((error) => {
                      console.error(error)
                    })
                }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default SettingsCategoryPage
