import { UserContextProvider } from './UserContext.jsx'
import { Routes,Route } from 'react-router-dom'

import './App.css'
import Layout from './Layout/Layout.jsx'
import IndexPage from './Pages/IndexPage.jsx'
import LoginPage from './Pages/LoginPage.jsx'
import RegisterPage from './Pages/RegisterPage.jsx'
import { Auth0Provider } from '@auth0/auth0-react';
import AssignmentForm from './Pages/AssingmentForm.jsx'
import AssignmentPage from './Pages/AssignmentPage.jsx'
import EditAssignment from './Pages/EditAssignment.jsx'
import ProfilePage from './Pages/ProfilePage.jsx'
import Dashboard from './Pages/DashBoard.jsx'
import Assignments from './Pages/Assignments.jsx'
import ProjectForm from './Pages/ProjectForm.jsx'
import AllProjects from './Pages/ProjectPage/AllProjects.jsx'
import ProjectPage from './Pages/ProjectPage/ProjectsPage.jsx'
import ChallengesPage from './Pages/Challenges/Challenges.jsx'
import Challenges from './Pages/Challenges/Challenges.jsx'
import CreateChallenge from './Pages/Challenges/CreateChallenge.jsx'
import ChallengeDetail from './Pages/Challenges/ChallengeDetail.jsx'
import Leaderboard from './Components/leaderboard.jsx'

function App() {
  

  return (
    <UserContextProvider>
      <Auth0Provider domain="dev-fxq6htveh1ff7e2k.us.auth0.com"
      clientId="FMmN7xBn3hWyXb4Pbn9Jl4zXkRPkMCnd"
      authorizationParams={
        {
          redirect_uri: window.location.origin
        }
      }
      >
      <Routes>
        <Route path='/' element={<Layout/>} >
          <Route index element={<IndexPage/>} />
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/register' element={<RegisterPage/>} />
          <Route path='/create-assignment' element={<AssignmentForm/>} />
          <Route path='/assignment/:id' element={<AssignmentPage/>} />
          <Route path='/edit/:id' element={<EditAssignment/>} />
          <Route path='/login/profile/:id' element={<ProfilePage/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/assignments' element={<Assignments/>} />
          <Route path='/create-project' element={<ProjectForm/>} />
          <Route path='/create-project/:id' element={<ProjectPage/>} />
          <Route path='/all-projects' element={<AllProjects/>} />

          <Route path="/leaderboard" element={<Leaderboard />} />

          <Route path="/challenges" element={<Challenges />} />
          <Route path="/challenges/create" element={<CreateChallenge />} />
          <Route path="/challenges/:id" element={<ChallengeDetail />} />
          {/* <Route path='/newProfile/:id' element={<___/>} /> */}
        </Route>
      </Routes>
      </Auth0Provider>
    </UserContextProvider>
  )
}

export default App
