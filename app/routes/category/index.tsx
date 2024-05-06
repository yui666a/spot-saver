// import type { ClientLoaderFunctionArgs } from '@remix-run/react'
// import { $path } from 'remix-routes'
// import { requireUser } from '~/services/auth'
// import Setting from './_index'

import EditIcon from '@mui/icons-material/Edit'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { listUserCategories, type Category } from '~/models/categories'

const SettingsCategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Array<Category>>([])

  useEffect(() => {
    function fetchUserCategories() {
      listUserCategories('Hitoshi_Aiso')
        .then((categories) => {
          setCategories(categories)
        })
        .catch((error) => {
          console.error(error)
        })
    }

    fetchUserCategories()
  }, [])

  return (
    <>
      <Typography variant="h5">カテゴリーの編集</Typography>
      <List>
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
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default SettingsCategoryPage
