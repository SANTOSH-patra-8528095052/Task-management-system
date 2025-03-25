import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AssignmentCard from '../Components/AssignmentCard';
import Sidebar from '../Layout/Sidebar';

function IndexPage() {
  const [assignments,setAssignments] = useState([]);

  useEffect(() =>{
    fetch('http://localhost:3000/assignment').then((response) =>{
      response.json().then( (assignments) =>{
        setAssignments(assignments)
      })
    })
  },[])
  console.log(assignments);
  

  return (
    <>
        <div className="content-wrapper">
        
        <Sidebar />
        <main className="main-content">
          <section id="dashboard" className="section">
            <div className="stats">
              <div className="stat-item">
                <Link>
                <h2>Total Tasks</h2>
                </Link>
                <p>10</p>
              </div>
              <div className="stat-item">
               <Link>
               <h2>Completed Tasks</h2>
               </Link>
                <p>5</p>
              </div>
              <div className="stat-item">
                <Link>
                <h2>Pending Tasks</h2>
                </Link>
                <p>5</p>
              </div>
            </div>
          </section>

          <section id="assignments" className="section">
            <h2>Assignments</h2>
            <>
              { assignments?.length > 0  && assignments.map( (assignment,index) =>(
                  <AssignmentCard key={index} {...assignment} /> 
              ) )}
            </>
          </section>
        </main>
      </div>
    </>
  )
}

export default IndexPage