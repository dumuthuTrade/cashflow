import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileOpen && !event.target.closest('[data-sidebar]')) {
        setIsMobileOpen(false);
      }
    };

    if (isMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileOpen]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const setExpanded = (expanded) => {
    setIsExpanded(expanded);
  };

  const setHovered = (hovered) => {
    setIsHovered(hovered);
  };

  const setMobileOpen = (open) => {
    setIsMobileOpen(open);
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  const value = {
    isExpanded,
    isHovered,
    isMobileOpen,
    toggleExpanded,
    toggleMobile,
    setExpanded,
    setHovered,
    setMobileOpen,
    closeMobile
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

SidebarProvider.propTypes = {
  children: PropTypes.node.isRequired
};
