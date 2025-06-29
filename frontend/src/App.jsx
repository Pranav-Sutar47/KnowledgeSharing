// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import PostDetail from './components/PostDetail';
import MyPosts from './components/MyPosts';
import Login from './pages/Login';
import Signup from './pages/Signup';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post/:author" element={<PostDetail />} />
        <Route path="/myposts" element={<MyPosts />} />
      </Routes>
    </Router>
  );
};

export default App;
