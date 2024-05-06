import PapaParse from 'papaparse'
import { addUserCategory } from '~/models/categories'
import { addUserSpot, getLatLng, Spot } from '~/models/spots'

type CsvSpot = {
  URL: string
  タイトル: string
  コメント: string
  メモ: string
}
export const importCsv = async (csvFile: File, handle: string) => {
  // ファイル名から拡張子を除去してカテゴリに使用する
  const categoryName = csvFile.name.replace(/\.[^/.]+$/, '')

  // カテゴリを追加
  const categoryRef = await addUserCategory(handle, {
    color: '#cccccc',
    icon: '',
    name: categoryName,
  })
  const categoryId = categoryRef.id

  // CSVファイルをパース
  const csvData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) =>
      resolve((event.target as FileReader).result as string)
    reader.onerror = (error) => reject(error)
    reader.readAsText(csvFile)
  })

  const { data } = PapaParse.parse<CsvSpot>(csvData, { header: true })

  // 各行をスポットとして追加
  for (const row of data) {
    if (row['URL'] === undefined) {
      console.error("row['URL'] で詰まった", row)
      continue
    }
    const url = new URL(row['URL'])
    const placeName = decodeURIComponent(
      url.pathname.split('/place/')[1].split('/')[0],
    )
    const position = await getLatLng(placeName)
    if (position === null) {
      alert(`${placeName}の位置情報が取得できませんでした`)
      continue
    }

    const spot: Omit<Spot, 'id' | 'createdAt' | 'updatedAt'> = {
      comment: row['コメント'],
      categoryId,
      memo: row['メモ'],
      title: row['タイトル'],
      url: row['URL'],
      position,
    }
    await addUserSpot(handle, spot)
  }
}
