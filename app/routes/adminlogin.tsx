// app/routes/adminlogin.tsx
import { json, Form, useNavigate, redirect, useActionData } from "@remix-run/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { getSupabase } from "~/supabaseclient";
import { ActionFunction } from "@remix-run/node";
import { Link } from "react-router-dom";




export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = getSupabase();
  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Sign In Error:", error.message); // Log the error
    return json({ error: error.message }, { status: 400 });
  }

  console.log("User signed in successfully:", user); // Log successful sign-in

  return redirect("/afterlogin"); // Redirect to the afterlogin page after successful login
};



export default function LoginComponent() {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-gray-200 rounded-lg shadow-md space-y-6">
        <Form method="post">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Login</CardTitle>
              <CardDescription className="text-lg">Enter your email and password to access your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {actionData?.error && (
                <div className="text-red-600">{actionData.error}</div>
              )}
              <div className="space-y-4">
                <Label htmlFor="email" className="text-lg">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Enter your email" className="w-full px-4 py-2 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-4">
                <Label htmlFor="password" className="text-lg">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Enter your password" className="w-full px-4 py-2 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link to="/"  className="px-6 py-3 text-lg" onClick={handleGoBack}>Go Back</Link>
              <Button type="submit" className="px-6 py-3 text-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Sign In</Button>
            </CardFooter>
          </Card>
        </Form>
      </div>
    </div>
  );
}
