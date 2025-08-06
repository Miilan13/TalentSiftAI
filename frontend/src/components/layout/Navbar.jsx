// Navigation Bar Component
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  DollarSign
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'About', href: '/about', icon: Users },
    { name: 'Pricing', href: '/pricing', icon: DollarSign },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  const candidateNavigation = [
    { name: 'Dashboard', href: '/candidate/dashboard', icon: BarChart3 },
    { name: 'Applications', href: '/candidate/applications', icon: FileText },
    { name: 'Profile', href: '/candidate/profile', icon: User },
  ];

  const hrNavigation = [
    { name: 'Dashboard', href: '/hr/dashboard', icon: BarChart3 },
    { name: 'Manage Jobs', href: '/hr/jobs', icon: Briefcase },
    { name: 'Applications', href: '/hr/applications', icon: FileText },
    { name: 'Company', href: '/hr/company', icon: Building2 },
  ];

  // Get navigation items based on auth status
  const getNavigationItems = () => {
    if (!isAuthenticated) {
      return navigation;
    }
    
    // When authenticated, show general navigation + role-specific
    const roleNavigation = user?.role === 'candidate' ? candidateNavigation : hrNavigation;
    return [...navigation, ...roleNavigation];
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 w-full sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Main Navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white p-2.5 rounded-xl shadow-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                TalentSift AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex ml-10 space-x-1">
              {getNavigationItems().map((item) => {
                const Icon = item.icon;
                const isCurrentlyActive = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isCurrentlyActive
                        ? 'text-white bg-primary-600 shadow-md'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-primary-600 focus:outline-none bg-gray-50 hover:bg-primary-50 rounded-lg px-3 py-2 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center shadow-md">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="hidden lg:block font-medium">{user?.name}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full capitalize font-medium">
                          {user?.role}
                        </span>
                      </div>
                      
                      <Link
                        to={user?.role === 'candidate' ? '/candidate/profile' : '/hr/company'}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden lg:flex space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white shadow-lg">
            <div className="px-4 pt-3 pb-4 space-y-1">
              {getNavigationItems().map((item) => {
                const Icon = item.icon;
                const isCurrentlyActive = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isCurrentlyActive
                        ? 'text-white bg-primary-600 shadow-md'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Mobile auth buttons */}
              {!isAuthenticated && (
                <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg text-base font-medium transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-3 py-3 rounded-lg text-base font-medium text-center transition-all duration-200 shadow-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
