import { useState } from "react";
import instance from "../env";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoutes";
import ListOfRoles from "./components/Admin/UAC/Role/ListOfRoles";
import CreateRole from "./components/Admin/UAC/Role/CreateRole";
import EditRole from "./components/Admin/UAC/Role/EditRole";

import EditResource from "./components/Admin/UAC/Resource/EditResource";
import AdminDashboard from "./components/Admin/Dashboard/AdminDashboard";

//common table
import CommonTable from "./common/CommonTable";

import UnauthorizedPage from "./common/Unauthorized";
import ListOfUsers from "./components/Admin/UAC/User/ListOfUsers";
import CreateNewUser from "./components/Admin/UAC/User/CreateNewUser";
import EditUser from "./components/Admin/UAC/User/EditUser";
import ReviewUserRating from "./components/Admin/Activity/ReviewUserRating/ReviewUserRating";
import ReviewEventDetailsList from "./components/Admin/Activity/ReviewEventDetails/ReviewEventDetailsList";

//import public files here
import SignUp from "./components/Public/SignUp";
import Login from "./components/Public/Login";
//import BookParks files here
import Book_Now from "./components/Public/BookParks/Book_Now";
//User profile (Booking Details)
import BookingDetails from "./components/Public/UserProfile/BookingDetails";
//User profile (Favorites -USER PROFILE)
import Favorites from "./components/Public/UserProfile/Favorites";

//Public Header
// import PublicHeader from "./common/PublicHeader";
// Admin Header
import AdminHeader from "./common/AdminHeader";
// Import Footer
import Footer from "./common/Footer";
// Import Common Header
import CommonHeader from "./common/CommonHeader";
// Import Common Footer
import CommonFooter from "./common/CommonFooter";
//import home page
import Home from "./components/Public/Home";
// Import here Partice Page
import ParticePage from "./components/Admin/MDM/FacilityRegistration/ParPage";

// here import list of resources
// import ListOfResources from './components/Admin/UAC/Resource/ListOfResources';
// here Import the role list table'
import RoleResourceMappingList from "../../frontend/src/components/Admin/UAC/AccessControl/RoleResourceMapping/RoleResourceMappingList";

import CreateRoleResourceMapping from "../../frontend/src/components/Admin/UAC/AccessControl/RoleResourceMapping/CreateRoleResourceMapping";

import SearchDropdown from "../../frontend/src/components/Admin/UAC/AccessControl/RoleResourceMapping/SearchDropdown";
//user Resource
import CreateUserResourceMapping from "./components/Admin/UAC/AccessControl/UserResourceMapping/CreateUserResourceMapping";
import UserResourceMappingList from "./components/Admin/UAC/AccessControl/UserResourceMapping/UserResourceMappingList";

// Resource
import ListOfResources from "./components/Admin/UAC/Resource/ListOfResources";
import CreateResource from "./components/Admin/UAC/Resource/CreateResource";
import EditDisplayResource from "./components/Admin/UAC/Resource/EditResource";
import Landing from "./components/Public/Landing";
// here User details ( Search Card )-----------------------------------------------------------------------------
import Main_Body_Park_Details from "./components/Public/Search_Card/Main_Body_Park_Details";
import Sub_Park_Details from "./components/Public/Search_Card/Sub_Park_Details";
import PaymentHome from "./common/PaymentHome";
import ParkPayment from "./common/ParkPayment";
import Event_hostPage from "./components/Public/Event_Host/Event_hostPage";
import HostEvent from "./components/Public/UserProfile/HostEvent";

import Profile from "./components/Public/UserProfile/Profile";
import ProfileHistory from './components/Public/UserProfile/ProfileHistory';
import About from "./components/Public/About_And_FQA_PAGE/About";
import AddNewNotification from "./components/Admin/Activity/Notifications/AddNewNotification";
import ViewNotifications from "./components/Admin/Activity/Notifications/ViewNotifications";
import AdminLogin from "./components/Admin/Login";
import EventList from "./components/Public/Events/EventList";
import Details from "./components/Public/Events/Details";
import BookEvent from "./components/Public/Events/BookEvent";
// Add to card
import Add_Card from "./components/Public/Add_To_Card/AddCard";
function App() {
  let isAuthorized = sessionStorage.getItem("isAuthorized") || false;
  return (
    <>
      {/* PUBLIC SECTION */}
      <BrowserRouter>
        <div>
          {/* <AdminHeader /> */}
          <Routes>
            {/* HOME */}
            <Route path="/" element={<Landing />}/>
            <Route path="/facilities" element={<Main_Body_Park_Details />} />
            <Route path="/Event_hostPage" element={<Event_hostPage />} />
            <Route path="/Sub_Park_Details" element={<Sub_Park_Details />} />
            <Route path="/BookingDetails" element={<BookingDetails />} />
            <Route path="/About" element={<About/>} />
          
            {/* Public (Book Parks)  */}
            <Route
              path="/BookParks/Book_Now"
              element={
                <ProtectedRoute>
                  <Book_Now />
                </ProtectedRoute>
              }
            />
              {/* Public (Add to Crad)  */}
              <Route
              path="/BookParks/Add_Card"
              element={
                <ProtectedRoute>
                  <Add_Card/>
                </ProtectedRoute>
              }
            />
            {/* Public (Book Details)  */}
            <Route
              path="/profile/booking-details"
              element={
                <ProtectedRoute>
                  <BookingDetails />
                </ProtectedRoute>
              }
            />
            {/* Public (Favorites)  */}
            <Route
              path="/UserProfile/Favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            {/* Public (ProfileHistory)  */}
            <Route
              path="/UserProfile/ProfileHistory"
              element={
                <ProtectedRoute>
                  <ProfileHistory />
                </ProtectedRoute>
              }
            />

            {/* User-Profile */}
            <Route
              path="/Profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Public User Login */}
            <Route path="/login-signup" element={<Login />} />
            <Route path="/login/SignUp" element={<SignUp />} />
            {/* use Section  */}

            {/* Events */}
            <Route path="/events" element={<EventList />} />
            <Route path="/events-details" element={<Details />} />
            <Route path="/event-book" element={<BookEvent />} />

            {/* ADMIN SECTION - Login */}
            <Route path="/admin-login" element={<AdminLogin />} />
            {/* ADMIN SECTION - Activity */}

            <Route
              path="/Activity/ReviewUserRating"
              element={
                <ProtectedRoute>
                  <ReviewUserRating />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Activity/ReviewEventDetailsList"
              element={
                <ProtectedRoute>
                  <ReviewEventDetailsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Activity/AddNewNotification"
              element={
                <ProtectedRoute>
                  <AddNewNotification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Activity/ViewNotifications"
              element={
                <ProtectedRoute>
                  <ViewNotifications />
                </ProtectedRoute>
              }
            />
            {/* ADMIN SECTION - UAC*/}
            <Route
              path="/UAC/Resource/ListOfResources"
              element={
                <ProtectedRoute>
                  <ListOfResources />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UAC/Resource/CreateResource"
              element={
                <ProtectedRoute>
                  <CreateResource />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UAC/Resource/EditResource"
              element={
                <ProtectedRoute>
                  <EditResource />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UAC/Role/ListOfRoles"
              element={
                <ProtectedRoute>
                  <ListOfRoles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UAC/Role/CreateRole"
              element={
                <ProtectedRoute>
                  <CreateRole />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UAC/Role/EditRole"
              element={
                <ProtectedRoute>
                  <EditRole />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UAC/Users/ListOfUsers"
              element={
                <ProtectedRoute>
                  <ListOfUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UAC/Users/Create"
              element={
                <ProtectedRoute>
                  <CreateNewUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UAC/Users/Edit"
              element={
                <ProtectedRoute>
                  <EditUser />
                </ProtectedRoute>
              }
            />
            {/* Recource */}
            <Route
              path="/UAC/Resources/ListOfResources"
              element={
                <ProtectedRoute>
                  <ListOfResources />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UAC/Resources/CreateResource"
              element={
                <ProtectedRoute>
                  <CreateResource />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UAC/Resources/EditDisplayResource"
              element={
                <ProtectedRoute>
                  <EditDisplayResource />
                </ProtectedRoute>
              }
            />
            {/* user Recource */}
            <Route
              path="/UAC/Users/CreateUserResourceMapping"
              element={
                <ProtectedRoute>
                  <CreateUserResourceMapping />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UAC/Users/UserResourceMappingList"
              element={
                <ProtectedRoute>
                  <UserResourceMappingList />
                </ProtectedRoute>
              }
            />
            {/* Role-Resource mapping  */}
            <Route
              path="/UAC/RoleResource/Create"
              element={
                <ProtectedRoute>
                  <CreateRoleResourceMapping />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UAC/RoleResource/View"
              element={
                <ProtectedRoute>
                  <RoleResourceMappingList />
                </ProtectedRoute>
              }
            />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* DASHBOARD SECTION */}
            <Route
              path="/Dashboard/AdminDashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Payment-razorPay */}
            <Route
              path="/paymentSection"
              element={
                <ProtectedRoute>
                  <PaymentHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ParkPayment"
              element={
                <ProtectedRoute>
                  <ParkPayment />
                </ProtectedRoute>
              }
            />
          </Routes>
          {/* <Footer /> */}
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
