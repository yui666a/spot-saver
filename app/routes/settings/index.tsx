// import type { ClientLoaderFunctionArgs } from '@remix-run/react'
// import { $path } from 'remix-routes'
// import { requireUser } from '~/services/auth'
// import Setting from './_index'

import { Box, Button } from '@mui/material'
import { useState } from 'react'
import { importCsv } from '~/libs/importCsv'
import { CsvUploadButton } from './CsvUploadButton'

const SettingPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async () => {
    if (file === null) {
      alert('ファイルが選択されていません')
      return
    }
    importCsv(file, 'Hitoshi_Aiso')
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
      <Box>リストの編集</Box>
    </>
  )
}

export default SettingPage
