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
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { listUserSpots, type Spot } from '~/models/spots'

const SettingsCategoryPage: React.FC = () => {
  const [spots, setSpots] = useState<Array<Spot>>([])

  useEffect(() => {
    function fetchUserSpots() {
      listUserSpots('Hitoshi_Aiso')
        .then((spots) => {
          setSpots(spots)
        })
        .catch((error) => {
          console.error(error)
        })
    }

    fetchUserSpots()
  }, [])

  return (
    <>
      <Typography variant="h5">スポットの編集</Typography>
      <List>
        {spots.map((spot) => (
          <ListItem
            disablePadding
            key={spot.id}
            onClick={() => {
              console.log('親')
            }}
          >
            <ListItemButton>
              <ListItemText
                primary={spot.title}
                secondary={`${spot.memo} / \n${spot.comment}`}
              />
              <EditIcon />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default SettingsCategoryPage
