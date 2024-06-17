// afterlogin.tsx

import { json, Form, useActionData, redirect } from "@remix-run/react";
import { getSupabase } from "~/supabaseclient";
import { useNavigate } from "react-router-dom";
import { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const imageUrl = formData.get("image-url") as string;
  const heading = formData.get("heading") as string;
  const content = formData.get("content") as string;

  console.log("Form Data:", { imageUrl, heading, content }); // Debug log

  const supabase = getSupabase();
  const { error } = await supabase.from("posts").insert([
    { image_url: imageUrl, heading, content }
  ]);

  if (error) {
    console.error("Supabase Insert Error:", error.message);
    return json({ error: error.message }, { status: 500 });
  }

  console.log("Data successfully inserted");
  return redirect("/"); // Redirect to the home page or another page after successful submission
};

export default function AfterLogin() {
  const actionData = useActionData();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error.message);
    } else {
      navigate("/"); // Redirect to the home page upon successful sign-out
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 relative">
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{ backgroundImage: `url('/image (1).png')` }}
      />
      <button
        type="button"
        onClick={handleSignOut}
        className="absolute top-4 right-4 px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded z-20"
      >
        Sign Out
      </button>
      <div className="relative z-10 max-w-4xl w-full p-6 mx-auto">
        <Form method="post">
          <div className="space-y-6">
            <div className="space-y-4">
              <label htmlFor="image-url" className="text-lg">Image URL</label>
              <input id="image-url" name="image-url" placeholder="Enter image URL" className="w-full px-4 py-2 text-lg bg-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-4">
              <label htmlFor="heading" className="text-lg">Heading</label>
              <input id="heading" name="heading" placeholder="Enter heading" className="w-full px-4 py-2 text-lg bg-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-4">
              <label htmlFor="content" className="text-lg">Content</label>
              <textarea id="content" name="content" placeholder="Enter content" rows={5} className="w-full px-4 py-2 text-lg bg-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-6 py-3 text-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Add Data</button>
          </div>
        </Form>
        {actionData?.error && <p className="text-red-600 mt-4">{actionData.error}</p>}
      </div>
    </div>
  );
}
