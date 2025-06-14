import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, FolderOpen, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name?.split(' ').map(word => word[0]).join('').toUpperCase() || 'U';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <FolderOpen className="navbar-icon" />
          Media Manager
        </Link>
        
        {user && (
          <div className="navbar-user">
            <div 
              className="user-dropdown-trigger"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="user-avatar">
                {getInitials(user.name)}
              </div>
              <span className="user-name">{user.name}</span>
              <ChevronDown size={16} className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} />
            </div>
            
            {dropdownOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="user-avatar large">
                    {getInitials(user.name)}
                  </div>
                  <div className="user-details">
                    <div className="user-name-dropdown">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button 
                  onClick={handleLogout}
                  className="dropdown-item logout-item"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Backdrop to close dropdown */}
      {dropdownOpen && (
        <div 
          className="dropdown-backdrop" 
          onClick={() => setDropdownOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;