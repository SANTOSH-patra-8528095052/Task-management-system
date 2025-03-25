import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Loader2, FileText, CheckCircle, XCircle, Folder, FolderOpen } from "lucide-react";
import Sidebar from "../../Layout/Sidebar";

// Card components
const Card = ({ children, className, ...props }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className, ...props }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

const CardContent = ({ children, className, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className, ...props }) => (
  <div
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
      variant === "default"
        ? "border-transparent bg-primary text-primary-foreground"
        : variant === "secondary"
        ? "border-transparent bg-secondary text-secondary-foreground"
        : variant === "outline"
        ? "border-gray-300 bg-transparent text-gray-700"
        : ""
    } ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default function AllProjects() {
  const [completedProjects, setCompletedProjects] = useState([]);
  const [uncompletedProjects, setUncompletedProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("uncompleted");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const completedResponse = await fetch("http://localhost:3000/projects/completed", {
          method: "GET",
          credentials: "include",
        });
        if (!completedResponse.ok) {
          throw new Error("Failed to fetch completed projects.");
        }
        const completedData = await completedResponse.json();
        setCompletedProjects(completedData.completedProjects);

        const uncompletedResponse = await fetch("http://localhost:3000/projects/uncompleted", {
          method: "GET",
          credentials: "include",
        });
        if (!uncompletedResponse.ok) {
          throw new Error("Failed to fetch uncompleted projects.");
        }
        const uncompletedData = await uncompletedResponse.json();
        setUncompletedProjects(uncompletedData.uncompletedProjects);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);


  // Inside AllProjects function
  const navigate = useNavigate()
  
  const ProjectCard = ({ project, isCompleted }) => {
    const handleCardClick = () => {
      if (!isCompleted) {
        navigate(`/create-project/${project._id}`) // Redirect for uncompleted projects
      }
    }
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          onClick={handleCardClick}
          className={`overflow-hidden transition-all hover:shadow-lg hover:scale-105 ${
            !isCompleted ? "cursor-pointer" : ""
          }`}
        >
          <CardHeader className={`border-b p-4 ${isCompleted ? "bg-green-100" : "bg-blue-100"}`}>
            <CardTitle className="flex items-center justify-between text-lg">
              {project.title}
              <div className="flex items-center space-x-2">
                <Badge variant={isCompleted ? "default" : "secondary"} className="ml-2">
                  {isCompleted ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                  {isCompleted ? "Completed" : "Uncompleted"}
                </Badge>
                <Badge variant="outline" className="bg-white">
                  {project.status}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 bg-gradient-to-br from-white to-gray-50">
            <p className="mb-4 text-sm text-gray-600">{project.description}</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-gray-200 text-gray-700">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="space-y-2">
              {project.teacherFiles.map((file, index) => (
                <a
                  key={index}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {file.fileType.toUpperCase()} File {index + 1}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }
  

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
        <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-6">
      <Sidebar/>
      <div className="container mx-auto">
        <nav className="mb-8 flex justify-between items-center">
          <Link to="/" className="text-lg font-semibold text-blue-500 hover:text-blue-700">
            Home
          </Link>
          <Link to="/all-projects" className="text-lg font-semibold text-blue-500 hover:text-blue-700">
            All Projects
          </Link>
        </nav>
        <h1 className="mb-8 text-4xl font-bold text-center text-gray-800 animate-fade-in-down">Project Dashboard</h1>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded bg-red-100 p-4 text-red-700 shadow-md"
          >
            {error}
          </motion.div>
        )}

        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setActiveTab("uncompleted")}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === "uncompleted" ? "bg-blue-500 text-white" : "bg-white text-blue-500 hover:bg-blue-100"
            }`}
          >
            <Folder className="inline-block mr-2" /> Uncompleted Projects
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === "completed" ? "bg-green-500 text-white" : "bg-white text-green-500 hover:bg-green-100"
            }`}
          >
            <FolderOpen className="inline-block mr-2" /> Completed Projects
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "uncompleted" && (
            <motion.div
              key="uncompleted"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-4 text-2xl font-semibold text-blue-700">Uncompleted Projects</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {uncompletedProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} isCompleted={false} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "completed" && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-4 text-2xl font-semibold text-green-700">Completed Projects</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {completedProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} isCompleted={true} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
