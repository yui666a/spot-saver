// import type { ClientLoaderFunctionArgs } from '@remix-run/react'
// import { $path } from 'remix-routes'
// import { requireUser } from '~/services/auth'
// import Setting from './_index'

import { Box, Button } from '@mui/material'
import { useNavigate } from '@remix-run/react'
import { useState } from 'react'
import { $path } from 'remix-routes'
import { importCsv } from '~/libs/importCsv'
import { useAuthUser } from '~/services/auth'
import { CsvUploadButton } from './CsvUploadButton'

const SettingPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const user = useAuthUser()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!user?.handle) {
      alert('ログインしてください')
      return
    }

    if (file === null) {
      alert('ファイルが選択されていません')
      return
    }

    importCsv(file, user.handle)
      .then(() => {
        alert('インポートが完了しました')
      })
      .catch((error) => {
        console.error(error)
        alert('インポートに失敗しました')
      })
  }

  return (
    <>
      <Box>CSVのインポート</Box>
      <CsvUploadButton file={file} setFile={setFile} />
      <Button
        disabled={file === null}
        variant="contained"
        onClick={handleSubmit}
        color="success"
      >
        送信
      </Button>
      <Button onClick={() => navigate($path('/spot'))}>Spotの編集</Button>
      <Button onClick={() => navigate($path('/category'))}>
        カテゴリーの編集
      </Button>
    </>
  )
}

export default SettingPage
