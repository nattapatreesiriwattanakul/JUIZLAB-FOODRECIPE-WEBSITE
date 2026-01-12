import { useEffect, useState } from "react";
import axios from "axios";
import { getBaseUrl } from "@/baseURLS";
import Link from "next/link";

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios
      .get(`${getBaseUrl()}/api/recipes`) // Adjust to your backend URL
      .then((res) => setRecipes(res.data))
      .catch((err) => console.error("Failed to fetch recipes", err));
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-center my-6">All Recipes</h1>
        <p className="text-center mb-4">
          Explore our collection of delicious recipes!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {recipes.map((recipe) => (
          <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
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
    </div>
  );
};

export default AllRecipes;
