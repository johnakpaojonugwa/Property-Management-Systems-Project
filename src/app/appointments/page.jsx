"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function AgentAppointments() {
  const { userToken, user, agent, agentToken, merchant, BASE_URL } = useApp();
  const [properties, setProperties] = useState([]);
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    property_id: "",
    user_id: user?._id || "",
    date: "",
    msg: "",
    from: "",
    to: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userToken || !user) return;
    const agentId = agent.profile?._id || agent.id;
    const merchantId = merchant.profile?.merchant_id || merchant.id;

    console.log("Fetching with agent:", agentId, "merchant:", merchantId);

    const fetchData = async () => {
      try {
        const [propRes, usersRes] = await Promise.all([
          axios.get(
            `${BASE_URL}/properties?agent=${agentId}&verified=true&merchant=${merchantId}`,
            {
              headers: { Authorization: `Bearer ${agentToken}` },
            }
          ),
          axios.get(`${BASE_URL}/users?limit=50&page=0`, {
            headers: { Authorization: `Bearer ${userToken}` },
          }),
        ]);

        setProperties(propRes.data?.data || []);
        setClients(usersRes.data?.data || []);
        console.log(
          "Fetched properties and users",
          propRes.data?.data,
          usersRes.data?.data
        );
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch properties or users");
      }
    };

    fetchData();
  }, [userToken, agentToken, agent, user]);

  useEffect(() => {
    if (!userToken || !user) return;

    const agentId = user.profile?._id || user.id;
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/appointments?agent=${agentId}&completed=false&page=0&limit=10`,
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        setAppointments(res.data?.data || []);
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch appointments");
      }
    };

    fetchAppointments();
  }, [userToken, user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();

    if (
      !form.property_id ||
      !form.user_id ||
      !form.date ||
      !form.timeFrom ||
      !form.timeTo
    ) {
      return toast.error("Please fill in all required fields");
    }

    setLoading(true);
    try {
      const body = {
        property_id: form.property_id,
        user_id: form.user_id,
        date: form.date,
        msg: form.msg,
        time: { from: form.timeFrom, to: form.timeTo },
      };
      console.log("sending payload", body);

      const res = await axios.post(`${BASE_URL}/appointments`, body, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      toast.success("Appointment created!");
      setForm({
        property_id: "",
        user_id: "",
        date: "",
        timeFrom: "",
        timeTo: "",
        msg: "",
      });
      setAppointments((prev) => [...prev, res.data?.data]);
      console.log("body payload", res);
    } catch (err) {
      console.log(err);
      toast.error("Failed to create appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await axios.delete(`${BASE_URL}/appointments/${id}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      toast.success("Appointment deleted");
      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete appointment");
    }
  };

  const handleConfirm = async (id) => {
    try {
      await axios.put(
        `${BASE_URL}/appointments/${id}/confirm-meeting`,
        {},
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      toast.success("Appointment confirmed");
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, confirmed: true } : a))
      );
    } catch (err) {
      console.log(err);
      toast.error("Failed to confirm appointment");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-semibold text-center text-gray-800">
        Appointments
      </h2>

      {/* Appointment Form */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-8 rounded-2xl shadow-md space-y-6 border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
          Book Appointment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Property
            </label>
            <select
              name="property_id"
              value={form.property_id}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
              <option value="">Select a property</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Client
            </label>
            <select
              name="user_id"
              value={form.user_id}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
              <option value="">Select a client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.first_name} {c.last_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Time From
              </label>
              <input
                type="time"
                name="timeFrom"
                value={form.timeFrom}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Time To
              </label>
              <input
                type="time"
                name="timeTo"
                value={form.timeTo}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Message (optional)
            </label>
            <textarea
              name="msg"
              value={form.msg}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-xl transition disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Appointment"}
          </button>
        </div>
      </form>
    </div>
  );
}


