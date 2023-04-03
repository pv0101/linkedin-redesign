import { useEffect, useState } from "react"
import Input from "./Input"
import { useRecoilState } from "recoil";
import { handlePostState, useSSRPostsState } from "@/atoms/postAtom";
import Post from "./Post";

function Feed({posts}) {
    const [realtimePosts, setRealtimePosts] = useState([]);
    const [handlePost, setHandlePost] = useRecoilState(handlePostState);//for useEffect dependency array
    const [useSSRPosts, setUseSSRPosts] = useRecoilState(useSSRPostsState);//use server side render posts

    //useEffect will fetch posts
    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch("/api/posts", { 
                method: "GET",
                headers: { 'Content-Type': 'application/json'},
            });

            const responseData = await response.json(); //receive response from backend
            setRealtimePosts(responseData);

            // when posting, want to show real time posts not server side posts. if show server side posts then we would have to constantly refresh when new posts are added. This makes it so default is server side posts shown. Real time posts are shown only when there is a change like a post being made
            setHandlePost(false);//reset handlePost atom to false
            setUseSSRPosts(false);//use realtime posts when new post is posted
        };

        fetchPosts();
    },[handlePost]);//when we post a new post with Form.js, handlePost atom will be updated and this useEffect will run to refetch post, this time including new post
    
  return (
    <div className="space-y-6 pb-24 max-w-lg">
        <Input />
        {/* Posts */}
        {!useSSRPosts
        ? realtimePosts.map((post) => //if use SSR Posts is not true, use realtime posts. this should be the option when you make a new post since useSSRPosts will be false
            <Post key={post._id} post={post}/>
        ) //otherwise use server side rendered posts. this will be the option when you are on a newly refreshed page since useSSRPosts should be true.
        : posts.map((post) => <Post key={post._id} post={post}/>)} 
        {/* using only realtimePosts will cause the page to fetch and load on refresh. We dont' want that. So use server side posts */}
        {/* {realtimePosts.map((post) => (
            <>
                <img src={post.photoUrl} alt="" />
                <div>{post.input}</div>
            </>
        ))} */}
    </div>
  )
}

export default Feed