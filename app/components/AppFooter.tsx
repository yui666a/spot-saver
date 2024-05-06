import { Box } from '@mui/material'
import Stack from '@mui/material/Stack'
import { useSignOut } from '~/routes/auth+/sign_out'
import { useAuthUser } from '~/services/auth'

export const AppFooter = () => {
  const user = useAuthUser()
  const { signOut } = useSignOut()

  return (
    <Stack direction="row" height="48px">
      <Box>星１</Box>
      <Box>星２</Box>
      <Box>星３</Box>
      <Box>設定</Box>
    </Stack>
  )
}
