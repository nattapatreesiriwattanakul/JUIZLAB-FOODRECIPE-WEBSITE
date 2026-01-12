import { useEffect, useState } from "react";
import axios from "axios";
import { getBaseUrl } from "@/baseURLS";
import Link from "next/link";

const tutorial = () => {
  const [tutorials, setTutorials] = useState([]);

  useEffect(() => {
    axios
      .get(`${getBaseUrl()}/api/tutorials`) // Adjust to your backend URL
      .then((res) => setTutorials(res.data))
      .catch((err) => console.error("Failed to fetch recipes", err));
  }, []);
  if (!tutorials) return <p className="p-6">Loading...</p>;
  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Link
          href="tutorial/add"
          className="px-4 py-2 bg-[#6B8E23] text-white rounded hover:bg-[#557A1F] transition"
        >
          + Add Totorial
        </Link>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recommended Tutorials</h2>
          <Link
            href="tutorial/all"
            className="text-[#6B8E23] hover:underline text-sm"
          >
            View All →
          </Link>
        </div>
        {/* Carousel placeholder */}
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {/* Map recommended tutorials here */}
          {tutorials.map((tutorial) => (
            <div key={tutorial.id} className="relative">
              <Link href={`/tutorial/${tutorial.id}`}>
                <div className="bg-white p-4 rounded shadow hover:shadow-md transition cursor-pointer">
                  <div className="h-40 bg-gray-200 rounded mb-4 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {tutorial.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {tutorial.description}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default tutorial;
