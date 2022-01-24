import { GetStaticProps } from "next";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import PortableText from "react-portable-text";

interface Props {
  post: Post;
}

function Post({ post }: Props) {
  return (
    <main>
      <Header />

      <img
        className="w-full h-40 object-cover"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />

      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-4xl mt-10 mb-4 font-semibold">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>

        {/* Author */}
        <div className="flex items-center space-x-2">
          <img
            src={urlFor(post.author.image).url()!}
            className="h-10 w-10 rounded-full"
            alt=""
          />
          <p className="text-sm font-extralight">
            Blog post by{" "}
            <span className="text-green-600">{post.author.name}</span> -
            Published on {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        {/* Post Body */}
        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="text-xl font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
    </main>
  );
}
export default Post;

// Telling next js which page to pre build
export const getStaticPaths = async () => {
  // prefetch all the posts
  const query = `*[_type == "post"]{
    _id,
    slug {
       current
    }
  }`;

  const posts = await sanityClient.fetch(query);

  //Creating params
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    // Shows 404 page when it does not exist
    fallback: "blocking",
  };
};

// Needs to tell nextjs how to use the data provided by getStaticPath
// Must always be used with getStaticPath
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `
    *[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author-> {
            name,
            image,
        },
        description,
        mainImage,
        slug,
        body
    }
   `;

  const post = await sanityClient.fetch(query, { slug: params?.slug });

  // Giving code extra protection
  // If no post is found forces nextjs to show 404
  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    // Update the old cache after 1 day
    revalidate: 86400,
  };
};
