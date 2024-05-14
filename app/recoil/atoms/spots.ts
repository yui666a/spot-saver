import { atom } from "recoil";
import { Spot } from "~/models/spots";

export const spotsState = atom<Array<Spot>>({
  key: 'spotsState',
  default: [],
});
