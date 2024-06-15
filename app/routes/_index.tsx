import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Form, useNavigation, Link } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

// Meta function for setting the page metadata
export const meta: MetaFunction = () => {
  return [
    { title: "Image Search App" },
    { name: "description", content: "Search for images using Unsplash API" },
  ];
};

// Loader function to fetch data based on search query
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  if (!query) {
    return json({ results: [] }); // Return an empty array if no query
  }

  const response = await fetch(`https://api.unsplash.com/search/photos?page=1&per_page=30&query=${query}`, {
    headers: {
      Authorization: 'Client-ID Sahsc_dhXRNry03wAoExe_vHRMHKuNa6JT8_KFn3mOA',
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching photos: ${response.statusText}`);
  }

  const data = await response.json();
  return json(data);
};

// Main component
export default function Component() {
  const data = useLoaderData();
  const navigation = useNavigation();

  return (
    <div className="relative w-full h-screen bg-gray-200">
      <img
        src="/image (1).png"
        alt="Blog"
        className="absolute inset-0 w-full h-full object-cover filter blur-sm"
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl w-full space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-50 sm:text-5xl lg:text-6xl">
            Discover the Best Blog Content
          </h1>
          <p className="text-lg text-gray-200 sm:text-xl">
            Search through our vast library of blog posts to find the content you're looking for.
          </p>
          <div className="w-full items-center justify-center">
            <Form method="get" className="relative">
              <Input
                name="query"
                type="search"
                placeholder="Search images..."
                className="w-full rounded-full bg-white/90 px-6 py-4 text-gray-900 focus:bg-white focus:outline-none"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-900 px-6 py-2 text-white hover:bg-gray-800 focus:outline-none"
              >
                {navigation.state === "submitting" ? "Searching..." : "Search"}
              </Button>
            </Form>
          </div>
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <Link
            to="/adminsignup"
            className="inline-flex items-center rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none"
            prefetch="none"
          >
            Admin Sign up
          </Link>
          <Link
            to="/adminlogin"
            className="inline-flex items-center rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none"
            prefetch="none"
          >
            Admin Login
          </Link>
        </div>
      </div>
      <div className="relative z-10 mt-8 px-4 md:px-6 lg:px-8">
        {data.results && data.results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.results.map((photo: any) => (
              <div key={photo.id} className="relative overflow-hidden rounded-lg shadow-md bg-gray-400 hover:scale-105 transition-transform duration-300">
                <img
                  src={photo.urls.small}
                  alt={photo.alt_description}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4 bg-gray-600 text-white">
                  <h3 className="text-lg font-bold mb-2 text-center">{photo.alt_description}</h3>
                  <div className="flex justify-center">
                    <Link
                      to={`/detail/${photo.id}`}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md focus:outline-none"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-800">No results found.</p>
        )}
      </div>
    </div>
  );
}
