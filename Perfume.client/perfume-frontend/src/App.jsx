import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import './App.css'
import Login from './Pages/Login'
import Home from './Pages/Home';
import Search from './Pages/Search.jsx';
import Recommendation from './Pages/Recommendation';

function App() {

  return (
    <>
    <Router>
      <Routes>
         <Route path="/login" element={<Login/>} /> 
         <Route path="/" element={<Home />} />
        <Route path='/recommendation' element={<Recommendation/>}></Route>
         <Route path="/search" element={<Search />} /> 
         
       
      </Routes>
    </Router>
    </>
  )
}

export default App
