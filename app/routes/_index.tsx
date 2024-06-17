// Import necessary components and hooks
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Form, useNavigation, Link } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useState } from "react"; // Import useState hook
import { getSupabase } from "~/supabaseclient"; // Import Supabase client instance

// Meta function for setting the page metadata
export const meta: MetaFunction = () => {
  return [
    { title: "Image Search App" },
    { name: "description", content: "Search for images using Unsplash API and Supabase" },
  ];
};

// Loader function to fetch data based on search query
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  if (!query) {
    return json({ unsplashData: { results: [] }, supabaseData: [] }); // Return empty arrays if no query
  }

  // Fetch data from Unsplash API
  const unsplashResponse = await fetch(`https://api.unsplash.com/search/photos?page=1&per_page=30&query=${query}`, {
    headers: {
      Authorization: 'Client-ID Sahsc_dhXRNry03wAoExe_vHRMHKuNa6JT8_KFn3mOA',
    },
  });

  if (!unsplashResponse.ok) {
    throw new Error(`Error fetching photos from Unsplash: ${unsplashResponse.statusText}`);
  }

  const unsplashData = await unsplashResponse.json();

  // Fetch data from Supabase database (example assumes 'posts' table)
  const supabase = getSupabase();
  const { data: supabaseData, error } = await supabase.from('posts').select('*').ilike('heading', `%${query}%`);

  if (error) {
    throw new Error(`Error fetching posts from Supabase: ${error.message}`);
  }

  return json({ unsplashData, supabaseData });
};

// Main component
export default function Component() {
  const { unsplashData, supabaseData } = useLoaderData();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null); // State to track expanded post

  // Function to handle clearing the search input
  const handleClearSearch = () => {
    setSearchQuery(""); // Clear search query
  };

  // Function to toggle expanded state of a post
  const togglePostExpansion = (postId: string) => {
    setExpandedPostId((prevId) => (prevId === postId ? null : postId)); // Toggle between postId and null
  };

  // Handle key press event for accessibility
  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>, postId: string) => {
    if (event.key === 'Enter') {
      togglePostExpansion(postId);
    }
  };

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
            Discover the Best Content
          </h1>
          <p className="text-xl text-gray-200 sm:text-2xl">
            Search through our vast library to find what you're looking for.
          </p>
          <div className="w-full items-center justify-center">
            <Form method="get" className="relative">
              <div className="relative flex items-center">
                <Input
                  name="query"
                  type="search"
                  value={searchQuery} // Bind value to searchQuery state
                  onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state
                  placeholder="Search..."
                  className="w-full h-12 px-6 py-4 text-lg rounded-full bg-white/90 text-gray-900 focus:bg-white focus:outline-none"
                />
                {searchQuery && ( // Conditionally render clear button when searchQuery has value
                  <Button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                    onClick={handleClearSearch}
                  >
                    Clear
                  </Button>
                )}
              </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Display results from Unsplash API */}
          {unsplashData.results && unsplashData.results.length > 0 ? (
            unsplashData.results.map((photo: any) => (
              <div key={photo.id} className="relative overflow-hidden rounded-lg shadow-md bg-gray-400 hover:scale-105 transition-transform duration-300">
                <img
                  src={photo.urls.small}
                  alt={photo.alt_description}
                  className="w-full h-48 object-cover rounded-t-lg cursor-pointer"
                  onClick={() => navigation.navigate(`/detail/${photo.id}`)} // Navigate to detail page on click
                  onKeyPress={(e) => handleKeyPress(e, photo.id)} // Handle key press for accessibility
                  tabIndex={0} // Make it focusable for keyboard navigation
                />
                <div className="p-4 bg-gray-600 text-white">
                  <h3 className="text-lg font-bold mb-2 text-center capitalize">{photo.alt_description}</h3>
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
            ))
          ) : (
            <p className="text-gray-800">No results found from Unsplash.</p>
          )}

          {/* Display results from Supabase database */}
          {supabaseData.length > 0 ? (
            supabaseData.map((post: any) => (
              <div key={post.id} className="bg-white shadow-md rounded-lg p-4">
                <div
                  role="button"
                  className="relative overflow-hidden rounded-lg shadow-md bg-gray-400 hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => togglePostExpansion(post.id)}
                  onKeyPress={(e) => handleKeyPress(e, post.id)}
                  tabIndex={0}
                >
                  <img
                    src={post.image_url} // Assuming 'image_url' is the field in Supabase containing the image URL
                    alt={post.heading}
                    className="w-full h-48 object-cover rounded-t-lg cursor-pointer"
                  />
                  <div className="p-4 bg-gray-600 text-white">
                    <h3 className="text-lg font-bold mb-2 text-center capitalize">{post.heading}</h3>
                    {expandedPostId === post.id ? (
                      <div>
                        <div dangerouslySetInnerHTML={{ __html: post.content }} /> {/* Render HTML content */}
                        <div className="flex justify-center mt-2">
                          <Button
                            className="bg-gray-900 text-white px-4 py-2 rounded-md focus:outline-none"
                            onClick={() => togglePostExpansion(post.id)}
                          >
                            Hide Content
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <Button
                          className="bg-gray-900 text-white px-4 py-2 rounded-md focus:outline-none"
                          onClick={() => togglePostExpansion(post.id)}
                        >
                          Show Content
                        </Button>

                        </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-800">No results found from Supabase.</p>
          )}
        </div>
      </div>
    </div>
  );
}

