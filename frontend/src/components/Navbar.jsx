import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Auto-Service Hub</Link>
      </div>
      <ul className="nav-links">
        {user ? (
          <>
            <li className="user-welcome">Welcome, {user.username}</li>
            <li>
              <Link to={user.role === 'Manager' ? '/manager' : '/dashboard'}>Dashboard</Link>
            </li>
            <li>
              <button onClick={logout} className="logout-btn">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="login-link">Login</Link>
            </li>
            <li>
              <Link to="/register" className="register-btn">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;