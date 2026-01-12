import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { getBaseUrl } from "@/baseURLS";

const BlogDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [blog, setBlog] = useState(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`${getBaseUrl()}/api/blogs/${id}/`)
        .then((res) => setBlog(res.data))
        .catch((err) => console.error("Failed to load blog", err));
    }
  }, [id]);

  if (!blog) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

      <p className="text-gray-700 whitespace-pre-line">{blog.content}</p>
    </div>
  );
};
export default BlogDetailPage;
