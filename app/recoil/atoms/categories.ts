import { atom } from "recoil";
import { Category } from "~/models/categories";

export const categoriesState = atom<Array<Category>>({
  key: 'categoriesState',
  default: [],
});

export const selectedCategoriesState = atom<Array<Category>>({
  key: 'selectedCategoriesState',
  default: [],
});