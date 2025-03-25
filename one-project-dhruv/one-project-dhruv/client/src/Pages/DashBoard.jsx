"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale } from "chart.js"
import Sidebar from "../Layout/Sidebar"
import {
  FiUser,
  FiBookOpen,
  FiCheckCircle,
  FiXCircle,
  FiFolder,
  FiPlus,
  FiAward,
  FiStar,
  FiTrendingUp,
  FiZap,
  FiShield,
  FiClock,
  FiGift,
  FiTarget,
} from "react-icons/fi"
import { IoTrophy } from "react-icons/io5"

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale)

const Dashboard = () => {
  const [userData, setUserData] = useState({
    username: "",
    role: "student",
    section: "",
    semester: "",
    branch: "",
    avatar: "",
    aura_points: 0,
    credit_points: 0,
  })

  const [assignments, setAssignments] = useState({
    created: [],
    completed: [],
    uncompleted: [],
  })

  const [projects, setProjects] = useState({
    created: [],
    completed: [],
    uncompleted: [],
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/profile", {
          method: "GET",
          credentials: "include",
        })
        if (!response.ok) throw new Error("Failed to fetch user profile")
        const data = await response.json()

        // Add sample data for demo purposes - replace with actual API data
        const enhancedUserData = {
          ...data.user,
          // credit_points: credit_points,
          // aura_points: aura_points,
        }

        setUserData(enhancedUserData)

        if (data.user.role === "teacher") {
          const [createdAssignmentsResponse, createdProjectsResponse] = await Promise.all([
            fetch("http://localhost:3000/assignments/created", {
              method: "GET",
              credentials: "include",
            }),
            fetch("http://localhost:3000/projects/created", {
              method: "GET",
              credentials: "include",
            }),
          ])

          if (!createdAssignmentsResponse.ok || !createdProjectsResponse.ok)
            throw new Error("Failed to fetch teacher data")

          const [createdAssignmentsData, createdProjectsData] = await Promise.all([
            createdAssignmentsResponse.json(),
            createdProjectsResponse.json(),
          ])

          setAssignments((prev) => ({ ...prev, created: createdAssignmentsData }))
          setProjects((prev) => ({ ...prev, created: createdProjectsData.projects }))
        } else if (data.user.role === "student") {
          const [completedResponse, uncompletedResponse, completedProjectsResponse, uncompletedProjectsResponse] =
            await Promise.all([
              fetch("http://localhost:3000/assignments/completed", { method: "GET", credentials: "include" }),
              fetch("http://localhost:3000/assignments/uncompleted", { method: "GET", credentials: "include" }),
              fetch("http://localhost:3000/projects/completed", { method: "GET", credentials: "include" }),
              fetch("http://localhost:3000/projects/uncompleted", { method: "GET", credentials: "include" }),
            ])

          if (
            !completedResponse.ok ||
            !uncompletedResponse.ok ||
            !completedProjectsResponse.ok ||
            !uncompletedProjectsResponse.ok
          )
            throw new Error("Failed to fetch student data")

          const [completedData, uncompletedData, completedProjectsData, uncompletedProjectsData] = await Promise.all([
            completedResponse.json(),
            uncompletedResponse.json(),
            completedProjectsResponse.json(),
            uncompletedProjectsResponse.json(),
          ])

          setAssignments((prev) => ({
            ...prev,
            completed: completedData,
            uncompleted: uncompletedData,
          }))

          setProjects({
            completed: completedProjectsData.completedProjects,
            uncompleted: uncompletedProjectsData.uncompletedProjects,
          })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Determine badge based on total points
  const getBadgeInfo = () => {
    const totalPoints = userData.aura_points + userData.credit_points

    if (totalPoints >= 100) {
      return {
        name: "Advanced",
        icon: "FiAward",
        color: "#9C27B0",
        description: "Mastered advanced coding techniques",
      }
    } else if (totalPoints >= 50) {
      return {
        name: "Intermediate",
        icon: "FiTrendingUp",
        color: "#2196F3",
        description: "Solved complex problems efficiently",
      }
    } else if (totalPoints >= 20) {
      return {
        name: "Novice",
        icon: "FiStar",
        color: "#4CAF50",
        description: "Collaborated on 3 group projects",
      }
    } else {
      return {
        name: "Rookie",
        icon: "FiZap",
        color: "#FFD700",
        description: "Completed 5 assignments in record time",
      }
    }
  }

  // Prepare chart data for assignments
  const assignmentChartData = {
    labels: ["Completed", "Uncompleted"],
    datasets: [
      {
        data: [assignments.completed.length, assignments.uncompleted.length],
        backgroundColor: ["rgba(74, 222, 128, 0.8)", "rgba(248, 113, 113, 0.8)"],
        borderColor: ["rgba(22, 163, 74, 1)", "rgba(220, 38, 38, 1)"],
        borderWidth: 2,
      },
    ],
  }

  // Prepare chart data for projects
  const projectChartData = {
    labels: ["Completed", "Uncompleted"],
    datasets: [
      {
        data: [projects.completed.length, projects.uncompleted.length],
        backgroundColor: ["rgba(96, 165, 250, 0.8)", "rgba(251, 191, 36, 0.8)"],
        borderColor: ["rgba(37, 99, 235, 1)", "rgba(217, 119, 6, 1)"],
        borderWidth: 2,
      },
    ],
  }

  // Prepare chart data for points
  const pointsChartData = {
    labels: ["Credit Points", "Aura Points"],
    datasets: [
      {
        data: [userData.credit_points, userData.aura_points],
        backgroundColor: ["rgba(139, 92, 246, 0.8)", "rgba(14, 165, 233, 0.8)"],
        borderColor: ["rgba(109, 40, 217, 1)", "rgba(3, 105, 161, 1)"],
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 12,
            family: "'Poppins', sans-serif",
          },
          color: "#4B5563",
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.8)",
        titleFont: {
          size: 14,
          family: "'Poppins', sans-serif",
          weight: "bold",
        },
        bodyFont: {
          size: 12,
          family: "'Poppins', sans-serif",
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    cutout: "70%",
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1000,
    },
  }

  // Badge component
  const Badge = ({ badge, index }) => {
    const badgeIcons = {
      FiZap: FiZap,
      FiStar: FiStar,
      FiAward: FiAward,
      FiShield: FiShield,
      FiTrendingUp: FiTrendingUp,
      FiTrophy: IoTrophy,
      FiTarget: FiTarget,
      FiGift: FiGift,
    }

    const IconComponent = badgeIcons[badge.icon] || FiAward

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="flex flex-col items-center justify-center p-3"
        style={{
          cursor: "pointer",
          position: "relative",
        }}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 },
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            marginBottom: "8px",
            background: `linear-gradient(135deg, ${badge.color}, ${badge.color}99)`,
            boxShadow: `0 4px 15px ${badge.color}50`,
          }}
        >
          <IconComponent size={28} style={{ color: "white" }} />
        </div>
        <span
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#1f2937",
            textAlign: "center",
          }}
        >
          {badge.name}
        </span>
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{
            position: "absolute",
            top: "-5px",
            right: "-5px",
            backgroundColor: "#10b981",
            color: "white",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: "bold",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          +5
        </motion.div>
      </motion.div>
    )
  }

  // Loading animation
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
        }}
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 1.5, ease: "linear", repeat: Number.POSITIVE_INFINITY },
            scale: { duration: 1, repeat: Number.POSITIVE_INFINITY },
          }}
          style={{
            position: "relative",
            width: "80px",
            height: "80px",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "4px solid",
              borderColor: "#6366f1 #8b5cf6 #ec4899 #3b82f6",
              borderTopColor: "#6366f1",
              borderRightColor: "#8b5cf6",
              borderBottomColor: "#ec4899",
              borderLeftColor: "#3b82f6",
              opacity: 0.75,
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              inset: "8px",
              borderRadius: "50%",
              border: "4px solid transparent",
              borderLeftColor: "#3b82f6",
              opacity: 0.75,
            }}
          ></div>
        </motion.div>
      </div>
    )
  }

  // Main container style
  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
  }

  // Content container style
  const contentStyle = {
    flexGrow: 1,
    padding: "32px",
    paddingLeft: "32px",
    transition: "all 0.3s ease",
  }

  // Card style
  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    transition: "all 0.3s ease",
  }

  // Header style
  const headerStyle = {
    marginBottom: "32px",
  }

  // Header title style
  const headerTitleStyle = {
    fontSize: "36px",
    fontWeight: "bold",
    background: "linear-gradient(to right, #6366f1, #8b5cf6, #ec4899)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "8px",
  }

  // Header subtitle style
  const headerSubtitleStyle = {
    color: "#6b7280",
    fontSize: "16px",
    marginTop: "8px",
  }

  // Profile card style
  const profileCardStyle = {
    ...cardStyle,
    marginBottom: "32px",
  }

  // Profile header style
  const profileHeaderStyle = {
    position: "relative",
    height: "128px",
    background: "linear-gradient(to right, #6366f1, #8b5cf6, #ec4899)",
  }

  // Profile avatar container style
  const profileAvatarContainerStyle = {
    position: "absolute",
    bottom: "-64px",
    left: "32px",
  }

  // Profile avatar style
  const profileAvatarStyle = {
    height: "128px",
    width: "128px",
    overflow: "hidden",
    borderRadius: "50%",
    border: "4px solid white",
    backgroundColor: "white",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  }

  // Profile content style
  const profileContentStyle = {
    padding: "32px",
    paddingTop: "80px",
  }

  // Profile name style
  const profileNameStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "8px",
  }

  // Profile tags container style
  const profileTagsContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "8px",
  }

  // Profile tag style
  const profileTagStyle = {
    borderRadius: "9999px",
    padding: "4px 12px",
    fontSize: "12px",
    fontWeight: "500",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  }

  // Points container style
  const pointsContainerStyle = {
    display: "flex",
    gap: "16px",
    marginTop: "16px",
  }

  // Point item style
  const pointItemStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }

  // Point value style
  const pointValueStyle = {
    display: "flex",
    alignItems: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1f2937",
  }

  // Point label style
  const pointLabelStyle = {
    fontSize: "12px",
    color: "#6b7280",
  }

  // Badges section style
  const badgesSectionStyle = {
    marginTop: "24px",
  }

  // Badges title style
  const badgesTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: "12px",
  }

  // Badges container style
  const badgesContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  }

  // Grid container style
  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(1, 1fr)",
    gap: "24px",
    "@media (min-width: 1024px)": {
      gridTemplateColumns: "repeat(3, 1fr)",
    },
  }

  // Chart card style
  const chartCardStyle = {
    ...cardStyle,
    padding: "24px",
  }

  // Chart title style
  const chartTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: "16px",
  }

  // Chart container style
  const chartContainerStyle = {
    height: "256px",
    position: "relative",
  }

  // Stats container style
  const statsContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
    marginTop: "24px",
  }

  // Stat item style
  const statItemStyle = {
    padding: "16px",
    borderRadius: "12px",
    textAlign: "center",
  }

  // Stat value style
  const statValueStyle = {
    fontSize: "24px",
    fontWeight: "bold",
  }

  // Stat label style
  const statLabelStyle = {
    fontSize: "14px",
    marginTop: "4px",
  }

  // List card style
  const listCardStyle = {
    ...cardStyle,
    padding: "24px",
  }

  // List title style
  const listTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
  }

  // List container style
  const listContainerStyle = {
    maxHeight: "240px",
    overflowY: "auto",
  }

  // List item style
  const listItemStyle = {
    padding: "12px 0",
    borderBottom: "1px solid #f3f4f6",
    display: "flex",
    alignItems: "center",
  }

  // List icon style
  const listIconStyle = {
    marginRight: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    flexShrink: 0,
  }

  // List content style
  const listContentStyle = {
    flexGrow: 1,
  }

  // List title style
  const listItemTitleStyle = {
    fontWeight: "500",
    color: "#1f2937",
    fontSize: "14px",
  }

  // List subtitle style
  const listItemSubtitleStyle = {
    color: "#6b7280",
    fontSize: "12px",
    marginTop: "2px",
  }

  // List badge style
  const listBadgeStyle = {
    marginLeft: "8px",
    padding: "2px 8px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: "500",
  }

  // Empty state style
  const emptyStateStyle = {
    display: "flex",
    height: "160px",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    color: "#6b7280",
  }

  // Get badge info based on total points
  const badgeInfo = getBadgeInfo()

  return (
    <div style={containerStyle}>
      <Sidebar />
      <div style={contentStyle}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ paddingBottom: "48px" }}
        >
          {/* Header */}
          <div style={headerStyle}>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={headerTitleStyle}
            >
              Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={headerSubtitleStyle}
            >
              Welcome back, {userData.username}!
            </motion.p>
          </div>

          {/* User Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={profileCardStyle}
            whileHover={{ boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
          >
            <div style={profileHeaderStyle}></div>
            <div style={profileAvatarContainerStyle}>
              <div style={profileAvatarStyle}>
                {userData.avatar ? (
                  <img
                    src={userData.avatar || "/placeholder.svg"}
                    alt="Avatar"
                    style={{ height: "100%", width: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      height: "100%",
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(to right, #6366f1, #8b5cf6)",
                      color: "white",
                    }}
                  >
                    <FiUser size={48} />
                  </div>
                )}
              </div>
            </div>

            <div style={profileContentStyle}>
              <div
                style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end" }}
              >
                <div>
                  <h2 style={profileNameStyle}>{userData.username}</h2>
                  <div style={profileTagsContainerStyle}>
                    <span style={{ ...profileTagStyle, backgroundColor: "#e0e7ff", color: "#4f46e5" }}>
                      {userData.role}
                    </span>
                    <span style={{ ...profileTagStyle, backgroundColor: "#f3e8ff", color: "#9333ea" }}>
                      {userData.branch}
                    </span>
                    <span style={{ ...profileTagStyle, backgroundColor: "#fce7f3", color: "#db2777" }}>
                      Semester {userData.semester}
                    </span>
                    <span style={{ ...profileTagStyle, backgroundColor: "#dbeafe", color: "#2563eb" }}>
                      Section {userData.section}
                    </span>
                  </div>
                </div>

                <div style={pointsContainerStyle}>
                  <div style={pointItemStyle}>
                    <div style={pointValueStyle}>
                      <FiStar style={{ color: "#eab308", marginRight: "4px" }} />
                      <span>{userData.credit_points}</span>
                    </div>
                    <span style={pointLabelStyle}>Credit Points</span>
                  </div>
                  <div style={pointItemStyle}>
                    <div style={pointValueStyle}>
                      <FiZap style={{ color: "#3b82f6", marginRight: "4px" }} />
                      <span>{userData.aura_points}</span>
                    </div>
                    <span style={pointLabelStyle}>Aura Points</span>
                  </div>
                  <div style={pointItemStyle}>
                    <div style={pointValueStyle}>
                      <FiAward style={{ color: "#8b5cf6", marginRight: "4px" }} />
                      <span>{userData.aura_points + userData.credit_points}</span>
                    </div>
                    <span style={pointLabelStyle}>Total Points</span>
                  </div>
                </div>
              </div>

              {/* Badge Section */}
              <div style={badgesSectionStyle}>
                <h3 style={badgesTitleStyle}>Current Badge</h3>
                <div style={badgesContainerStyle}>
                  <Badge badge={badgeInfo} index={0} />
                </div>
              </div>
            </div>
          </motion.div>

          {userData.role === "teacher" ? (
            /* Teacher Dashboard */
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(1, 1fr)",
                gap: "24px",
                "@media (min-width: 1024px)": { gridTemplateColumns: "repeat(2, 1fr)" },
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                style={listCardStyle}
                whileHover={{ boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
              >
                <h3 style={{ ...listTitleStyle, color: "#4f46e5" }}>
                  <FiBookOpen style={{ marginRight: "8px", color: "#4f46e5" }} /> Created Assignments
                </h3>
                {assignments.created.length > 0 ? (
                  <div style={listContainerStyle}>
                    {assignments.created.map((assignment, index) => (
                      <motion.div
                        key={assignment._id}
                        style={listItemStyle}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                      >
                        <div style={{ ...listIconStyle, backgroundColor: "#e0e7ff", color: "#4f46e5" }}>
                          <FiBookOpen size={18} />
                        </div>
                        <div style={listContentStyle}>
                          <div style={listItemTitleStyle}>{assignment.title}</div>
                          <div style={listItemSubtitleStyle}>
                            <FiClock style={{ display: "inline", marginRight: "4px", verticalAlign: "text-top" }} />
                            Due: {assignment.dueDate || "Not set"}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div style={emptyStateStyle}>
                    <p>No created assignments yet</p>
                  </div>
                )}
                <Link
                  to="/create-assignment"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    marginTop: "16px",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    background: "linear-gradient(to right, #4f46e5, #6366f1)",
                    color: "white",
                    fontWeight: "500",
                    fontSize: "14px",
                    textDecoration: "none",
                    boxShadow: "0 4px 6px rgba(79, 70, 229, 0.2)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <FiPlus style={{ marginRight: "8px" }} /> Create Assignment
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                style={listCardStyle}
                whileHover={{ boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
              >
                <h3 style={{ ...listTitleStyle, color: "#9333ea" }}>
                  <FiFolder style={{ marginRight: "8px", color: "#9333ea" }} /> Created Projects
                </h3>
                {projects.created.length > 0 ? (
                  <div style={listContainerStyle}>
                    {projects.created.map((project, index) => (
                      <motion.div
                        key={project._id}
                        style={listItemStyle}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                      >
                        <div style={{ ...listIconStyle, backgroundColor: "#f3e8ff", color: "#9333ea" }}>
                          <FiFolder size={18} />
                        </div>
                        <div style={listContentStyle}>
                          <div style={listItemTitleStyle}>{project.title}</div>
                          <div style={listItemSubtitleStyle}>
                            <FiClock style={{ display: "inline", marginRight: "4px", verticalAlign: "text-top" }} />
                            Due: {project.dueDate || "Not set"}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div style={emptyStateStyle}>
                    <p>No created projects yet</p>
                  </div>
                )}
                <Link
                  to="/create-project"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    marginTop: "16px",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    background: "linear-gradient(to right, #9333ea, #c026d3)",
                    color: "white",
                    fontWeight: "500",
                    fontSize: "14px",
                    textDecoration: "none",
                    boxShadow: "0 4px 6px rgba(147, 51, 234, 0.2)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <FiPlus style={{ marginRight: "8px" }} /> Create Project
                </Link>
              </motion.div>
            </div>
          ) : (
            /* Student Dashboard */
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(1, 1fr)",
                gap: "24px",
                "@media (min-width: 1024px)": { gridTemplateColumns: "repeat(3, 1fr)" },
              }}
            >
              {/* Points Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                style={chartCardStyle}
                whileHover={{ boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
              >
                <h3 style={chartTitleStyle}>Your Points</h3>
                <div style={chartContainerStyle}>
                  <Doughnut data={pointsChartData} options={chartOptions} />
                </div>
                <div style={statsContainerStyle}>
                  <div style={{ ...statItemStyle, background: "linear-gradient(to bottom right, #e0e7ff, #c7d2fe)" }}>
                    <div style={{ ...statValueStyle, color: "#4f46e5" }}>{userData.credit_points}</div>
                    <div style={{ ...statLabelStyle, color: "#4338ca" }}>Credit Points</div>
                  </div>
                  <div style={{ ...statItemStyle, background: "linear-gradient(to bottom right, #dbeafe, #bfdbfe)" }}>
                    <div style={{ ...statValueStyle, color: "#2563eb" }}>{userData.aura_points}</div>
                    <div style={{ ...statLabelStyle, color: "#1d4ed8" }}>Aura Points</div>
                  </div>
                </div>
              </motion.div>

              {/* Charts Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                style={chartCardStyle}
                whileHover={{ boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
              >
                <h3 style={chartTitleStyle}>Assignment Progress</h3>
                <div style={chartContainerStyle}>
                  <Doughnut data={assignmentChartData} options={chartOptions} />
                </div>
                <div style={statsContainerStyle}>
                  <div style={{ ...statItemStyle, background: "linear-gradient(to bottom right, #fee2e2, #fecaca)" }}>
                    <div style={{ ...statValueStyle, color: "#dc2626" }}>{assignments.uncompleted.length}</div>
                    <div style={{ ...statLabelStyle, color: "#b91c1c" }}>Pending</div>
                  </div>
                  <div style={{ ...statItemStyle, background: "linear-gradient(to bottom right, #dcfce7, #bbf7d0)" }}>
                    <div style={{ ...statValueStyle, color: "#16a34a" }}>{assignments.completed.length}</div>
                    <div style={{ ...statLabelStyle, color: "#15803d" }}>Completed</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                style={chartCardStyle}
                whileHover={{ boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
              >
                <h3 style={chartTitleStyle}>Project Progress</h3>
                <div style={chartContainerStyle}>
                  <Doughnut data={projectChartData} options={chartOptions} />
                </div>
                <div style={statsContainerStyle}>
                  <div style={{ ...statItemStyle, background: "linear-gradient(to bottom right, #fef3c7, #fde68a)" }}>
                    <div style={{ ...statValueStyle, color: "#d97706" }}>{projects.uncompleted.length}</div>
                    <div style={{ ...statLabelStyle, color: "#b45309" }}>Pending</div>
                  </div>
                  <div style={{ ...statItemStyle, background: "linear-gradient(to bottom right, #dbeafe, #bfdbfe)" }}>
                    <div style={{ ...statValueStyle, color: "#2563eb" }}>{projects.completed.length}</div>
                    <div style={{ ...statLabelStyle, color: "#1d4ed8" }}>Completed</div>
                  </div>
                </div>
              </motion.div>

              {/* Lists Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                style={listCardStyle}
                whileHover={{ boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
              >
                <h3 style={{ ...listTitleStyle, color: "#dc2626" }}>
                  <FiXCircle style={{ marginRight: "8px", color: "#dc2626" }} /> Uncompleted Assignments
                </h3>
                {assignments.uncompleted.length > 0 ? (
                  <div style={listContainerStyle}>
                    {assignments.uncompleted.map((assignment, index) => (
                      <motion.div
                        key={assignment._id}
                        style={listItemStyle}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 * index }}
                      >
                        <div style={{ ...listIconStyle, backgroundColor: "#fee2e2", color: "#dc2626" }}>
                          <FiBookOpen size={18} />
                        </div>
                        <div style={listContentStyle}>
                          <div style={listItemTitleStyle}>{assignment.title}</div>
                          <div style={listItemSubtitleStyle}>Due: {assignment.dueDate || "Not set"}</div>
                        </div>
                        <div style={{ ...listBadgeStyle, backgroundColor: "#fee2e2", color: "#dc2626" }}>Pending</div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div style={emptyStateStyle}>
                    <p>No uncompleted assignments</p>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                style={listCardStyle}
                whileHover={{ boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
              >
                <h3 style={{ ...listTitleStyle, color: "#16a34a" }}>
                  <FiCheckCircle style={{ marginRight: "8px", color: "#16a34a" }} /> Completed Assignments
                </h3>
                {assignments.completed.length > 0 ? (
                  <div style={listContainerStyle}>
                    {assignments.completed.map((assignment, index) => (
                      <motion.div
                        key={assignment._id}
                        style={listItemStyle}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 * index }}
                      >
                        <div style={{ ...listIconStyle, backgroundColor: "#dcfce7", color: "#16a34a" }}>
                          <FiCheckCircle size={18} />
                        </div>
                        <div style={listContentStyle}>
                          <div style={listItemTitleStyle}>{assignment.title}</div>
                          <div style={listItemSubtitleStyle}>Completed on: {assignment.completedDate || "Unknown"}</div>
                        </div>
                        <div style={{ ...listBadgeStyle, backgroundColor: "#dcfce7", color: "#16a34a" }}>Completed</div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div style={emptyStateStyle}>
                    <p>No completed assignments yet</p>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                style={listCardStyle}
                whileHover={{ boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
              >
                <h3 style={{ ...listTitleStyle, color: "#d97706" }}>
                  <FiXCircle style={{ marginRight: "8px", color: "#d97706" }} /> Uncompleted Projects
                </h3>
                {projects.uncompleted.length > 0 ? (
                  <div style={listContainerStyle}>
                    {projects.uncompleted.map((project, index) => (
                      <motion.div
                        key={project._id}
                        style={listItemStyle}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 * index }}
                      >
                        <div style={{ ...listIconStyle, backgroundColor: "#fef3c7", color: "#d97706" }}>
                          <FiFolder size={18} />
                        </div>
                        <div style={listContentStyle}>
                          <div style={listItemTitleStyle}>{project.title}</div>
                          <div style={listItemSubtitleStyle}>Due: {project.dueDate || "Not set"}</div>
                        </div>
                        <div style={{ ...listBadgeStyle, backgroundColor: "#fef3c7", color: "#d97706" }}>
                          In Progress
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div style={emptyStateStyle}>
                    <p>No uncompleted projects</p>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                style={listCardStyle}
                whileHover={{ boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
              >
                <h3 style={{ ...listTitleStyle, color: "#2563eb" }}>
                  <FiCheckCircle style={{ marginRight: "8px", color: "#2563eb" }} /> Completed Projects
                </h3>
                {projects.completed.length > 0 ? (
                  <div style={listContainerStyle}>
                    {projects.completed.map((project, index) => (
                      <motion.div
                        key={project._id}
                        style={listItemStyle}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 * index }}
                      >
                        <div style={{ ...listIconStyle, backgroundColor: "#dbeafe", color: "#2563eb" }}>
                          <FiCheckCircle size={18} />
                        </div>
                        <div style={listContentStyle}>
                          <div style={listItemTitleStyle}>{project.title}</div>
                          <div style={listItemSubtitleStyle}>Completed on: {project.completedDate || "Unknown"}</div>
                        </div>
                        <div style={{ ...listBadgeStyle, backgroundColor: "#dbeafe", color: "#2563eb" }}>Completed</div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div style={emptyStateStyle}>
                    <p>No completed projects yet</p>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard

