import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { getBaseUrl } from "@/baseURLS";

const TutorialDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [tutorial, setTutorial] = useState(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`${getBaseUrl()}/api/tutorials/${id}/`)
        .then((res) => setTutorial(res.data))
        .catch((err) => console.error("Failed to load tutorial", err));
    }
  }, [id]);

  if (!tutorial) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{tutorial.title}</h1>
      {tutorial.image && (
        <img
          src={tutorial.image}
          alt={tutorial.title}
          className="mb-4 w-full rounded"
        />
      )}
      <p className="text-gray-700 whitespace-pre-line">
        {tutorial.description}
      </p>
    </div>
  );
};
export default TutorialDetail;
