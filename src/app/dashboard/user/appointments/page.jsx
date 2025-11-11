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














// "use client";

// import { useEffect, useState } from "react";
// import { useApp } from "@/context/AppContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// export default function AgentAppointments() {
//   const { token, user, BASE_URL } = useApp();
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingAppointment, setEditingAppointment] = useState(null);
//   const [formData, setFormData] = useState({
//     property_id: "",
//     user_id: "",
//     date: "",
//     msg: "",
//     time: { from: "", to: "" },
//   });

//   // Fetch appointments
//   const fetchAppointments = async () => {
//     if (!token || !user) return;
//     setLoading(true);
//     try {
//       const res = await axios.get(`${BASE_URL}/appointments`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { agent: user._id, page: 0, limit: 10 },
//       });
//       setAppointments(res.data?.data || []);
//     } catch (err) {
//       console.log(err);
//       toast.error("Failed to load appointments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAppointments();
//   }, [token, user]);

//   // Open modal for create or edit
//   const openModal = (appointment = null) => {
//     if (appointment) {
//       setEditingAppointment(appointment);
//       setFormData({
//         property_id: appointment.property_id,
//         user_id: appointment.user_id,
//         date: appointment.date,
//         msg: appointment.msg,
//         time: appointment.time || { from: "", to: "" },
//       });
//     } else {
//       setEditingAppointment(null);
//       setFormData({ property_id: "", user_id: "", date: "", msg: "", time: { from: "", to: "" } });
//     }
//     setModalOpen(true);
//   };

//   const closeModal = () => setModalOpen(false);

//   // Submit form (create or update)
//   const submitForm = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingAppointment) {
//         // Update
//         await axios.put(`${BASE_URL}/appointments/${editingAppointment._id}`, formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         toast.success("Appointment updated");
//       } else {
//         // Create
//         await axios.post(`${BASE_URL}/appointments`, formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         toast.success("Appointment created");
//       }
//       closeModal();
//       fetchAppointments();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to submit appointment");
//     }
//   };

//   // Actions
//   const confirmAppointment = async (id) => {
//     try {
//       await axios.put(`${BASE_URL}/appointments/${id}/confirm-meeting`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("Appointment confirmed");
//       fetchAppointments();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to confirm");
//     }
//   };

//   const completeAppointment = async (id) => {
//     try {
//       await axios.put(`${BASE_URL}/appointments/${id}/set-agent-appointment-completion`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("Appointment completed");
//       fetchAppointments();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to complete");
//     }
//   };

//   const deleteAppointment = async (id) => {
//     try {
//       await axios.delete(`${BASE_URL}/appointments/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("Appointment deleted");
//       fetchAppointments();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete");
//     }
//   };

//   return (
//     <div className="p-4 md:p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold">My Appointments</h1>
//         <button
//           onClick={() => openModal()}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
//         >
//           + New Appointment
//         </button>
//       </div>

//       {/* Appointment List */}
//       {loading ? (
//         <p className="text-gray-500">Loading appointments...</p>
//       ) : appointments.length === 0 ? (
//         <p className="text-gray-500">No appointments found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {appointments.map((appt) => (
//             <div key={appt._id} className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between">
//               <div>
//                 <h2 className="font-medium text-lg">{appt.user?.name || "Client"}</h2>
//                 <p className="text-gray-500 text-sm mt-1">{appt.msg}</p>
//               </div>

//               <div className="mt-2 text-gray-600 text-sm space-y-1">
//                 <p>
//                   <span className="font-semibold">Date:</span> {appt.date}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Time:</span> {appt.time?.from} - {appt.time?.to}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Status:</span>{" "}
//                   <span
//                     className={`px-2 py-1 rounded text-xs font-medium ${
//                       appt.completed
//                         ? "bg-green-200 text-green-800"
//                         : appt.confirmed
//                         ? "bg-blue-200 text-blue-800"
//                         : "bg-yellow-200 text-yellow-800"
//                     }`}
//                   >
//                     {appt.completed ? "Completed" : appt.confirmed ? "Confirmed" : "Pending"}
//                   </span>
//                 </p>
//               </div>

//               <div className="mt-4 flex gap-2 flex-wrap">
//                 {!appt.confirmed && (
//                   <button
//                     onClick={() => confirmAppointment(appt._id)}
//                     className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
//                   >
//                     Confirm
//                   </button>
//                 )}
//                 {!appt.completed && (
//                   <button
//                     onClick={() => completeAppointment(appt._id)}
//                     className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
//                   >
//                     Complete
//                   </button>
//                 )}
//                 <button
//                   onClick={() => openModal(appt)}
//                   className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => deleteAppointment(appt._id)}
//                   className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
//             <button
//               onClick={closeModal}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
//             >
//               ✕
//             </button>
//             <h2 className="text-xl font-semibold mb-4">
//               {editingAppointment ? "Edit Appointment" : "New Appointment"}
//             </h2>
//             <form onSubmit={submitForm} className="space-y-3">
//               <input
//                 type="text"
//                 placeholder="Property ID"
//                 value={formData.property_id}
//                 onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="User ID"
//                 value={formData.user_id}
//                 onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//               <input
//                 type="date"
//                 value={formData.date}
//                 onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Message"
//                 value={formData.msg}
//                 onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
//                 className="w-full p-2 border rounded"
//               />
//               <div className="flex gap-2">
//                 <input
//                   type="time"
//                   value={formData.time.from}
//                   onChange={(e) => setFormData({ ...formData, time: { ...formData.time, from: e.target.value } })}
//                   className="w-1/2 p-2 border rounded"
//                   required
//                 />
//                 <input
//                   type="time"
//                   value={formData.time.to}
//                   onChange={(e) => setFormData({ ...formData, time: { ...formData.time, to: e.target.value } })}
//                   className="w-1/2 p-2 border rounded"
//                   required
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
//               >
//                 {editingAppointment ? "Update" : "Create"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
