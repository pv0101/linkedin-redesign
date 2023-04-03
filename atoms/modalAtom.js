//atoms are like useState but useState only works within component. atoms and Recoil are state management that lets us have pieces of state throughout application without prop drilling or passing variables from component to component. (Think like global variables?)

import { atom } from "recoil";

export const modalState = atom({
  key: "modalState",
  default: false,
});

export const modalTypeState = atom({
  key: "modalTypeState",
  default: "dropIn",
});