import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, FileText } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.passwordConfirmation
    );
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors(result.errors || { general: result.message });
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
        <p className="login-subtitle">Create your account to get started</p>
        
        {/* Error Alert */}
        {errors.general && (
          <div className="modern-alert">
            {errors.general}
          </div>
        )}
        
        {/* Register Form */}
        <form onSubmit={handleSubmit} className="modern-form">
          {/* Name Field */}
          <div className="modern-field-group">
            <label className="modern-label">Full Name</label>
            <div className="modern-input-wrapper">
              <User className="input-icon" size={20} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="modern-input"
                required
              />
            </div>
            {errors.name && <span className="field-error">{errors.name[0]}</span>}
          </div>
          
          {/* Email Field */}
          <div className="modern-field-group">
            <label className="modern-label">Email Address</label>
            <div className="modern-input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="modern-input"
                required
              />
            </div>
            {errors.email && <span className="field-error">{errors.email[0]}</span>}
          </div>
          
          {/* Password Field */}
          <div className="modern-field-group">
            <label className="modern-label">Password</label>
            <div className="modern-input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="modern-input"
                required
              />
            </div>
            {errors.password && <span className="field-error">{errors.password[0]}</span>}
          </div>
          
          {/* Confirm Password Field */}
          <div className="modern-field-group">
            <label className="modern-label">Confirm Password</label>
            <div className="modern-input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                name="passwordConfirmation"
                value={formData.passwordConfirmation}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="modern-input"
                required
              />
            </div>
          </div>
          
          {/* Create Account Button */}
          <button 
            type="submit" 
            className="modern-signin-btn"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        {/* Sign In Link */}
        <div className="signup-link">
          <span>Already have an account? </span>
          <Link to="/login" className="signup-link-text">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;