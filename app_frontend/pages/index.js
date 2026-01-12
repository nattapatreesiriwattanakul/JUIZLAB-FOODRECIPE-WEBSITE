import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { getBaseUrl } from "@/baseURLS";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get(`${getBaseUrl()}/api/recipes`) // Adjust to your backend URL
      .then((res) => setRecipes(res.data))
      .catch((err) => console.error("Failed to fetch recipes", err));
  }, []);

  // useEffect(() => {
  //   axios
  //     .get(`${getBaseUrl()}/api/tutorial`) // Adjust to your backend URL
  //     .then((res) => setRecipes(res.data))
  //     .catch((err) => console.error("Failed to fetch recipes", err));
  // }, []);

  useEffect(() => {
    axios
      .get(`${getBaseUrl()}/api/blogs`) // Adjust to your backend URL
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error("Failed to fetch recipes", err));
  }, []);

  return (
    <main className="flex flex-col items-center min-h-screen bg-[#FAF9F6] text-gray-800 px-4">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20">
        <h1 className="text-4xl font-bold mb-6 text-[#6B8E23]">
          The Juiz Lab!
        </h1>
        <p className="text-lg mb-8 max-w-xl">
          Discover recipes, learn new cooking techniques, and connect with a
          community of food lovers.
        </p>
        <div className="flex space-x-4">
          <Link
            href="/recipe"
            className="px-6 py-3 bg-[#6B8E23] text-white rounded hover:bg-[#557A1F] transition"
          >
            Explore Recipes
          </Link>
          <Link
            href="/community"
            className="px-6 py-3 bg-[#E07B50] text-white rounded hover:bg-[#C0653E] transition"
          >
            Join Community
          </Link>
        </div>
      </section>

      {/* Popular Recipes Section */}
      <section className="w-full max-w-5xl py-12">
        <h2 className="text-2xl font-bold mb-6">Popular Recipes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Example recipe card */}
          {recipes.map((recipe) => (
            <Link key={recipe.id} href={`/recipe/${recipe.id}`}>
              <div className="bg-white p-4 rounded shadow hover:shadow-md transition cursor-pointer">
                {recipe.image ? (
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="h-40 w-full object-cover rounded mb-4"
                  />
                ) : (
                  <div className="h-40 bg-gray-200 rounded mb-4" />
                )}
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {recipe.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Community Blogs Section */}
      <section className="w-full max-w-5xl py-12">
        <h2 className="text-2xl font-bold mb-6">From the Community</h2>
        <div className="space-y-4">
          {/* Example blog preview */}
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/community/blog/${blog.id}`}
              className="block p-4 bg-white rounded shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-[#6B8E23]">
                {blog.title}
              </h3>
              <p className="text-sm text-gray-600">
                A quick teaser or summary from the blog post content.
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
