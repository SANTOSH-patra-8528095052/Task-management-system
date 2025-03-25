import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserContext } from '../UserContext';
import Sidebar from '../Layout/Sidebar';
import { FiCalendar, FiTag, FiFileText } from 'react-icons/fi';

const ProjectForm = () => {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    dueDate: '',
    teacherFiles: [],
  });

  const [feedback, setFeedback] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setFormData((prevData) => ({
      ...prevData,
      teacherFiles: Array.from(files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, tags, dueDate, teacherFiles } = formData;

    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('tags', tags);
    data.append('dueDate', dueDate);
    teacherFiles.forEach((file) => data.append('teacherFiles', file));

    try {
      const response = await fetch('http://localhost:3000/projects', {
        method: 'POST',
        credentials: 'include',
        body: data,
      });

      if (response.ok) {
        setFeedback('Project created successfully!');
        setFormData({ title: '', description: '', tags: '', dueDate: '', teacherFiles: [] });
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        const errorData = await response.json();
        setFeedback(`Error: ${errorData.message}`);
      }
    } catch (err) {
      setFeedback('An error occurred while creating the project.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Sidebar />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow p-8"
      >
        <h1 className="text-4xl font-bold text-white mb-8">Create Project</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter project title"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Describe your project"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
              <FiTag className="inline mr-2" />
              Tags (comma-separated)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="tags"
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="Enter tags"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
              <FiCalendar className="inline mr-2" />
              Due Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="dueDate"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <FiFileText className="inline mr-2" />
              Teacher Files
            </label>
            <input
              type="file"
              name="teacherFiles"
              accept="PDF, DOC, DOCX, JPG, PNG"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border-2 border-gray-300 rounded-lg"
            />
            {formData.teacherFiles.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold">Selected files:</p>
                <ul className="list-disc list-inside">
                  {formData.teacherFiles.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600">{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Create Project
            </motion.button>
          </div>
        </form>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded ${
              feedback.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {feedback}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ProjectForm;
