import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import React from 'react'

type Props = {
  file: File | null
  setFile: (arg: File | null) => void
}

export const CsvUploadButton: React.FC<Props> = ({ file, setFile }) => {
  const inputId = Math.random().toString(32).substring(2)

  const handleOnAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files: File[] = []

    for (const file of e.target.files) {
      files.push(file)
    }
    setFile(files[0])
    e.target.value = ''
  }

  return (
    <>
      <label htmlFor={inputId}>
        <Button variant="contained" component="span" sx={{ mt: 4 }}>
          CSVファイルアップロード
        </Button>
        <Typography>{file?.name}</Typography>
        <input
          id={inputId}
          type="file"
          multiple
          accept=".csv"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleOnAddImage(e)
          }
          style={{ display: 'none' }}
        />
      </label>
    </>
  )
}
