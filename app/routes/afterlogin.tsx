//import { useState } from "react";
import { json } from "@remix-run/node";
import { Form, useActionData, redirect } from "@remix-run/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { getSupabase } from "~/supabaseclient"; // Ensure to import your Supabase client function

// Action function to handle form submission
/*export const action = async ({ request }) => {
  const formData = await request.formData();
  const imageUrl = formData.get("image-url") as string;
  const heading = formData.get("heading") as string;
  const content = formData.get("content") as string;

  const supabase = getSupabase();

  // Insert the new data into Supabase
  const { error } = await supabase
    .from("admin_data")
    .insert([{ image_url: imageUrl, heading, content }]);

  if (error) {
    return json({ error: error.message }, { status: 400 });
  }

  return redirect("/afterlogin"); // Redirect to the same page after successful addition
};*/

export default function AfterLogin() {
  const actionData = useActionData();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{ backgroundImage: `url('/image (1).png')` }}
      />
      <div className="relative z-10 max-w-4xl w-full p-6 bg-white rounded-lg shadow-md">
        <Form method="post">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Add Content</CardTitle>
              <CardDescription className="text-lg">Fill out the fields below to add new content to your page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="image-url" className="text-lg">Image URL</Label>
                <Input id="image-url" name="image-url" placeholder="Enter image URL" className="w-full px-4 py-2 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-4">
                <Label htmlFor="heading" className="text-lg">Heading</Label>
                <Input id="heading" name="heading" placeholder="Enter heading" className="w-full px-4 py-2 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-4">
                <Label htmlFor="content" className="text-lg">Content</Label>
                <Textarea id="content" name="content" placeholder="Enter content" rows={5} className="w-full px-4 py-2 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" className="px-6 py-3 text-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Add Data</Button>
            </CardFooter>
          </Card>
        </Form>
        {actionData?.error && <p className="text-red-600 mt-4">{actionData.error}</p>}
      </div>
    </div>
  );
}
