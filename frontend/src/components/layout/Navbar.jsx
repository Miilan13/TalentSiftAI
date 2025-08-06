// In frontend/src/components/layout/Navbar.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  User,
  LogOut,
  Menu,
  X,
  Building2,
  Briefcase,
  FileText,
  BarChart3,
  Settings,
  Home,
  Users,
  Phone,
  DollarSign,
  Brain,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const mainNav = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'About', href: '/about', icon: Users },
    { name: 'Pricing', href: '/pricing', icon: DollarSign },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  const candidateNav = [
    { name: 'Dashboard', href: '/candidate/dashboard', icon: BarChart3 },
    { name: 'My Applications', href: '/candidate/applications', icon: FileText },
    { name: 'My Profile', href: '/candidate/profile', icon: User },
  ];

  const hrNav = [
    { name: 'HR Dashboard', href: '/hr/dashboard', icon: BarChart3 },
    { name: 'Manage Jobs', href: '/hr/jobs', icon: Briefcase },
    { name: 'All Applicants', href: '/hr/applications', icon: FileText },
    { name: 'AI Tools', href: '/ai/analyze', icon: Brain },
    { name: 'Company Settings', href: '/hr/company', icon: Building2 },
  ];

  const getRoleNav = () => {
    if (!isAuthenticated) return [];
    return user?.role === 'candidate' ? candidateNav : hrNav;
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 w-full sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Main Navigation */}
          <div className="flex items-center h-full">
            <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-xl shadow-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                TalentSift AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex ml-10 space-x-2">
              {mainNav.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 h-10 flex items-center rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isActive(item.href)
                      ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu and Auth Buttons */}
          <div className="flex items-center h-full space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl h-12 px-3 transition-all duration-200 hover:shadow-md hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="font-semibold text-gray-800 text-sm truncate max-w-28">
                      {user?.name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 transform transition-all duration-200 ease-out">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800 truncate">{user?.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-2 px-3 py-1 text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full capitalize font-medium">
                        {user?.role}
                      </span>
                    </div>
                    <div className="py-2">
                      {getRoleNav().map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center px-4 py-3 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 group ${
                            isActive(item.href) ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-r-2 border-blue-500' : 'text-gray-700'
                          }`}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <item.icon className={`w-5 h-5 mr-3 transition-colors ${
                            isActive(item.href) ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                          }`} />
                          <span className={`font-medium transition-colors ${
                            isActive(item.href) ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'
                          }`}>
                            {item.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 pt-2 mt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
                      >
                        <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="px-4 h-12 flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors rounded-xl hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 h-12 flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-12 h-12 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 bg-gray-50">
            {[...mainNav, ...getRoleNav()].map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 mx-2 rounded-xl transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-white hover:shadow-sm'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className={`w-5 h-5 mr-3 ${
                  isActive(item.href) ? 'text-white' : 'text-gray-500'
                }`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="border-t border-gray-200 mt-4 pt-4 space-y-3 px-2">
                <Link 
                  to="/login" 
                  className="w-full px-4 py-3 h-12 flex items-center justify-center text-gray-700 bg-gray-50 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="w-full px-4 py-3 h-12 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
            {isAuthenticated && (
              <div className="border-t border-gray-200 mt-4 pt-4 px-2">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center w-full h-12 px-4 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200 font-medium"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
