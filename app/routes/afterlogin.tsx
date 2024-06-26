import { json, Form, useActionData, useLoaderData } from "@remix-run/react";
import { getSupabase } from "~/supabaseclient";
import { Link, useNavigate } from "react-router-dom";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  // Fetch recent blogs from Supabase
  const supabase = getSupabase();
  const { data: recentBlogs, error: recentBlogsError } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(7);

  if (recentBlogsError) {
    throw new Error(`Error fetching recent blogs from Supabase: ${recentBlogsError.message}`);
  }

  // Fetch data from Unsplash API
  let unsplashData = { results: [] };
  if (query) {
    const unsplashResponse = await fetch(
      `https://api.unsplash.com/search/photos?page=1&per_page=30&query=${query}`,
      {
        headers: {
          Authorization: "Client-ID Sahsc_dhXRNry03wAoExe_vHRMHKuNa6JT8_KFn3mOA",
        },
      }
    );

    if (!unsplashResponse.ok) {
      throw new Error(`Error fetching photos from Unsplash: ${unsplashResponse.statusText}`);
    }

    unsplashData = await unsplashResponse.json();
  }

  // Fetch data from Supabase database for the main search
  const { data: supabaseData, error } = await supabase
    .from("posts")
    .select("*")
    .ilike("heading", `%${query}%`);

  if (error) {
    throw new Error(`Error fetching posts from Supabase: ${error.message}`);
  }

  return json({ unsplashData, supabaseData, recentBlogs });
};



export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const imageUrl = formData.get("image-url") as string;
  const heading = formData.get("heading") as string;
  const content = formData.get("content") as string;

  // Check if any field is empty
  if (!imageUrl.trim() || !heading.trim() || !content.trim()) {
    return json({ error: "Please fill the empty columns" }, { status: 400 });
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from("posts")
    .insert([
      { image_url: imageUrl, heading, content, created_at: new Date() },
    ]);

  if (error) {
    console.error("Supabase Insert Error:", error.message);
    return json({ error: error.message }, { status: 500 });
  }

  return json({ success: "New Blog Added" });
};

export default function AfterLogin() {
  const { unsplashData, supabaseData, recentBlogs } = useLoaderData();
  const actionData = useActionData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [displaySearch, setDisplaySearch] = useState(false);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogHistory, setBlogHistory] = useState<any[]>([]);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  useEffect(() => {
    if (recentBlogs) {
      setBlogs(recentBlogs);
      setBlogHistory(recentBlogs);
    }
  }, [recentBlogs]);

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
      alert("Please fill the empty columns");
      return;
    }

    const supabase = getSupabase();
    const { data: searchResults, error } = await supabase
      .from("posts")
      .select("*")
      .ilike("heading", `%${searchQuery}%`);

    if (error) {
      console.error("Error searching blogs:", error.message);
    } else {
      setBlogs(searchResults);
    }
    setDisplaySearch(false);
  };

  const toggleSearch = () => {
    setDisplaySearch((prevState) => !prevState);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const togglePostExpansion = (postId: string) => {
    setExpandedPostId((prevId) => (prevId === postId ? null : postId));
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLDivElement>,
    postId: string
  ) => {
    if (event.key === "Enter") {
      togglePostExpansion(postId);
    }
  };

  const handleExploreSupabase = (postId: string) => {
    navigate(`/newdetail/${postId}`);
  };

  return (
    <div className="relative w-full h-screen">
      <img
        src="/image (1).png"
        alt="Blog"
        className="absolute inset-0 w-full h-full object-cover filter blur-sm"
      />
      <div className="relative w-full h-screen flex">
        <div className="bg-gray-900 text-white w-1/5 py-8 px-4 z-10 h-screen overflow-y-auto">
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
              Enter the New Data
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
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="px-6 py-3 text-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Data
                </button>
              </div>
            </Form>
            {actionData?.error && (
              <p className="text-red-600 mt-4">{actionData.error}</p>
            )}
            <br />
            <div>
            <Form method="get" className="relative">
              <div className="relative flex items-center">
                <Input
                  name="query"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full h-12 px-6 py-4 text-lg rounded-full bg-white/90 text-gray-900 focus:bg-white focus:outline-none"
                />
                {searchQuery && (
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
                Search
              </Button>
            </Form>
            </div>
            
          </div>
        </div>
        
      </div>
      <div className="relative z-10 mt-8 px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {supabaseData.length > 0 ? (
            supabaseData.map((post: any) => (
              <div
                key={post.id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div
                  className="relative overflow-hidden rounded-t-lg cursor-pointer"
                  onClick={() => togglePostExpansion(post.id)}
                  onKeyPress={(e) => handleKeyPress(e, post.id)}
                  tabIndex={0}
                >
                  <img
                    src={post.image_url}
                    alt={post.heading}
                    className="w-full h-96 object-cover"
                  />
                  <div className="p-4 bg-gray-600 text-white">
                    <h3 className="text-lg font-bold mb-2 text-center capitalize">
                      {post.heading}
                    </h3>
                    {expandedPostId === post.id ? (
                      <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    ) : (
                      <div className="flex justify-center">
                        <Button
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md focus:outline-none"
                          onClick={() => handleExploreSupabase(post.id)}
                        >
                          Explore
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-800"></p>
          )}
          {/* Display results from Unsplash API */}
          {unsplashData.results && unsplashData.results.length > 0 ? (
            unsplashData.results.map((photo: any) => (
              <div
                key={photo.id}
                className="relative overflow-hidden rounded-lg shadow-md bg-gray-400 hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={photo.urls.small}
                  alt={photo.alt_description}
                  className="w-full h-96 object-cover rounded-t-lg cursor-pointer"
                  onClick={() => navigate(`/detail/${photo.id}`)}
                  onKeyPress={(e) => handleKeyPress(e, photo.id)}
                  tabIndex={0}
                />
                <div className="p-4 bg-gray-600 text-white">
                  <h3 className="text-lg font-bold mb-2 text-center capitalize">
                    {photo.alt_description}
                  </h3>
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
            <p className="text-gray-800"></p>
          )}

          {/* Display results from Supabase database */}
        </div>
      </div>
    </div>
  );
}

