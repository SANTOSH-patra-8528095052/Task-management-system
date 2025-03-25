import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext'

function Sidebar() {
  const {userInfo}= useContext(UserContext)
  return (
    <>
    <aside className="sidebar">
          <ul>
            <li><Link to='/dashboard'>Dashboard</Link></li>
            <li><Link to='/assignments'>Assignments</Link></li>
            <li><Link to='/todos'>To-Do</Link></li>
            <li><Link to='/completed-task'>Completed Tasks</Link></li>
            <li><Link to={`/login/profile/${userInfo.id}`}> Profile</Link></li>
          </ul>
        </aside>
    </>
  )
}

export default Sidebar