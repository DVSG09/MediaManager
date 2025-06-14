import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, FileText } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="modern-login-container">
      <div className="modern-login-card">
        {/* App Icon */}
        <div className="app-icon">
          <FileText size={32} />
        </div>
        
        {/* Title */}
        <h1 className="app-title">Media Manager</h1>
        <p className="login-subtitle">Welcome back! Please sign in to continue</p>
        
        {/* Error Alert */}
        {error && (
          <div className="modern-alert">
            {error}
          </div>
        )}
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="modern-form">
          {/* Email Field */}
          <div className="modern-field-group">
            <label className="modern-label">Email Address</label>
            <div className="modern-input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="modern-input"
                required
              />
            </div>
          </div>
          
          {/* Password Field */}
          <div className="modern-field-group">
            <label className="modern-label">Password</label>
            <div className="modern-input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="modern-input"
                required
              />
            </div>
          </div>
          
          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="modern-checkbox"
              />
              <span className="checkbox-text">Remember me</span>
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>
          
          {/* Sign In Button */}
          <button 
            type="submit" 
            className="modern-signin-btn"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        {/* Sign Up Link */}
        <div className="signup-link">
          <span>Don't have an account? </span>
          <Link to="/register" className="signup-link-text">Sign up here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;