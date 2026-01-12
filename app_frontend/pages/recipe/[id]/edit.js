import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { getBaseUrl } from "@/baseURLS";

const EditRecipe = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  // Check authentication and load recipe data
  useEffect(() => {
    const checkAuthAndLoadRecipe = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          router.push(`/login?redirect=/recipe/${id}/edit`);
          return;
        }

        // Check authentication
        const authResponse = await axios.get(`${getBaseUrl()}/api/auth/check`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!authResponse.data.authenticated) {
          router.push(`/login?redirect=/recipe/${id}/edit`);
          return;
        }

        setIsAuthenticated(true);
        setUserData(authResponse.data);

        // Load recipe data
        const recipeResponse = await axios.get(
          `${getBaseUrl()}/api/recipes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const recipe = recipeResponse.data;

        // Check if user is the owner
        if (recipe.created_by !== authResponse.data.user_id) {
          alert("You don't have permission to edit this recipe");
          router.push(`/recipe/${id}`);
          return;
        }

        setTitle(recipe.title);
        setDescription(recipe.description);
        setCurrentImage(recipe.image);
      } catch (error) {
        console.error("Error:", error);
        if (error.response?.status === 401) {
          router.push(`/login?redirect=/recipe/${id}/edit`);
        } else {
          alert("Error loading recipe data");
          router.push(`/recipe/${id}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      checkAuthAndLoadRecipe();
    }
  }, [id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("You must be logged in to edit a recipe");
      router.push(`/login?redirect=/recipe/${id}/edit`);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");

      const response = await axios.put(
        `${getBaseUrl()}/api/edit/recipe/${id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Recipe updated successfully");
      router.push(`/recipe/${id}`);
    } catch (err) {
      console.error("Error details:", err);

      if (err.response?.status === 401) {
        alert("Your session has expired. Please login again.");
        router.push(`/login?redirect=/recipe/${id}/edit`);
      } else {
        const errorMessage =
          err.response?.data?.error ||
          "An error occurred while updating the recipe";
        alert(`Error updating recipe: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto mt-10 flex justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Edit Recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full border px-4 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full border px-4 py-2 rounded"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image
          </label>
          {currentImage && (
            <div className="mt-2">
              <img
                src={currentImage}
                alt="Current recipe"
                className="w-32 h-32 object-cover rounded"
              />
              <p className="text-sm text-gray-500 mt-1">Current image</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="mt-2 w-full"
          />
          <p className="text-sm text-gray-500 mt-1">
            Leave empty to keep current image
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/recipe/${id}`)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipe;
