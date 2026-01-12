import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getBaseUrl } from "@/baseURLS";

export default function EditProfile() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    bio: "",
    tel: "",
    email: "",
    profile_image: null,
  });
  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        const authRes = await axios.get(`${getBaseUrl()}/api/auth/check`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userId = authRes.data.user_id;

        const profileRes = await axios.get(
          `${getBaseUrl()}/api/profile/user/${userId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setForm(profileRes.data);
        setProfileId(profileRes.data.id);
        console.log(profileRes.data); // Profile data
        setUserId(authRes.data.user_id);
        setLoading(false);
      } catch (err) {
        console.error("Auth or profile fetch failed:", err);
        router.push("/login"); // Redirect if unauthorized
      }
    };

    if (token) {
      fetchUserAndProfile();
    } else {
      router.push("/login");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({ ...prev, profile_image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profileId) return alert("Profile not loaded.");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));

    try {
      await axios.put(
        `${getBaseUrl()}/api/profile/edit/${profileId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Profile updated!");
      router.push(`/profile/${userId}`);
    } catch (err) {
      console.error("Failed to update profile:", err.response?.data || err);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Full name"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Email"
        />
        <input
          name="tel"
          value={form.tel}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Phone"
        />
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Bio"
        />
        <input type="file" name="profile_image" onChange={handleImageChange} />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
}
