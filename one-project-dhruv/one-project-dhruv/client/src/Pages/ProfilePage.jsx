import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUser, FiEdit, FiBookOpen, FiCheckCircle, FiXCircle, FiSave, FiLoader } from "react-icons/fi";
import Sidebar from "../Layout/Sidebar";

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    username: "",
    role: "student",
    semester: "",
    branch: "None",
    section: "",
    avatar: "",
  });
  
  const [assignments, setAssignments] = useState({
    created: [],
    completed: [],
    uncompleted: [],
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/profile", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const data = await response.json();
        setUserData(data.user);

        if (data.user.role === "teacher") {
          const createdResponse = await fetch("http://localhost:3000/assignments/created", {
            method: "GET",
            credentials: "include",
          });
          if (!createdResponse.ok) throw new Error("Failed to fetch created assignments");
          const createdData = await createdResponse.json();
          setAssignments((prev) => ({ ...prev, created: createdData }));
        } else if (data.user.role === "student") {
          const completedResponse = await fetch("http://localhost:3000/assignments/completed", {
            method: "GET",
            credentials: "include",
          });
          const uncompletedResponse = await fetch("http://localhost:3000/assignments/uncompleted", {
            method: "GET",
            credentials: "include",
          });
          if (!completedResponse.ok || !uncompletedResponse.ok)
            throw new Error("Failed to fetch student assignments");
          const [completedData, uncompletedData] = await Promise.all([
            completedResponse.json(),
            uncompletedResponse.json(),
          ]);
          setAssignments((prev) => ({
            ...prev,
            completed: completedData,
            uncompleted: uncompletedData,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("http://localhost:3000/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });
      if (response.ok) {
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        setEditMode(false);
      } else {
        console.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <FiLoader className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 ml-64">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
            <button
              type="button"
              onClick={() => setEditMode(!editMode)}
              className="flex items-center rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
            >
              {editMode ? "Cancel" : <><FiEdit className="mr-2" /> Edit Profile</>}
            </button>
          </div>

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-md bg-green-50 p-4 text-green-700"
            >
              {successMessage}
            </motion.div>
          )}

          <div className="grid gap-8 md:grid-cols-3">
            {/* Profile Information */}
            <div className="md:col-span-2">
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-800">Profile Information</h2>
                </div>
                <div className="p-6">
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                          Username
                        </label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={userData.username}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                          Role
                        </label>
                        <select
                          id="role"
                          name="role"
                          value={userData.role}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
                          Branch
                        </label>
                        <select
                          id="branch"
                          name="branch"
                          value={userData.branch}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                        >
                          <option value="CSE">CSE</option>
                          <option value="ECE">ECE</option>
                          <option value="CHEM_ENG">CHEM_ENG</option>
                          <option value="PIE">PIE</option>
                          <option value="ME">ME</option>
                          <option value="EE">EE</option>
                          <option value="IT">IT</option>
                          <option value="None">None</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                          Semester
                        </label>
                        <input
                          type="text"
                          id="semester"
                          name="semester"
                          value={userData.semester}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="section" className="block text-sm font-medium text-gray-700">
                          Section
                        </label>
                        <input
                          type="text"
                          id="section"
                          name="section"
                          value={userData.section}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                        />
                      </div>
                    </div>

                    {editMode && (
                      <div className="mt-6 flex justify-end">
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
                        >
                          {saving ? (
                            <>
                              <FiLoader className="mr-2 animate-spin" /> Saving...
                            </>
                          ) : (
                            <>
                              <FiSave className="mr-2" /> Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>

            {/* Profile Avatar */}
            <div>
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-800">Profile Picture</h2>
                </div>
                <div className="flex flex-col items-center p-6">
                  <div className="mb-4 h-32 w-32 overflow-hidden rounded-full bg-gray-200">
                    {userData.avatar ? (
                      <img
                        src={userData.avatar || "/placeholder.svg"}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-500">
                        <FiUser size={64} />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold">{userData.username}</h3>
                  <p className="text-gray-500">{userData.role}</p>
                  <div className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {userData.branch !== "None" ? userData.branch : "No Branch"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assignments Section */}
          <div className="mt-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              {userData.role === "teacher" ? "Created Assignments" : "Your Assignments"}
            </h2>

            {userData.role === "teacher" ? (
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h3 className="flex items-center text-lg font-medium text-gray-800">
                    <FiBookOpen className="mr-2" /> Created Assignments
                  </h3>
                </div>
                <div className="p-6">
                  {assignments.created.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {assignments.created.map((assignment) => (
                        <li key={assignment._id} className="py-4">
                          <div className="flex items-center">
                            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                              <FiBookOpen />
                            </div>
                            <div>
                              <h4 className="font-medium">{assignment.title}</h4>
                              {assignment.description && (
                                <p className="text-sm text-gray-500">{assignment.description}</p>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No assignments created yet.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                <div className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                    <h3 className="flex items-center text-lg font-medium text-gray-800">
                      <FiXCircle className="mr-2 text-red-500" /> Uncompleted Assignments
                    </h3>
                  </div>
                  <div className="p-6">
                    {assignments.uncompleted.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {assignments.uncompleted.map((assignment) => (
                          <li key={assignment._id} className="py-4">
                            <div className="flex items-center">
                              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                                <FiXCircle />
                              </div>
                              <div>
                                <h4 className="font-medium">{assignment.title}</h4>
                                {assignment.description && (
                                  <p className="text-sm text-gray-500">{assignment.description}</p>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No uncompleted assignments.</p>
                    )}
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                    <h3 className="flex items-center text-lg font-medium text-gray-800">
                      <FiCheckCircle className="mr-2 text-green-500" /> Completed Assignments
                    </h3>
                  </div>
                  <div className="p-6">
                    {assignments.completed.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {assignments.completed.map((assignment) => (
                          <li key={assignment._id} className="py-4">
                            <div className="flex items-center">
                              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <FiCheckCircle />
                              </div>
                              <div>
                                <h4 className="font-medium">{assignment.title}</h4>
                                {assignment.description && (
                                  <p className="text-sm text-gray-500">{assignment.description}</p>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No completed assignments yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}