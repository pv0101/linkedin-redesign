import { Avatar, IconButton } from "@mui/material";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ThumbUpOffAltOutlinedIcon from "@mui/icons-material/ThumbUpOffAltOutlined";
import ThumbUpOffAltRoundedIcon from "@mui/icons-material/ThumbUpOffAltRounded";
import { useRecoilState } from "recoil";
import { handlePostState, getPostState } from "../atoms/postAtom";
import { useState } from "react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import { modalState, modalTypeState } from "../atoms/modalAtom";
import TimeAgo from "timeago-react";
import { useSession } from "next-auth/react";

function Post({ post, modalPost }) {
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [showInput, setShowInput] = useState(false); //for ...see more on post. showing whole input of post
  const [modalType, setModalType] = useRecoilState(modalTypeState);
  const [postState, setPostState] = useRecoilState(getPostState); //store post in modal view for use in Modal.js
  const [liked, setLiked] = useState(false); //for like icon
  const { data: session } = useSession();
  const [handlePost, setHandlePost] = useRecoilState(handlePostState);

  //truncate function to truncate input
  const truncate = (string, n) =>
    string?.length > n ? string.substr(0, n - 1) + "...see more" : string;

    //delete post function
    //async because we are querying database
    const deletePost = async () => {
        //we want to go to a singular post route to delete it
        const response = await fetch(`/api/posts/${post._id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        setHandlePost(true)//change handlePost so Feed will update
        setModalOpen(false)//user could have had post modal open and delete from there. Close modal
    };

  return (
    <div
      className={`bg-white dark:bg-[#1D2226] 
    ${modalPost ? "rounded-r-lg" : "rounded-lg"}
     space-y-2 py-2.5 border border-gray-300 dark:border-none`}
    >
      <div className="flex items-center px-2.5 cursor-pointer">
        <Avatar src={post.userImg} className="!h-10 !w-10 cursor-pointer" />
        <div className="mr-auto ml-2 leading-none">
          <h6 className="font-medium hover:text-blue-500 hover:underline">
            {post.username}
          </h6>
          <p className="text-sm dark:text-white/75 opacity-80">{post.email}</p>
          <TimeAgo
            datetime={post.createdAt}
            className="text-xs dark:text-white/75 opacity-80"
          />
        </div>
        {modalPost ? (
          <IconButton onClick={() => setModalOpen(false)}>
            <CloseRoundedIcon className="dark:text-white/75 h-7 w-7" />
          </IconButton>
        ) : (
          <IconButton>
            <MoreHorizRoundedIcon className="dark:text-white/75 h-7 w-7" />
          </IconButton>
        )}
      </div>

      {post.input && ( //make sure input exists
        <div className="px-2.5 break-all md:break-normal">
          {/* word break-all for when someone spams a long string in post. Keeps display clean */}
          {modalPost || showInput ? (
            <p onClick={() => setShowInput(false)}>{post.input}</p>
          ) : (
            <p onClick={() => setShowInput(true)}>
              {truncate(post.input, 150)}
            </p>
          )}
          {/* if viewing modal or when ...see more is clicked, show whole input. otherwise show truncated input. clicking on input will switch back and forth between truncated and not truncated */}
        </div>
      )}

      {post.photoUrl && !modalPost && (
        <img
          src={post.photoUrl}
          alt=""
          className="w-full cursor-pointer"
          onClick={() => {
            setModalOpen(true); //open modal
            setModalType("gifYouUp"); //change modal type. we are viewing a post modal
            setPostState(post); //store our post in postState atom. For passing to Modal.js
          }}
        />
      )}

      <div className="flex justify-evenly items-center dark:border-t border-gray-600/80 pt-2 text-black/60 dark:text-white/75">
        {modalPost ? ( //if modal then show comment instead of liked icon
          <button className="postButton">
            <CommentOutlinedIcon />
            <h4>Comment</h4>
          </button>
        ) : (
          //not on modal so show liked icon
          <button
            className={`postButton ${liked && "text-blue-500"}`}
            onClick={() => setLiked(!liked)}
          >
            {liked ? ( //if liked is clicked
              <ThumbUpOffAltRoundedIcon className="-scale-x-100" /> //show filled icon
            ) : (
              <ThumbUpOffAltOutlinedIcon className="-scale-x-100" /> //show unfilled icon
            )}

            <h4>Like</h4>
          </button>
        )}

        {session?.user?.email === post.email ? (//check if logged in user is the same as the user who made the post
          <button//if so show delete icon
            className="postButton focus:text-red-400"
            onClick={deletePost}
          >
            <DeleteRoundedIcon />
            <h4>Delete post</h4>
          </button>
        ) : (//otherwise show share icon
          <button className="postButton ">
            <ReplyRoundedIcon className="-scale-x-100" />
            <h4>Share</h4>
          </button>
        )}
      </div>
    </div>
  );
}

export default Post;
