import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <nav
            style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '10px',
                background: '#007bff',
                color: 'white',
            }}
        >
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
            <Link to="/Register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
            <Link to="/Login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link to="/DeshBoard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/Storage" style={{ color: 'white', textDecoration: 'none' }}>Storage</Link>
        </nav>
    );
}

export default NavBar;
