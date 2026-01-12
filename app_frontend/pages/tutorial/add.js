import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { getBaseUrl } from "@/baseURLS";

const AddTutorial = () => {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          router.push("/login?redirect=/tutorial/add");
          return;
        }

        const response = await axios.get(`${getBaseUrl()}/api/auth/check`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.push("/login?redirect=/tutorial/add");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        router.push("/login?redirect=/tutorial/add");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("You must be logged in to add a tutorial.");
      router.push("/login?redirect=/tutorial/add");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");

      console.log("Submitting tutorial data:", {
        title,
        video_url: videoUrl,
        description,
      });

      const response = await axios.post(
        `${getBaseUrl()}/api/tutorials/add`,
        {
          title,
          video_url: videoUrl,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Success response:", response.data);
      alert("Tutorial added successfully");
      router.push("/tutorial");
    } catch (err) {
      console.error("Error details:");
      console.error("Status:", err.response?.status);
      console.error("Data:", JSON.stringify(err.response?.data, null, 2));

      if (err.response?.status === 401) {
        alert("Your session has expired. Please login again.");
        router.push("/login?redirect=/tutorial/add");
      } else {
        const errorMessage =
          typeof err.response?.data === "object"
            ? JSON.stringify(err.response?.data, null, 2)
            : err.response?.data ||
              "An error occurred while adding the tutorial";
        alert(`Error adding tutorial:\n${errorMessage}`);
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
      <h1 className="text-2xl font-bold mb-4">Add New Tutorial</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="url"
          placeholder="Video URL (YouTube, etc.)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          rows={4}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddTutorial;
