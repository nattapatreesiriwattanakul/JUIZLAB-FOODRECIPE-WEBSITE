import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { getBaseUrl } from "@/baseURLS";

const Recipe = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios
      .get(`${getBaseUrl()}/api/recipes`) // Adjust to your backend URL
      .then((res) => setRecipes(res.data))
      .catch((err) => console.error("Failed to fetch recipes", err));
  }, []);
  if (!recipes) return <p className="p-6">Loading...</p>;

  return (
    <div className="space-y-8">
      {/* Add Recipe button at the top */}
      <div className="flex justify-end">
        <Link
          href="recipe/add"
          className="px-4 py-2 bg-[#6B8E23] text-white rounded hover:bg-[#557A1F] transition"
        >
          + Add Recipe
        </Link>
      </div>

      {/* Today's Recipe */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Today's Recipe</h2>
          <Link
            href="recipe/all"
            className="text-[#6B8E23] hover:underline text-sm"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
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

      {/* Popular Recipes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Popular Recipes</h2>
          <Link
            href="recipe/all"
            className="text-[#6B8E23] hover:underline text-sm"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
          {" "}
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
    </div>
  );
};

export default Recipe;
