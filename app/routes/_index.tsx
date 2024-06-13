import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Vh6S5x88xAt
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import {Link} from "@remix-run/react"

export default function Component() {
  return (
    <div className="relative w-full h-screen">
      <img
        src="images\image (1).png"
        alt="Blog"
        className="absolute inset-0 w-full h-full object-cover filter blur-sm"
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl w-full space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-50 sm:text-5xl lg:text-6xl">
            Discover the Best Blog Content
          </h1>
          <p className="text-lg text-gray-200 sm:text-xl">
            Search through our vast library of blog posts to find the content you looking for.
          </p>
          <div className="w-full  items-center justify-center">
            <form className="relative">
              <Input
                type="search"
                placeholder="Search blog posts..."
                className="w-full rounded-full bg-white/90 px-6 py-4 text-gray-900 focus:bg-white focus:outline-none"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-900 px-6 py-2 text-white hover:bg-gray-800 focus:outline-none"
              >
                Search
              </Button>
            </form>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <Link
            to="/adminlogin"
            className="inline-flex items-center rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none"
            prefetch="none"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  )
}