import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
import api from '../services/api'; 
import Card from '../components/Card'; 
import Loader from '../components/Loader';
import './Auth.css';

const Register = () => {
  const { login } = useContext(AuthContext); 
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Customer' 
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post("/auth/register", formData); 
      
      const loginRes = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password
      });

      const { user, token } = loginRes.data;
      
      if (login) {
        login(user, token);
        if (user.role === 'Manager') {
          navigate('/manager');
        } else {
          navigate('/dashboard');
        }
      }

    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.message || 'Process failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Loader loading={loading} text="Creating your account..." />

      <Card title="Create Account" className="auth-card">
        <p className="auth-subtitle text-center">Join Auto-Service Hub today</p>
        
        {error && <div className="error-alert">{error}</div>}
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              value={formData.username}
              onChange={handleChange}
              required 
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={formData.email}
              onChange={handleChange}
              required 
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={formData.password}
              onChange={handleChange}
              required 
              placeholder="Create a strong password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Register As</label>
            <select id="role" value={formData.role} onChange={handleChange} className="form-control">
              <option value="Customer">Customer (Vehicle Owner)</option>
              <option value="Manager">Manager (Workshop Owner)</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Processing...' : 'Register & Login'}
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;