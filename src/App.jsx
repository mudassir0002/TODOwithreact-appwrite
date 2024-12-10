import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './Pages/NavBar';
import Home from './Pages/Home';
import Register from './Pages/Register';
import Login from './Pages/Login';
import DeshBoard from './Pages/DeshBoard';
import Storage from './Pages/Storage';

function App() {
    return (
        <BrowserRouter>
            {/* NavBar included here */}
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/DeshBoard" element={<DeshBoard />} />
                <Route path="/Storage" element={<Storage />} />
                </Routes>
        </BrowserRouter>
    );
}

export default App;
