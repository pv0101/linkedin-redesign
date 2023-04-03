import { AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Feed from "../components/Feed";
import { useRecoilState } from "recoil";
import { modalState, modalTypeState } from "@/atoms/modalAtom";
import Modal from "../components/Modal";
import { connectToDatabase } from "@/util/mongodb";
import Widgets from "../components/Widgets";

export default function Home({ posts, articles }) {
    // use atoms and Recoil for state management (like global variable)
    const [modalOpen, setModalOpen] = useRecoilState(modalState)
    const [modalType, setModalType] = useRecoilState(modalTypeState)
  const router = useRouter();
  
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      //The user is not authenitcaed, handle it here.
      router.push("/home"); //push user to home page if not logged in
    },
  }); //hook to get user session. this version is for client side

  return (
    // height of div is height of screen. any content that overflows height of screen you have to scroll to get to
    <div className="bg-[#F3F2EF] dark:bg-black dark:text-white h-screen overflow-y-scroll md:space-y-6">
      <Head>
        <title>Feed | LinkedIn</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex justify-center gap-x-5 px-4 sm:px-12">
        {/* use gap instead of space when  */}
        <div className="flex flex-col md:flex-row gap-5">
          <Sidebar />
          <Feed posts={posts}/>
        </div>
        <Widgets articles={articles}/>
        <AnimatePresence>
          {modalOpen && (
            <Modal handleClose={() => setModalOpen(false)} type={modalType} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

//server side rendering only works on pages not components
// server side rendering. prevents flickering of components like avatar pic and name when page loads
export async function getServerSideProps(context) {
  //context contains data, like query params when navigating to different page
  // Check if the user is authenticated on the server...
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/home",
      },
    };
  }

//   Get posts on SSR
  const {db} = await connectToDatabase();
  const posts = await db.collection("posts").find().sort({timestamp: -1}).toArray();

//   Get Google News API
const results = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`
).then((res) => res.json());//results contains articles array

  return {
    props: {
      session,
      articles: results.articles,
      posts: posts.map((post) => ({ //cannot just return posts because post _id in database is not a string so we get an error. need to go through each post and make id a string (and add all other post data) in a new object
        _id: post._id.toString(),
        input: post.input,
        photoUrl: post.photoUrl,
        username: post.username,
        email: post.email,
        userImg: post.userImg,
        createdAt: post.createdAt,
      })),
    },
  };
}
