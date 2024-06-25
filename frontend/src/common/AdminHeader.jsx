import React, { useEffect, useState } from "react";
import AppLogo from "../assets/ama-bhoomi_logo.png";
import "../components/Public/Landing";
import '../common/AdminHeader.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faUser, faBars, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import axiosHttpClient from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage, setLanguageContent } from "../utils/languageSlice";
import { Link, useNavigate } from "react-router-dom";
import { Logout } from "../utils/authSlice";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

export default function PublicHeader() {
  const [showMediaIcon, setShowMediaIcon] = useState(false);
  const [GetCardCount, setGetCardCount] = useState([]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState();
  const [refreshOnLogOut, setRefreshOnLogOut] = useState(Date.now());

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const language = useSelector((state) => state.language.language);
  const languageContent = useSelector((state) => state.language.languageContent);
  const isLanguageContentFetched = useSelector((state) => state.language.isLanguageContentFetched);

  useEffect(() => {
    setIsUserLoggedIn(sessionStorage?.getItem("isUserLoggedIn") || 0);
    if (!isLanguageContentFetched) {
      getWebContent();
    }
  }, [isLanguageContentFetched, language]);

  async function getWebContent() {
    try {
      const res = await axiosHttpClient('LANGUAGE_RESOURCE_API', 'post', { language });
      if (Array.isArray(res.data.languageContentResultData)) {
        dispatch(setLanguageContent(res.data.languageContentResultData));
      } else {
        console.log('valid language content data:', res.data.languageContentResultData);
      }
    } catch (error) {
      console.error('Error fetching language content:', error);
    }
  }

  function setLanguageCode(languageCode) {
    dispatch(setLanguage(languageCode));
  }

  async function GetTotalNumberofCart() {
    try {
      let res = await axiosHttpClient('View_Card_UserId', 'get');
      setGetCardCount(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    GetTotalNumberofCart();
  }, []);

  function handleLogout(e) {
    dispatch(Logout());
    async function logOutAPI() {
      try {
        let res = await axiosHttpClient('LOGOUT_API', 'post');
        console.log(res.data);
        toast.success('Logged out successfully!!', {
          autoClose: 3000,
          onClose: () => {
            setTimeout(() => {
              navigate("/");
            }, 1000);
          },
        });
      }
      catch (error) {
        console.error(error);
      }
    }
    logOutAPI();
  }

  function handleMenuToggle() {
    setShowMediaIcon(prevState => !prevState);
  }

  const menuData = [
    {
      id: "9",
      name: "Dashboard",
      orderIn: 1,
      path: null,
      children: [
        { id: "10", name: "Admin Dashboard", orderIn: 1, path: "/Dashboard/AdminDashboard" }
      ]
    },
    {
      id: "7",
      name: "Activity",
      orderIn: 2,
      path: "",
      children: []
    },
    {
      id: "1",
      name: "UAC",
      orderIn: 3,
      path: "",
      children: [
        { id: "2", name: "Resource", orderIn: 1, path: "/UAC/Resources/ListOfResources" },
        { id: "3", name: "Role", orderIn: 2, path: "/UAC/Role/ListOfRoles" },
        { id: "4", name: "User", orderIn: 3, path: "/UAC/Users/ListOfUsers" },
        { id: "5", name: "Role-Resource Access Control", orderIn: 4, path: "/UAC/RoleResource/View" },
        { id: "6", name: "User-Resource Access Control", orderIn: 5, path: "/UAC/UserResource/View" }
      ]
    }
  ];

  const [hoveredMenu, setHoveredMenu] = useState(null);

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

  return (
    <header className="header-admin" id="header-public">
      {/* <ToastContainer /> */}
      <div className="header-content">
        <div className="logo-ama-boomi">
          <img src={AppLogo} alt="App Logo" className="h-[100%] top-0 absolute" />
        </div>
        <div className="navbar-2">
          <ul className={showMediaIcon ? "menu_links mobile_menu_links show" : "menu_links"} >
            {/* <li>
              <Link to={'/Home'}>HOME</Link>
            </li>
            <li>
              <Link to={'/MDM'}>MDM</Link>
            </li>
            <li>
              <Link to={'/Reports'}>REPORTS</Link>
            </li> */}
            {menuData.map((menuItem) => {
              if (menuItem.name === "Dashboard" && menuItem.children.length > 0) {
                return menuItem.children.map((child) => (
                  <li key={child.id}>
                    <Link to={child.path}>{child.name}</Link>
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
            {isUserLoggedIn == 1 ? (
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
            )}
            {isUserLoggedIn == 1 && (
              <li>
                <Link className="relative flex items-center" to="/BookParks/Add_Card">
                  {GetCardCount.count > 0 && (
                    <span className="cart-count absolute left-1 transform -translate-x-1/2 -top-5 bg-red-500 text-white text-xs font-semibold py-0.5 px-1 rounded-full">{GetCardCount.count}</span>
                  )}
                  <span><FontAwesomeIcon icon={faShoppingCart} className="cart-icon" size="lg" /> Cart</span>
                </Link>
              </li>
            )}
            {isUserLoggedIn == 1 && (
              <li>
                <Link onClick={handleLogout} to={'/'}>
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
