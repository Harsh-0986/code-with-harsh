import { GetStaticProps } from "next";
import Header from "../../components/Header";
import { sanityClient } from "../../sanity";
import { Post } from "../../typings";

interface Props {
  post: Post;
}

function Post({ post }: Props) {
  console.log(post);
  return (
    <main>
      <Header />
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
