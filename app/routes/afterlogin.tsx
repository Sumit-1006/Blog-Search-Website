// Import necessary components and hooks
import { json, Form, useActionData, useLoaderData } from "@remix-run/react";
import { getSupabase } from "~/supabaseclient";
import { Link, useNavigate } from "react-router-dom";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

// Loader function to fetch recent blogs and search results
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  const supabase = getSupabase();
  let recentBlogs = [];
  let searchResults = [];

  if (query) {
    const { data: searchData, error: searchError } = await supabase
      .from("posts")
      .select("*")
      .ilike("heading", `%${query}%`);
    if (searchError) {
      console.error("Error searching blogs:", searchError.message);
    } else {
      searchResults = searchData;
    }
  }

  const { data: blogs, error: blogsError } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(16);

  if (blogsError) {
    console.error("Error fetching recent blogs:", blogsError.message);
  } else {
    recentBlogs = blogs;
  }

  return json({ recentBlogs, searchResults });
};

// Action function to add new blog data
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const imageUrl = formData.get("image-url") as string;
  const heading = formData.get("heading") as string;
  const content = formData.get("content") as string;

  if (!imageUrl.trim() || !heading.trim() || !content.trim()) {
    return json({ error: "Please fill all fields" }, { status: 400 });
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from("posts")
    .insert([{ image_url: imageUrl, heading, content, created_at: new Date() }]);

  if (error) {
    console.error("Supabase Insert Error:", error.message);
    return json({ error: error.message }, { status: 500 });
  }

  return json({ success: "New Blog Added" });
};

// Main component
export default function AfterLogin() {
  const actionData = useActionData();
  const { recentBlogs, searchResults } = useLoaderData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogHistory, setBlogHistory] = useState<any[]>([]);

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setBlogs(searchResults);
    } else {
      setBlogs(recentBlogs);
    }
    setBlogHistory(recentBlogs);
  }, [recentBlogs, searchResults]);

  const handleSignOut = async () => {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error.message);
    } else {
      navigate("/");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert("Please enter a search query");
      return;
    }

    navigate(`?query=${searchQuery}`);
  };

  const toggleSearch = () => {
    setSearchQuery("");
    navigate(`/afterlogin`);
  };

  return (
    <div className="relative w-full h-screen bg-gray-200 flex">
      <div className="bg-gray-900 text-white w-1/5 py-8 px-4 z-10">
        <h2 className="text-2xl font-bold mb-4">Recently Added</h2>
        <ul>
          {blogHistory.slice(0, 7).map((post: any) => (
            <li
              key={post.id}
              className="mb-4 cursor-pointer hover:underline list-disc list-inside"
              onClick={() => navigate(`/newdetail/${post.id}`)}
            >
              {post.heading}
            </li>
          ))}
        </ul>
      </div>

      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("image (1).png")', filter: "blur(8px)" }}
      ></div>

      <div className="flex-1 relative z-10 px-4 md:px-6 lg:px-8 flex justify-center items-center">
        <div className="absolute top-4 right-4">
          <Link
            to="/"
            onClick={handleSignOut}
            className="inline-flex items-center rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none"
          >
            Sign Out
          </Link>
        </div>
        {actionData?.success && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-4 bg-green-200 text-green-800 font-bold text-2xl rounded-lg shadow-md">
            {actionData.success}
          </div>
        )}
        <div className="max-w-4xl w-full p-6 bg-white bg-opacity-70 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Enter New Blog Data
          </h2>
          <Form method="post">
            <div className="space-y-6">
              <div className="space-y-4">
                <label htmlFor="image-url" className="text-lg">
                  Image URL
                </label>
                <input
                  id="image-url"
                  name="image-url"
                  placeholder="Enter image URL"
                  className="w-full px-4 py-2 text-lg bg-white bg-opacity-70 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-4">
                <label htmlFor="heading" className="text-lg">
                  Heading
                </label>
                <input
                  id="heading"
                  name="heading"
                  placeholder="Enter heading"
                  className="w-full px-4 py-2 text-lg bg-white bg-opacity-70 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-4">
                <label htmlFor="content" className="text-lg">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  placeholder="Enter content"
                  rows={5}
                  className="w-full px-4 py-2 text-lg bg-white bg-opacity-70 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="px-6 py-3 text-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Blog
              </button>
            </div>
          </Form>
          {actionData?.error && (
            <p className="text-red-600 mt-4">{actionData.error}</p>
          )}
          <div className="flex justify-center mt-6">
            <button
              type="button"
              className="px-6 py-3 text-lg bg-gray-900 text-white hover:bg-gray-800 focus:outline-none"
              onClick={toggleSearch}
            >
              Clear Search
            </button>
          </div>
          <Form onSubmit={handleSearch} className="mt-6">
            <div className="relative flex items-center">
              <Input
                name="search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs..."
                className="w-full h-12 px-6 py-4 text-lg rounded-full bg-white/90 text-gray-900 focus focus"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-900 px-6 py-2 text-white hover:bg-gray-800 focus:outline-none"
              >
                Search
              </Button>
            </div>
          </Form>
          <div className="mt-6">
            {blogs.map((post: any) => (
              <div
                key={post.id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 mb-4"
                onClick={() => navigate(`/newdetail/${post.id}`)}
              >
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{post.heading}</h3>
                  <p className="text-gray-800">{post.content}</p>
                </div>
              </div>
            ))}
            {blogs.length === 0 && (
              <p className="text-center text-gray-800">No blogs found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
