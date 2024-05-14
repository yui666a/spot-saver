// import type { ClientLoaderFunctionArgs } from '@remix-run/react'
// import { $path } from 'remix-routes'
// import { requireUser } from '~/services/auth'
// import Setting from './_index'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import { useRecoilState } from 'recoil'
import { deleteUserSpot, listUserSpots } from '~/models/spots'
import { categoriesState } from '~/recoil/atoms/categories'
import { spotsState } from '~/recoil/atoms/spots'
import { useAuthUser } from '~/services/auth'

const SettingsCategoryPage: React.FC = () => {
  const [allSpots, setAllSpots] = useRecoilState(spotsState)
  const [categories] = useRecoilState(categoriesState)

  const user = useAuthUser()

  return (
    <>
      <Typography variant="h5">スポットの編集</Typography>
      <List>
        {allSpots.length === 0 && (
          <ListItem>
            <ListItemText primary="スポットがありません" />
          </ListItem>
        )}
        {allSpots.map((spot) => (
          <ListItem
            disablePadding
            key={spot.id}
            onClick={() => {
              console.log('親')
            }}
          >
            <ListItemButton>
              <Chip
                label={categories.find((c) => c.id === spot.categoryId)?.name}
              />
              <ListItemText
                primary={spot.title}
                secondary={`${spot.memo} / \n${spot.comment}`}
              />
              <EditIcon />
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  deleteUserSpot(user?.handle!, spot.id)
                  listUserSpots(user?.handle!)
                    .then((spots) => {
                      setAllSpots(spots)
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
