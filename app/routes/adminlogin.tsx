import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useNavigate } from "@remix-run/react";

export default function Component() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Login</CardTitle>
            <CardDescription className="text-lg">Enter your name and password to access your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Label htmlFor="name" className="text-lg">Name</Label>
              <Input id="name" placeholder="Enter your name" className="w-full px-4 py-2 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-4">
              <Label htmlFor="password" className="text-lg">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" className="w-full px-4 py-2 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="px-6 py-3 text-lg" onClick={handleGoBack}>Go Back</Button>
            <Button type="submit" className="px-6 py-3 text-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Sign In</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
