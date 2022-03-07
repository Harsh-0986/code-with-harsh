import { GetStaticProps } from "next";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
//import BlockContent from "@sanity/block-content-to-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import Head from 'next/head'

interface IFormInput {
	_id: string;
	name: string;
	email: string;
	comment: string;
}

const serializers = {
	types: {
		code: (props: any) => (
			<SyntaxHighlighter
				language={props.node.language || "text"}
				className="m-10 bg-[#e3dddd]"
			>
				{props.node.code}
			</SyntaxHighlighter>
		),
	},

		h1: (props: any) => (
			<h1 className="text-4xl font-bold my-5" {...props} />
		),
		h2: (props: any) => (
			<h2 className="text-3xl font-bold my-5" {...props} />
		),
		h3: (props: any) => {
			return <h3 className="text-2xl font-bold my-5" {...props} />;
		},
		li: ({ children }: any) => (
			<li className="ml-4 list-disc">{children}</li>
		),
		link: ({ href, children }: any) => (
			<a href={href} className="text-blue-500 hover:underline">
				{children}
			</a>
		),
	
};

interface Props {
	post: Post;
}

function Post({ post }: Props) {
	const [submitted, setSubmitted] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IFormInput>();

	const onSubmit: SubmitHandler<IFormInput> = async (data) => {
		fetch("/api/createComment", {
			method: "POST",
			body: JSON.stringify(data),
		})
			.then(() => setSubmitted(true))
			.catch((err) => {
				console.log(err);
				setSubmitted(false);
			});
	};

	return (<>
		<Head>
			<title>{`${post.title} by ${post.author.name}`}"</title>
		</Head>
		<main>
			<Header />

			<img
				className="w-full h-40 object-cover"
				src={urlFor(post.mainImage).url()!}
				alt=""
			/>

			<article className="max-w-3xl mx-auto p-5">
				<h1 className="text-4xl mt-10 mb-4 font-semibold">
					{post.title}
				</h1>
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
						<span className="text-green-600">
							{post.author.name}
						</span>{" "}
						- Published on{" "}
						{new Date(post._createdAt).toLocaleString()}
					</p>
				</div>

				{/* Post Body */}
				<div className="mt-10">
					<PortableText
						dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
						projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
						content={post.body}
						serializers={serializers}
					/>
				</div>
			</article>

			{/* Comments Form and comments */}
			<hr className="max-w-lg my-5 mx-auto border border-yellow-500" />
			{submitted ? (
				<div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto">
					<h3 className="text-3xl font-bold">
						Thank you for submitting
					</h3>
					<p>Your comment is sent for submission</p>
				</div>
			) : (
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
				>
					<h3 className="text-sm text-yellow-500">
						Enjoyed this article?
					</h3>
					<h4 className="text-3xl font-bold">
						Leave a comment below!
					</h4>
					<hr className="py-3 mt-2" />

					<input
						{...register("_id")}
						type="hidden"
						name="_id"
						value={post._id}
					/>

					<label className="block mb-5">
						<span className="text-gray-700 ">Name</span>
						<input
							{...register("name", { required: true })}
							className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
							placeholder="Name"
							type="text"
							/>
					</label>
					<label className="block mb-5">
						<span className="text-gray-700 ">Email</span>
						<input
							{...register("email", { required: true })}
							className="shadow border rounded py-2 px-3 form-input mt-1 block w-full outline-none ring-yellow-500 focus:ring"
							placeholder="Email"
							type="email"
							/>
					</label>
					<label className="block mb-5">
						<span className="text-gray-700 ">Comment</span>
						<textarea
							{...register("comment", { required: true })}
							className="shadow border rounded py-2 px-3 form-text-area mt-1 block w-full ring-yellow-500 focus:ring outline-none"
							placeholder="Comment"
							rows={8}
						/>
					</label>

					{/* Error if validation is failed. */}
					<div className="flex flex-col p-5">
						{errors.name && (
							<span className="text-red-500">
								-The name field is required.
							</span>
						)}
						{errors.email && (
							<span className="text-red-500">
								-The email field is required.
							</span>
						)}
						{errors.comment && (
							<span className="text-red-500">
								-The comment field is required.
							</span>
						)}
					</div>

					<input
						type="submit"
						className="bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
					/>
				</form>
			)}

			{/* Comments */}
			<div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
				<h3 className="text-4xl">Comments</h3>
				<hr className="pb-2" />

				{post.comments?.map((comment) => (
					<div key={comment._id}>
						<p>
							<span className="text-yellow-500">
								{comment.name}:{" "}
							</span>
							{comment.comment}
						</p>
					</div>
				))}
			</div>
		</main>
				</>
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
        'comments': *[
          _type == "comment" && 
          post._ref == ^._id &&
          approved == true
        ],
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
		// revalidate: 86400,
		revalidate: 30,
	};
};
