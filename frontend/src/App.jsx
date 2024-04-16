import { useState } from 'react'
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoutes';
import ListOfRoles from './components/Admin/UAC/Role/ListOfRoles';
import CreateRole from './components/Admin/UAC/Role/CreateRole';
import EditRole from './components/Admin/UAC/Role/EditRole';
import UnauthorizedPage from './common/Unauthorized';
import ListOfUsers from './components/Admin/UAC/User/ListOfUsers';
import CreateNewUser from './components/Admin/UAC/User/CreateNewUser';
import EditUser from './components/Admin/UAC/User/EditUser';
import ReviewUserRating from './components/Admin/Activity/ReviewUserRating/ReviewUserRating';
import ReviewEventDetailsList from './components/Admin/Activity/ReviewEventDetails/ReviewEventDetailsList';
import EventDetailsPage from './components/Admin/Activity/ReviewEventDetails/EventDetailsPage';

//Public Header
// import PublicHeader from "./common/PublicHeader";
// Admin Header
import AdminHeader from './common/AdminHeader';
// Import Footer 
import Footer from './common/Footer';
//import home page
import Home from './components/Public/Home';
// Import here Partice Page
import ParticePage from "./components/Admin/MDM/FacilityRegistration/ParPage";

// here import list of resources
// import ListOfResources from './components/Admin/UAC/Resource/ListOfResources';
// here Import the role list table'



import RoleResourceMappingList from "../../frontend/src/components/Admin/UAC/AccessControl/RoleResourceMapping/RoleResourceMappingList";

import CreateRoleResourceMapping from "../../frontend/src/components/Admin/UAC/AccessControl/RoleResourceMapping/CreateRoleResourceMapping";

import SearchDropdown from "../../frontend/src/components/Admin/UAC/AccessControl/RoleResourceMapping/SearchDropdown";

function App() {
  let isAuthorized = sessionStorage.getItem('isAuthorized') || false;
  return (
    <>
      {/* PUBLIC SECTION */}
      <BrowserRouter>
        <div>
          {/* <AdminHeader /> */}
          <Routes>
            {/* HOME */}
            <Route path='/' element={<Home />} />
            {/* ADMIN SECTION - Activity */}
            <Route path='/Activity/ReviewUserRating' element={<ProtectedRoute><ReviewUserRating /></ProtectedRoute>} />
            <Route path='/Activity/ReviewEventDetailsList' element={<ProtectedRoute><ReviewEventDetailsList /></ProtectedRoute>} />
            <Route path='/Activity/EventDetailsPage' element={<ProtectedRoute><EventDetailsPage /></ProtectedRoute>} />
            {/* ADMIN SECTION - UAC*/}
            <Route path='/UAC/Role/ListOfRoles' element={<ProtectedRoute><ListOfRoles /></ProtectedRoute>} />
            <Route path='/UAC/Role/CreateRole' element={<ProtectedRoute><CreateRole /></ProtectedRoute>} />
            <Route path='/UAC/Role/EditRole' element={<ProtectedRoute><EditRole /></ProtectedRoute>} />
            <Route path='/UAC/Users/ListOfUsers' element={<ProtectedRoute><ListOfUsers /></ProtectedRoute>} />
            <Route path='/UAC/Users/Create' element={<ProtectedRoute><CreateNewUser /></ProtectedRoute>} />
            <Route path='/UAC/Users/Edit' element={<ProtectedRoute><EditUser /></ProtectedRoute>} />
            <Route path='/unauthorized' element={<UnauthorizedPage />} />
          </Routes>
          {/* <Footer /> */}
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
