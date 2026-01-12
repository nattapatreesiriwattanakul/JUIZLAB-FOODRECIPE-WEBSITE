import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { getBaseUrl, getMediaUrl } from "@/baseURLS";
import Link from "next/link";

const RecipeDetail = () => {
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    const { id } = router.query;

    if (id) {
      setLoading(true);
      const recipeId = parseInt(id, 10);

      const fetchRecipe = async () => {
        try {
          const token = localStorage.getItem("access_token");
          const response = await axios.get(
            `${getBaseUrl()}/api/recipes/${recipeId}/`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          );

          setRecipe(response.data);
          // Check if the logged-in user is the recipe owner
          if (user && response.data.created_by === user.user_id) {
            setIsOwner(true);
          }
          setError(null);
        } catch (err) {
          console.error("Failed to load recipe", err);
          setError("Failed to load recipe. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchRecipe();
    }
  }, [router.isReady, router.query, user]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`${getBaseUrl()}/api/delete/recipe/${recipe.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Recipe deleted successfully");
      router.push("/recipe");
    } catch (err) {
      console.error("Failed to delete recipe:", err);
      alert("Failed to delete recipe. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading recipe...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );

  if (!recipe)
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <p>Recipe not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">{recipe.title}</h1>
        {isOwner && (
          <div className="space-x-2">
            <Link
              href={`/recipe/${recipe.id}/edit`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}

      <p className="text-gray-700 whitespace-pre-wrap">{recipe.description}</p>
    </div>
  );
};

export default RecipeDetail;
