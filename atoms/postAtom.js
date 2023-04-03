import { atom } from "recoil";

export const handlePostState = atom({
  key: "handlePostState",
  default: false,
});

export const getPostState = atom({
  key: "getPostState",
  default: {},
});

//say you delete a post. if you are using server side posts, they will not update unless you refresh.
export const useSSRPostsState = atom({
  key: "useSSRPostsState",
  default: true,
});