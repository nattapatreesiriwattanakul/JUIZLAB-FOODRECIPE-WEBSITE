import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { getBaseUrl } from "@/baseURLS";

const Community = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get(`${getBaseUrl()}/api/blogs`) // Adjust to your backend URL
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error("Failed to fetch recipes", err));
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link
          href="community/blog/add"
          className="px-4 py-2 bg-[#6B8E23] text-white rounded hover:bg-[#557A1F] transition"
        >
          + Create New Blog
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-4">Community Stories</h2>
      <ul className="space-y-2">
        {blogs.map((blog) => (
          <li key={blog.id} className="border-b pb-4">
            <Link
              href={`/community/blog/${blog.id}`}
              className="block p-4 bg-white rounded shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-[#6B8E23]">
                {blog.title}
              </h3>
              <p className="text-sm text-gray-600">{blog.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Community;
