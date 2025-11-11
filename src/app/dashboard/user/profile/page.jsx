"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "react-toastify";
import Image from "next/image";

export default function UserProfile() {
  const { userToken, merchantToken, user, BASE_URL } = useApp();
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(false);
  // console.log("merchant Token:", merchantToken);

  if (!userData || !userToken || !merchantToken) {
    return (
      <div className="p-8 text-center text-gray-500">
        No user information found. Please log in again.
      </div>
    );
  }

  //Fetch the logged-in user's details
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true);
        let foundUser = null;
        let page = 0;
        const limit = 5;
        let morePages = true;

        while (morePages && !foundUser) {
          const res = await fetch(
            `${BASE_URL}/users?offset=${page * limit}&limit=${limit}`,
            {
              headers: { Authorization: `Bearer ${merchantToken}` },
            }
          );

          const data = await res.json();
          console.log("🧩 Users Response:", data);

          if (!res.ok) throw new Error(data?.msg || "Failed to fetch users");

          // Find current user in the list
          foundUser = data?.data?.find(
            (u) => u.id === userData.id || u._id === userData._id
          );
        }

        if (!foundUser) throw new Error("User not found");

        setUserData(foundUser);
        console.log("Found User:", foundUser);
      } catch (err) {
        console.log(err);
        toast.error(err.message || "Failed to load user info");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [userToken, BASE_URL]);

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);

      const res = await fetch(`${BASE_URL}/users/${userData.id}/resource`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${userToken}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.msg || "Failed to upload avatar");

      // Update avatar in state
      setUserData((prev) => ({ ...prev, avatar: data.avatar }));
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-center sm:text-left">
        User Profile
      </h1>

      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <Image
              src={userData.avatar || "/default-avatar2.jpg"}
              alt="User Avatar"
              width={100}
              height={100}
              className="rounded-full object-cover border w-24 h-24 sm:w-32 sm:h-32"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
            >
              📷
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold">
              {userData.first_name || userData.last_name
                ? `${userData.first_name || ""} ${
                    userData.last_name || ""
                  }`.trim()
                : "User Name"}
            </h2>
            <p className="text-gray-500">{userData.email}</p>
            <p className="text-gray-400 text-sm">{userData.phone || "—"}</p>
            <p className="mt-2 inline-block px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
              User Role: {userData.role || "USER"}
            </p>
          </div>
        </div>

        {uploading && (
          <p className="text-blue-600 text-sm mt-3">Uploading image...</p>
        )}

        <div className="mt-6 space-y-3 text-gray-700">
          <p>
            <strong>Full Name:</strong>{" "}
            {userData.first_name || userData.last_name
              ? `${userData.first_name || ""} ${
                  userData.last_name || ""
                }`.trim()
              : "Not provided"}
          </p>
          <p>
            <strong>User ID:</strong> {userData.id || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
