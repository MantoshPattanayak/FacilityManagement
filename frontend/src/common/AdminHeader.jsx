import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import "./AdminHeader.css";
import APP_LOGO from "../assets/ama-bhoomi-app-logo.png";

const AdminHeader = () => {
  const [isMenuActive, setMenuActive] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuActive(!isMenuActive);
    if (activeDropdown !== null) {
      setActiveDropdown(null);
    }
  };

  const collapseSubMenu = () => {
    if (activeDropdown) {
      activeDropdown.querySelector(".submenu").removeAttribute("style");
      activeDropdown.classList.remove("active");
      setActiveDropdown(null);
      console.log("collapse Submmanue")
    }
  };

  const toggleSubMenu = (e) => {
    if (e.target.hasAttribute("data-toggle") && window.innerWidth <= 992) {
      e.preventDefault();
      const menuDropdown = e.target.parentElement;

      if (menuDropdown === activeDropdown) {
        collapseSubMenu();
      } else {
        collapseSubMenu();
        menuDropdown.classList.add("active");
        const subMenu = menuDropdown.querySelector(".submenu");
        subMenu.style.maxHeight = subMenu.scrollHeight + "px";
        setActiveDropdown(menuDropdown);
      }
    }
  };

  const resizeWindow = () => {
    if (window.innerWidth > 992) {
      setMenuActive(false);
      collapseSubMenu();
    }
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuActive(false);
      collapseSubMenu();
    }
  };

  useEffect(() => {
    window.addEventListener("resize", resizeWindow);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", resizeWindow);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header" id="header">
      <section className="wrapper container">
        <a href="./index.html" className="brand">
          <img  className="ama_bhoomi_logo"     src={APP_LOGO} alt="App Logo" />
        </a>
        <div className="burger" id="burger" onClick={toggleMenu}>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </div>
        {isMenuActive && <div className="overlay" onClick={toggleMenu}></div>}
        <nav ref={menuRef} className={`navbar ${isMenuActive ? "active" : ""}`} id="navbar" onClick={toggleSubMenu}>
          <ul className="menu" id="menu">
            <li className="menu-item"><a href="#" className="menu-link">Home</a></li>
            <li className="menu-item menu-dropdown">
              <span className="menu-link" data-toggle="submenu">MDM<FontAwesomeIcon icon={faChevronDown}  /></span>
              <ul className="submenu">
                <li className="submenu-item"><a href="#" className="submenu-link">Feature Link</a></li>
                <li className="submenu-item"><a href="#" className="submenu-link">Feature Link</a></li>
                <li className="submenu-item"><a href="#" className="submenu-link">Feature Link</a></li>
                <li className="submenu-item"><a href="#" className="submenu-link">Feature Link</a></li>
              </ul>
            </li>
            <li className="menu-item menu-dropdown">
              <span className="menu-link" data-toggle="submenu">Activity<FontAwesomeIcon icon={faChevronDown}  /></span>
              <ul className="submenu">
                <li className="submenu-item"><a href="#" className="submenu-link">Discover Link</a></li>
                <li className="submenu-item"><a href="#" className="submenu-link">Discover Link</a></li>
                <li className="submenu-item"><a href="#" className="submenu-link">Discover Link</a></li>
                <li className="submenu-item"><a href="#" className="submenu-link">Discover Link</a></li>
              </ul>
            </li>
            <li className="menu-item"><a href="#" className="menu-link">Report</a></li>
            <li className="menu-item menu-dropdown">
            <span className="menu-link" data-toggle="submenu">UAC<FontAwesomeIcon icon={faChevronDown}  /></span>
              <ul className="submenu">
                <li className="submenu-item"><a href="#" className="submenu-link">Resource Link</a></li>
                <li className="submenu-item"><a href="#" className="submenu-link">Resource Link</a></li>
                <li className="submenu-item"><a href="#" className="submenu-link">Resource Link</a></li>
                <li className="submenu-item"><a href="#" className="submenu-link">Resource Link</a></li>
              </ul>
            </li>
         
           
        
            {/*  */}
            
           
          
           
       <li>
         
         
       </li>
       
          </ul>
          
        </nav>
      </section>
    </header>
  );
};

export default AdminHeader;