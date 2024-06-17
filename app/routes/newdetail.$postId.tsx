// app/routes/newdetail.$postId.tsx

import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSupabase } from "~/supabaseclient";

// Meta function for setting the page metadata
export const meta: MetaFunction = ({ data }: { data: any }) => {
  if (!data) {
    return [{ title: "Post Not Found" }];
  }
  return [
    { title: capitalizeFirstWord(data.post.heading) },
    { name: "description", content: data.post.heading },
  ];
};

// Loader function to fetch the post details
export const loader: LoaderFunction = async ({ params }) => {
  const { postId } = params;

  const supabase = getSupabase();
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (error || !post) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ post });
};

// Utility function to capitalize the first word
function capitalizeFirstWord(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Detail component
export default function NewDetail() {
  const { post } = useLoaderData();

  return (
    <div className="relative w-full min-h-screen bg-gray-200">
      <img
        src="/image (1).png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover filter blur-sm"
      />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 md:px-6 lg:px-8">
        <div className="w-full text-center space-y-6">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-white sm:text-5xl lg:text-5xl drop-shadow-lg p-4 bg-black/50 rounded-lg">
            {capitalizeFirstWord(post.heading)}
          </h1>
          <div className="flex justify-center">
            <img
              src={post.image_url}
              alt={post.heading}
              className="w-full max-w-3xl h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-gray-700 w-full text-left">
            <p className="text-xl leading-relaxed">
              <strong className="text-2xl">{post.heading}</strong>
            </p>
            <div
              className="text-lg"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
