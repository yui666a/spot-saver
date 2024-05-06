import { selector } from 'recoil'
import { selectedCategoriesState } from '../atoms/categories'
import { spotsState } from '../atoms/spots'

export const selectedSpotsState = selector({
  key: 'selectedSpotsState',
  // Atomで管理していた文字列を加工して文字数として返却する
  get: ({ get }) => {
    const selectedCategories = get(selectedCategoriesState)
    const allSpots = get(spotsState)

    // カテゴリが選択されていない場合は全てのスポットを返却する
    if (selectedCategories.length === 0) return allSpots

    // 選択されたカテゴリに該当するスポットを返却する
    return allSpots.filter((spot) => {
      return selectedCategories.some(
        (selectedCategory) => selectedCategory.id === spot.categoryId,
      )
    })
  },
})
