import Head from "next/head";
import Header from "../components/Header";

import { sanityClient } from "../sanity";
import { Post } from "../typings";

interface Props {
  posts: [Post];
}

export default function Home({ posts }: Props) {
  //Getting the posts
  console.log(posts);

  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Code with harsh</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <Header />

      {/* Main Banner */}
      <div className="flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0">
        <div className="px-10 space-y-5">
          {/* Tagline */}
          <h1 className="text-6xl max-w-xl font-serif">
            <span className="underline decoration-black decoration-4">
              Medium
            </span>{" "}
            is a place to write read and connect
          </h1>
          <h2>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit
            veritatis libero nihil tenetur aliquid atque.
          </h2>
        </div>
        <img
          className="hidden md:inline-flex h-32 lg:h-full"
          src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
          alt=""
        />
      </div>

      {/* Posts */}
    </div>
  );
}

// Enabling server side rendering
export const getServerSideProps = async () => {
  const query = `
  *[_type == "post"]{
    _id,
    title,
    author-> {
      name,
      image,
    },
    description,
    mainImage,
    slug
  }`;

  //Fetching posts
  const posts = await sanityClient.fetch(query);

  //Passing posts to frontend
  return { props: { posts } };
};
