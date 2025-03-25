import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("http://localhost:3000/leaderboard",{
            credentials:"include",

        });
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Leaderboard</h2>
      <ul>
        {leaderboard.map((user, index) => (
          <li
            key={user._id}
            className="flex items-center justify-between border-b py-2"
          >
            <Link to={`/profile/${user._id}`} className="text-lg font-semibold text-blue-600 hover:underline">
              #{index + 1} {user.username}
            </Link>
            <span className="text-blue-600 font-bold">{user.aura_points} AP</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
