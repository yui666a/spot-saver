import { Box } from '@mui/material'
import Stack from '@mui/material/Stack'
import { Link } from '@remix-run/react'
import { useRecoilState } from 'recoil'
import { $path } from 'remix-routes'
import { Category } from '~/models/categories'
import { selectedCategoriesState } from '~/recoil/atoms/categories'

type AppFooterProps = {
  categories: Array<Category>
}

export const AppFooter: React.FC<AppFooterProps> = ({ categories }) => {
  // const user = useAuthUser()
  // const { signOut } = useSignOut()
  const [selectedCategories, setSelectedCategories] = useRecoilState(
    selectedCategoriesState,
  )

  const handleCategoryClick = (category: Category) => {
    if (
      selectedCategories.some(
        (selectedCategory) => selectedCategory.id === category.id,
      )
    ) {
      setSelectedCategories(
        selectedCategories.filter(
          (selectedCategory) => selectedCategory.id !== category.id,
        ),
      )
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  return (
    <Stack direction="row" height="48px" sx={{ background: '#ccc' }}>
      {categories.map((category) => (
        <Box
          key={category.id}
          onClick={() => {
            handleCategoryClick(category)
          }}
          sx={{
            background: selectedCategories.some(
              (selectedCategory) => selectedCategory.id === category.id,
            )
              ? 'blue'
              : category.color,

            cursor: 'pointer',
          }}
        >
          {category.name}
        </Box>
      ))}
      <Link
        className="flex items-center gap-2 hover:underline"
        to={$path('/settings')}
      >
        <Box>設定</Box>
      </Link>
    </Stack>
  )
}
