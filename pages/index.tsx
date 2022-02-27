import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";

import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";

interface Props {
  posts: [Post];
}

export default function Home({ posts }: Props) {
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
              Code with harsh
            </span>{" "}
            is a place for developers by a developer
          </h1>
          {/* <h2></h2> */}
        </div>
        <img
          className="hidden md:inline-flex h-32 lg:h-full"
          src="https://github.com/Harsh-0986/code-with-harsh/blob/main/public/logo.PNG"
          alt=""
        />
      </div>

      {/* Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="group cursor-pointer border rounded-lg overflow-hidden">
              <img
                src={urlFor(post.mainImage).url()!}
                alt=""
                className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
              />
              <div className="flex justify-between p-5 bg-white">
                {/* Title and description */}
                <div>
                  <p className="text-lg font-bold">{post.title}</p>
                  <p className="text-xs">
                    {post.description} by {post.author.name}
                  </p>
                </div>
                {/* Author's image */}
                <img
                  className="h-12 w-12 rounded-full"
                  src={urlFor(post.author.image).url()!}
                  alt=""
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
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
