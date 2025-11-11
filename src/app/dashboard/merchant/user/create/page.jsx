"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaUserPlus } from "react-icons/fa";
import Link from "next/link";

export default function CreateUser() {
  const { merchantoken, BASE_URL } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!merchantoken) {
      toast.error("Please login first!");
      return;
    }

    if (
      !form.first_name ||
      !form.last_name ||
      !form.email ||
      !form.phone ||
      !form.password
    ) {
      toast.error(
        "All form fields are required!"
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${merchantoken}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.msg || "Failed to create user");

      toast.success("User created successfully!");
      console.log("Created User:", data);
      router.push("/dashboard/merchant/user");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FaUserPlus className="text-blue-600" /> Create User
        </h1>
        <Link
          href="/dashboard/merchant/agents"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back
        </Link>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              placeholder="Enter first name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              placeholder="Enter last name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              placeholder="Enter phone number"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              placeholder="Enter password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full cursor-pointer bg-blue-950 text-white py-2 rounded-md hover:bg-blue-900 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <LiaSpinnerSolid className="animate-spin text-lg" /> Creating...
            </>
          ) : (
            <>Create User</>
          )}
        </button>
      </form>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { useApp } from "@/context/AppContext";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";
// import { FaArrowLeft, FaUserPlus } from "react-icons/fa";
// import Link from "next/link";

// export default function CreateUser() {
//   const { token, BASE_URL, user } = useApp();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     phone: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!token) {
//       toast.error("Please login first!");
//       return;
//     }

//     if (!form.first_name || !form.last_name || !form.email || !form.phone || !form.password) {
//       toast.error("All fields are required!");
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload = {
//         ...form,
//         merchant: user?.merchant || null,
//         agent: user?.agent?._id || null,
//       };

//       const res = await fetch(`${BASE_URL}/users`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data?.msg || "Failed to create user");

//       toast.success("User created successfully!");
//       console.log("Created User:", data);
//       router.push("/dashboard/merchant/user");
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
//           <FaUserPlus className="text-blue-600" /> Create User
//         </h1>
//         <Link
//           href="/dashboard/merchant/agents"
//           className="flex items-center text-blue-600 hover:text-blue-800"
//         >
//           <FaArrowLeft className="mr-2" /> Back
//         </Link>
//       </div>

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">First Name</label>
//             <input
//               type="text"
//               name="first_name"
//               value={form.first_name}
//               onChange={handleChange}
//               className="w-full border rounded-md p-2"
//               placeholder="Enter first name"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Last Name</label>
//             <input
//               type="text"
//               name="last_name"
//               value={form.last_name}
//               onChange={handleChange}
//               className="w-full border rounded-md p-2"
//               placeholder="Enter last name"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               className="w-full border rounded-md p-2"
//               placeholder="Enter email address"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Phone</label>
//             <input
//               type="text"
//               name="phone"
//               value={form.phone}
//               onChange={handleChange}
//               className="w-full border rounded-md p-2"
//               placeholder="Enter phone number"
//             />
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium mb-1">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               className="w-full border rounded-md p-2"
//               placeholder="Enter password"
//               required
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="mt-6 w-full cursor-pointer bg-purple-950 text-white py-2 rounded-md hover:bg-purple-900 disabled:opacity-70 flex items-center justify-center gap-2"
//         >
//           {loading ? "Creating..." : <> <FaUserPlus /> Create User </>}
//         </button>
//       </form>
//     </div>
//   );
// }
