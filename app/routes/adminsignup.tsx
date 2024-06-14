import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { json,Form, useNavigate, redirect, useActionData, useLoaderData } from "@remix-run/react";
import { ActionFunction, ActionFunctionArgs, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";

import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { getSupabase } from "~/supabaseclient";
//import { createSupabaseServerClient } from "~/supabase.server";

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    //console.log("hello");
    const supabase = getSupabase();
  
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({ email, password });

    
    const { data1, error1 } = await supabase.from('info').insert([
    { email: "email", password: "password" },
    ]).select()
        
  
    if (error) {
        //console.log(error);
      if (error.message.includes("rate limit")) {
        return json(
          { error: "Email rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }
      return json({ error: error.message }, { status: 400 });
    }
    return redirect("/");
    return json({ success: true });
  };

/*export const loader=()=> {
    const env={
        SUPABASE_URL:process.env.SUPABASE_URL!,
        SUPABASE_ANON_KEY:process.env.SUPABASE_ANON_KEY!,

    };
    return {env};
}*/



export default function Component() {
  const actionData = useActionData<typeof action>();
  /*const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };*/
  /*const {env} = useLoaderData();
  const [supabase]= useState(()=>createClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!) );

  const signUp=()=>{
    supabase.auth.signUp({
        email:"sumit10kat@gmail.com",
        password:"ababab",
    })
  }*/

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-gray-200 rounded-lg shadow-md space-y-6">
        <Form method="post">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">SIGN UP</CardTitle>
            <CardDescription className="text-lg">Enter your name and password to access your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          {actionData?.error && (
                <div className="text-red-600">{actionData.error}</div>
              )}
            
            <div className="space-y-4">
              <Label htmlFor="name" className="text-lg">E-mail</Label>
              <Input id="name" name="email" placeholder="Enter your email" className="w-full px-4 py-2 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-4">
              <Label htmlFor="password" className="text-lg">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Enter your password" className="w-full px-4 py-2 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="px-6 py-3 text-lg">Go Back</Button>
            <Button type="submit" className="px-6 py-3 text-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Sign In</Button>
          </CardFooter>
        </Card>
        </Form>
        
      </div>
    </div>
  );
}
