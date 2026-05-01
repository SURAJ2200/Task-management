import { useState, } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import AdminDashboard from './Pages/AdminDashboard'
import MemberDashboard from './Pages/MemberDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Projects from './Pages/Projects'
import Tasks from './Pages/Tasks'

function App() {

  return (
    <BrowserRouter>
     
     <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/member-dashboard" element={
          <ProtectedRoute allowedRole="member">
            <MemberDashboard />
          </ProtectedRoute>
        } />

        <Route path="/projects" element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        } />

     </Routes>
    </BrowserRouter>
   
  )
}

export default App
