"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "@/context/AppContext";
import { toast } from "react-toastify";
import AppointmentSkeleton from "@/components/AppointmentLoader";

export default function UserAppointments() {
  const { BASE_URL, userToken, user, agentToken, agent } = useApp();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Getting all agent appointments
  useEffect(() => {
    if (!agentToken || !agent) return;

    const agentId = agent.profile?._id || agent.id;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/appointments?agent=${agentId}&completed=false&page=0&limit=10`,
          { headers: { Authorization: `Bearer ${agentToken}` } }
        );
        setAppointments(res.data?.data || []);
        console.log("appt data:", res.data?.data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [agentToken, agent, BASE_URL]);

  // Mark appointment as completed
  const handleComplete = async (appointment_id) => {
    try {
      setLoading(true);
      await axios.put(
        `${BASE_URL}/appointments/${appointment_id}/set-user-appointment-completion`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      toast.success("Appointment marked as completed!");
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointment_id ? { ...a, status: "Completed" } : a
        )
      );
    } catch (err) {
      console.log(err);
      toast.error("Could not complete appointment");
    } finally {
      setLoading(false);
    }
  };

  // Delete appointment
  const handleDelete = async (appointment_id) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;

    try {
      await axios.delete(`${BASE_URL}/appointments/${appointment_id}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      toast.success("Appointment deleted!");
      setAppointments((prev) =>
        prev.filter((a) => a.id !== appointment_id)
      );
    } catch (err) {
      console.error(err);
      toast.error("Could not delete appointment");
    }
  };

  if (loading)
    return (
      <AppointmentSkeleton />
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Appointments</h2>

      {appointments.length === 0 ? (
        <p className="text-gray-500">You have not made any appointments yet.</p>
      ) : (
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-gray-100">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-6 py-3 font-medium text-left">Property</th>
                <th className="px-6 py-3 font-medium text-left">Date</th>
                <th className="px-6 py-3 font-medium text-left">Time</th>
                <th className="px-6 py-3 font-medium text-left">Client ID</th>
                <th className="px-6 py-3 font-medium text-left">Status</th>
                <th className="px-6 py-3 font-medium text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr
                  key={a.id}
                  className="border-t hover:bg-gray-50 transition-all"
                >
                  <td className="px-4 py-3">{a.property?.name || "N/A"}</td>
                  <td className="px-4 py-3">{a.date || "—"}</td>
                  <td className="px-4 py-3">
                    {a.time?.from && a.time?.to
                      ? `${a.time.from} - ${a.time.to}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                    {a.user.id || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        a.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {a.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    {a.status !== "Completed" && (
                      <button
                        onClick={() => handleComplete(a.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


