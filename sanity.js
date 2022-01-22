import {
  createClient,
  createCurrentUserHook,
  createImageUrlBuilder,
} from "next-sanity";

export const config = {
  // Find your project id and dataset in sanity.json in your studio project
  // RECOMMENDED: Use the project id and dataset as env variables
  // https://nextjs.org/docs/basic-features/environment-variables

  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT,
  apiVersion: "2021-03-25",
  useCdn: process.env.NODE_ENV === "production",
};

//Setting up sanity client for fetching data in the getProps page functions
export const sanityClient = createClient(config);

//Setting up a helper function to extract url from the image asset
export const urlFor = (source) => createImageUrlBuilder(config).image(source);

// function for using the current user logged in account
export const useCurrentUser = createCurrentUserHook(config);
