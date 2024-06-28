import React, { useEffect, useState } from "react";
import AppLogo from "../assets/ama-bhoomi_logo.png";
import "../components/Public/Landing";
import '../common/AdminHeader.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faUser, faBars, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import axiosHttpClient from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage, setLanguageContent } from "../utils/languageSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logout } from "../utils/authSlice";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export default function AdminHeader() {
  const [showMediaIcon, setShowMediaIcon] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const [refresh, setRefresh] = useState(false);
  // const language = useSelector((state) => state.language.language);
  // const languageContent = useSelector((state) => state.language.languageContent);
  // const isLanguageContentFetched = useSelector((state) => state.language.isLanguageContentFetched);
  const isAdminLoggedIn = useSelector((state) => state.auth.isAdminLoggedIn) || sessionStorage?.getItem("isAdminLoggedIn");
  const [menuData, setMenuData] = useState([]);
  let accessRoutes = useSelector((state) => state.auth.accessRoutes);

  // useEffect(() => {
  //   if (!isLanguageContentFetched) {
  //     getWebContent();
  //   }
  // }, [isLanguageContentFetched, language]);

  // async function getWebContent() {
  //   try {
  //     const res = await axiosHttpClient('LANGUAGE_RESOURCE_API', 'post', { language });
  //     if (Array.isArray(res.data.languageContentResultData)) {
  //       dispatch(setLanguageContent(res.data.languageContentResultData));
  //     } else {
  //       console.log('valid language content data:', res.data.languageContentResultData);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching language content:', error);
  //   }
  // }

  // function setLanguageCode(languageCode) {
  //   dispatch(setLanguage(languageCode));
  // }

  async function handleLogout(e) {
    // async function logOutAPI() {
      try {
        let res = await axiosHttpClient('LOGOUT_API', 'post');
        console.log(res.data);
        toast.success('Logged out successfully!!');
        dispatch(Logout());
        setRefresh(prevState => !prevState);
        sessionStorage.clear();
        localStorage.clear();
      }
      catch (error) {
        console.error(error);
      }
    // }
    // logOutAPI();
  }

  function handleMenuToggle() {
    setShowMediaIcon(prevState => !prevState);
  }

  const renderSubMenu = (children) => {
    if (children.length === 0) return null;
    return (
      <ul className="submenu">
        {children.map((subItem) => (
          <li key={subItem.id}>
            <Link to={subItem.path}>{subItem.name}</Link>
          </li>
        ))}
      </ul>
    );
  };

  useEffect(() => {
    setMenuData(accessRoutes || JSON.parse(sessionStorage.getItem('accessRoutes')));
  }, [refresh]);

  useEffect(() => {
    setMenuData(accessRoutes || JSON.parse(sessionStorage.getItem('accessRoutes')));
  }, [])

  return (
    <header className="header-admin" id="header-public">
      {/* <ToastContainer /> */}
      <div className="header-content">
        <div className="logo-ama-boomi">
          <img src={AppLogo} alt="App Logo" className="h-[100%] top-0 absolute" />
        </div>
        <div className="navbar-2">
          <ul className={showMediaIcon ? "menu_links mobile_menu_links show" : "menu_links"} >
            {isAdminLoggedIn == 1 && menuData?.length > 0 && menuData?.map((menuItem) => {
              if (menuItem.name === "Dashboard" && menuItem.children.length > 0) {
                return menuItem.children.map((child) => (
                  <li key={child.id}>
                    <Link to={child.path}>Dashboard</Link>
                  </li>
                ));
              } else {
                return (
                  <li
                    key={menuItem.id}
                    className="menu-item"
                    onMouseEnter={() => setHoveredMenu(menuItem.id)}
                    onMouseLeave={() => setHoveredMenu(null)}
                  >
                    <Link to={menuItem.path || "#"}>{menuItem.name}</Link>
                    {hoveredMenu === menuItem.id && renderSubMenu(menuItem.children)}
                  </li>
                );
              }
            })}
            {/* {isAdminLoggedIn == 1 ? (
              <li>
                <Link to={'/Profile'}>
                  <FontAwesomeIcon icon={faUser} /> &nbsp; PROFILE
                </Link>
              </li>
            ) : (
              <li>
                <Link className="login-button" to="/admin-login">
                  LOGIN
                </Link>
              </li>
            )} */}
            {/* {isAdminLoggedIn == 1 && (
              <li>
                <Link className="relative flex items-center" to="/BookParks/Add_Card">
                  {GetCardCount.count > 0 && (
                    <span className="cart-count absolute left-1 transform -translate-x-1/2 -top-5 bg-red-500 text-white text-xs font-semibold py-0.5 px-1 rounded-full">{GetCardCount.count}</span>
                  )}
                  <span><FontAwesomeIcon icon={faShoppingCart} className="cart-icon" size="lg" /> Cart</span>
                </Link>
              </li>
            )} */}
            {isAdminLoggedIn == 1 && (
              <li>
                <Link onClick={handleLogout} to={'/admin-login'}>
                  <FontAwesomeIcon icon={faPowerOff}></FontAwesomeIcon> &nbsp;
                </Link>
              </li>
            )}
          </ul>
          <div className="hamburger-menu" onClick={handleMenuToggle}>
            <FontAwesomeIcon icon={faBars} />
          </div>
        </div>
      </div>
    </header>
  );
}
