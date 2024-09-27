import { useEffect, useState } from "react";
import React from 'react'
import instance from "../env";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoutes";
const ListOfRoles = React.lazy(() => import('./components/Admin/UAC/Role/ListOfRoles'))
const CreateRole = React.lazy(() => import('./components/Admin/UAC/Role/CreateRole'))
const EditRole = React.lazy(() => import('./components/Admin/UAC/Role/EditRole'))
const EditResource = React.lazy(() => import('./components/Admin/UAC/Resource/EditResource'))
const AdminDashboard = React.lazy(() => import('./components/Admin/Dashboard/AdminDashboard'))
//common table
const CommonTable = React.lazy(() => import('./common/CommonTable'))
const CommonFrom = React.lazy(() => import('./common/CommonFrom'))
import UnauthorizedPage from "./common/Unauthorized";
const ListOfUsers = React.lazy(() => import('./components/Admin/UAC/User/ListOfUsers'))
const CreateNewUser = React.lazy(() => import('./components/Admin/UAC/User/CreateNewUser'))
const EditUser = React.lazy(() => import('./components/Admin/UAC/User/EditUser'))
const ReviewUserRating = React.lazy(() => import('./components/Admin/Activity/ReviewUserRating/ReviewUserRating'))
const ReviewEventDetailsList = React.lazy(() => import('./components/Admin/Activity/ReviewEventDetails/ReviewEventDetailsList'))
const SignUp = React.lazy(() => import('./components/Public/SignUp'))
const Login = React.lazy(() => import('./components/Public/Login'))
const ForgotPassword = React.lazy(() => import('./components/Public/Forgot_Password/ForgotPassword'))
const Search_card = React.lazy(() => import('./components/Public/Search_card'))
//import BookParks files here
const Book_Now = React.lazy(() => import('./components/Public/BookParks/Book_Now')) 
import Book_Now_Multipurposeground from "./components/Public/BookParks/Book_Now_Multipurposeground";
const ViewActivityList=React.lazy(()=>import('./components/Admin/MDM/ActivitiesMaster/ViewActivityList'))
const EditActivities=React.lazy(()=>import('./components/Admin/MDM/ActivitiesMaster/EditActivities'))
const CreateNewActivity=React.lazy(()=>import('./components/Admin/MDM/ActivitiesMaster/CreateNewActivity'))
//User profile (Booking Details)
const BookingDetails = React.lazy(() => import('./components/Public/UserProfile/BookingDetails'))
//User profile (Favorites -USER PROFILE)
const Favorites = React.lazy(() => import('./components/Public/UserProfile/Favorites'))
const RoleResourceMappingList = React.lazy(() => import('../../frontend/src/components/Admin/UAC/AccessControl/RoleResourceMapping/RoleResourceMappingList'))
const CreateRoleResourceMapping = React.lazy(() => import('../../frontend/src/components/Admin/UAC/AccessControl/RoleResourceMapping/CreateRoleResourceMapping'))
const EditRoleResourceMapping = React.lazy(() => import('../../frontend/src/components/Admin/UAC/AccessControl/RoleResourceMapping/EditRoleResourceMapping'))
const SearchDropdown = React.lazy(() => import('../../frontend/src/components/Admin/UAC/AccessControl/RoleResourceMapping/SearchDropdown'))
const CreateUserResourceMapping = React.lazy(() => import('./components/Admin/UAC/AccessControl/UserResourceMapping/CreateUserResourceMapping'))
const EditUserResourceMapping = React.lazy(() => import('./components/Admin/UAC/AccessControl/UserResourceMapping/EditUserResourceMapping'))
const UserResourceMappingList = React.lazy(() => import('./components/Admin/UAC/AccessControl/UserResourceMapping/UserResourceMappingList'))
// Resource
const ListOfResources = React.lazy(() => import('./components/Admin/UAC/Resource/ListOfResources'))
const CreateResource = React.lazy(() => import('./components/Admin/UAC/Resource/CreateResource'))
const EditDisplayResource = React.lazy(() => import('./components/Admin/UAC/Resource/EditResource'))
// import laoding
const Landing = React.lazy(() => import('./components/Public/Landing'))
// here User details ( Search Card )-----------------------------------------------------------------------------
const Main_Body_Park_Details = React.lazy(() => import('./components/Public/Search_Card/Main_Body_Park_Details'))
const Sub_Park_Details = React.lazy(() => import('./components/Public/Search_Card/Sub_Park_Details'))
const PaymentHome = React.lazy(() => import('./common/PaymentHome'))
const ParkPayment = React.lazy(() => import('./common/ParkPayment'))
const Event_hostPage = React.lazy(() => import('./components/Public/Event_Host/Event_hostPage'))
const HostEvent = React.lazy(() => import('./components/Public/UserProfile/HostEvent'))
const Profile = React.lazy(() => import('./components/Public/UserProfile/Profile'))
const ProfileHistory = React.lazy(() => import('./components/Public/UserProfile/ProfileHistory'))
const About = React.lazy(() => import('./components/Public/About_And_FQA_PAGE/About'))
const History = React.lazy(() => import('./components/Public/About_And_FQA_PAGE/History'))
const Organogram = React.lazy(() => import('./components/Public/About_And_FQA_PAGE/Organogram'))
const Stakeholders = React.lazy(() => import('./components/Public/About_And_FQA_PAGE/StakeHolder'))
const FqaPage = React.lazy(() => import('./components/Public/About_And_FQA_PAGE/FqaPage'))
const StandOut = React.lazy(() => import('./components/Public/About_And_FQA_PAGE/StandOut'))
const ScreenReader = React.lazy(() => import('./components/Public/About_And_FQA_PAGE/ScreenReader'))
const AddNewNotification = React.lazy(() => import('./components/Admin/Activity/Notifications/AddNewNotification'))
const ViewNotifications = React.lazy(() => import('./components/Admin/Activity/Notifications/ViewNotifications'))
const AdminLogin = React.lazy(() => import('./components/Admin/Login'))
const EventList = React.lazy(() => import('./components/Public/Events/EventList'))
const Details = React.lazy(() => import('./components/Public/Events/Details'))
const BookEvent = React.lazy(() => import('./components/Public/Events/BookEvent'))
// Add to card
const AddToCart = React.lazy(() => import('./components/Public/Add_To_Card/AddToCart'))
const Book_Now_Sport = React.lazy(() => import('./components/Public/BookParks/Book_Now_Sport'))
const Book_Event = React.lazy(() => import('./components/Public/BookParks/Book_Event'))
const BluewaysBookPage= React.lazy(()=>import('./components/Public/BookParks/BlueWayBookPage'))
// here PublicLoader
const PublicLoader = React.lazy(() => import('./common/PublicLoader'))
// here Gallery
const Image_Gallery = React.lazy(() => import('./components/Public/View_Gallery/Image_Gallery'))
//Here gallery for admin
const CreateNewGallery = React.lazy(() => import('./components/Admin/Activity/Gallery/CreateNewGallery'))
const ViewGalleryList = React.lazy(() => import('./components/Admin/Activity/Gallery/ViewGalleryList'))
// here Import Admin Page -----------------xxxx----------------------
const TariffDetails = React.lazy(() => import('./components/Admin/MDM/Tariff/TariffDetails'))
const ViewTariffList = React.lazy(() => import('./components/Admin/MDM/Tariff/ViewTariffList'))
const Tariff_View_Details = React.lazy(() => import('./components/Admin/MDM/Tariff/Tariff_View_Details'))
const ViewGrievanceList = React.lazy(() => import('./components/Admin/Activity/Grievance/ViewGrievanceList'))
const AssignGrievance = React.lazy(() => import('./components/Admin/Activity/Grievance/AssignGrievance'))
const ActionAgainstGrievance = React.lazy(() => import('./components/Admin/Activity/Grievance/ActionAgainstGrievance'))
const CommonFooter1 = React.lazy(() => import('./common/Common_footer1'))
const EditNotification = React.lazy(() => import('./components/Admin/Activity/Notifications/EditNotification'))
//Grievance
const Grievance = React.lazy(() => import('./components/Public/FooterPages/Grievance'))
// Booking_Bill
const Bokking_Bill = React.lazy(() => import('./components/Public/Booking_Bill/Booking_Bill'))
// Faclity Reg----------------
const Facility_Reg = React.lazy(() => import('./components/Admin/Facility/Facility_Reg'))
const Facility_Edit_View = React.lazy(() => import('./components/Admin/Facility/Facility_Edit_View'))
const AdminHeader = React.lazy(() => import('./common/AdminHeader'))
const Facility_ViewList = React.lazy(() => import('./components/Admin/Facility/Facility_ViewList'))
const EventDetailsPage = React.lazy(() => import('./components/Admin/Activity/ReviewEventDetails/EventDetailsPage'))
// import Conact Us Page-------------------------
const ContactUs = React.lazy(() => import('./components/Public/FooterPages/ContactUs'))
const Advertising_with_us = React.lazy(() => import('./components/Public/FooterPages/Advertising_with_us'))
// Terms and Condition ----------------------------------------
const Terms_ConditionPage = React.lazy(() => import('./components/Public/FooterPages/Terms_ConditionPage'))
const Disclaimer = React.lazy(() => import('./components/Public/FooterPages/Disclaimer'))
const Privacy_Policy = React.lazy(() => import('./components/Public/FooterPages/Privacy_Policy'))
const DosDont = React.lazy(() => import('./components/Public/FooterPages/DosDont'))
const Partnerwithus = React.lazy(() => import('./components/Public/FooterPages/PartnerWithUs'))
const Gallery = React.lazy(() => import('./components/Public/View_Gallery/Image_Gallery'))
const SpecialEvent = React.lazy(() => import('../src/components/Admin/Activity/SpecialEventBooking/SpecialEvent'))
const ViewServicesList = React.lazy(() => import('./components/Admin/MDM/Services/ViewServicesList'));
const EditService = React.lazy(() => import('./components/Admin/MDM/Services/EditService'))
const CreateService = React.lazy(() => import('./components/Admin/MDM/Services/CreateService'))
const ViewAmenitiesList = React.lazy(() => import('./components/Admin/MDM/AmenitiesMaster/ViewAmenitiesList'))
const CreateNewAmenity = React.lazy(() => import('./components/Admin/MDM/AmenitiesMaster/CreateNewAmenity'))
const EditAmenity = React.lazy(() => import('./components/Admin/MDM/AmenitiesMaster/EditAmenity'))
const Activity_Preference_popup = React.lazy(() => import('./components/Public/BookParks/Popups_Book_now/Activity_Preference_popup'))
const ViewInventoryList = React.lazy(() => import('./components/Admin/MDM/InventoryMaster/ViewInventoryList'))
const CreateInventory = React.lazy(() => import('./components/Admin/MDM/InventoryMaster/CreateInventory'))
const EditInventory = React.lazy(() => import('./components/Admin/MDM/InventoryMaster/EditInventory'))
const ViewEventCategoriesList = React.lazy(() => import('./components/Admin/MDM/EventCategoriesMaster/ViewEventCategoriesList'))
const CreateEventCategory = React.lazy(() => import('./components/Admin/MDM/EventCategoriesMaster/CreateEventCategory'))
const EditEventCategory = React.lazy(() => import('./components/Admin/MDM/EventCategoriesMaster/EditEventCategory'))
const ViewFacilityTypeList = React.lazy(() => import('./components/Admin/MDM/FacilityTypeMaster/ViewFacilityTypeList'))
const CreateFacilityType = React.lazy(() => import('./components/Admin/MDM/FacilityTypeMaster/CreateFacilityType'))
const EditFacilityType = React.lazy(() => import('./components/Admin/MDM/FacilityTypeMaster/EditFacilityType'))
const ViewStaffAllocation = React.lazy(() => import('./components/Admin/Activity/FacilityStaffAllocation/ViewStaffAllocationList'))
const CreateStaffAllocation = React.lazy(() => import('./components/Admin/Activity/FacilityStaffAllocation/CreateStaffAllocation'))
const EditStaffAllocation = React.lazy(() => import('./components/Admin/Activity/FacilityStaffAllocation/EditStaffAllocation'))
const GreenwaysBookingPage=React.lazy(()=>import('./components/Public/BookParks/GreenWaysBookingPage'))
// Emp_Attendance 
const Emp_Attendance=React.lazy(()=>import("./components/Admin/Emp_Attendance/Emp_Attendance"))
const Emp_Details_List=React.lazy(()=>import('./components/Admin/Emp_Attendance/Emp_Details_List'))
// Report section ----------------------
const Emp_List_Report=React.lazy(()=>import('./components/Admin/Reports/Emp_List_Report'))
//Advertisement
const CreateAdvertisement = React.lazy(() => import('./components/Admin/MDM/Advertisement/CreateAdvertisement'))
const ViewAdvertisements = React.lazy(() => import('./components/Admin/MDM/Advertisement/ViewAdvertisements'))
const UpdateAdvertisement = React.lazy(() => import('./components/Admin/MDM/Advertisement/UpdateAdvertisement'))
//Advertisement Tariff
const ViewAdvertisementTariffList = React.lazy(() => import('./components/Admin/MDM/AdvertisementTariffMaster/ViewAdvertisementTariffList'))
const CreateAdvertisementTariff = React.lazy(() => import('./components/Admin/MDM/AdvertisementTariffMaster/CreateAdvertisementTariff'))
const EditAdvertisementTariff = React.lazy(() => import('./components/Admin/MDM/AdvertisementTariffMaster/EditAdvertisementTariff'))
///
import { ToastContainer } from "react-toastify";
import { AuthProvider, withAuth } from "./utils/ContextProvider/AuthContext";
// import provider for connect to our app
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
// Import classic Loader -----------
import ClassicLoader from "./common/ClassicLoader";
const ProtectedProfile = withAuth(Profile);
function App() {
  let isAuthorized = sessionStorage.getItem("isAuthorized") || false;
  return (
    <>
      {/* PUBLIC SECTION */}
      <AuthProvider>
        <Provider store={appStore}>
          <BrowserRouter basename={instance().baseName}>
            <div>
              <Routes>
                {/* HOME */}
                <Route path="/" element={<React.Suspense fallback={<ClassicLoader/>}><Landing /></React.Suspense>} />
                {/* Facility_Reg and View_edit */}
                <Route path="/Facility_Edit_View" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><Facility_Edit_View /></ProtectedRoute></React.Suspense>} />
                <Route path="/facility-registration" element={<React.Suspense fallback={<ClassicLoader/>} ><ProtectedRoute><Facility_Reg /></ProtectedRoute></React.Suspense>} />
                <Route path="/facility-viewlist" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><Facility_ViewList /></ProtectedRoute></React.Suspense>} />
                <Route path="/PublicLoader" element={<React.Suspense fallback={<ClassicLoader/>}><PublicLoader /></React.Suspense>} />
                <Route path="/facilities" element={<React.Suspense fallback={<ClassicLoader/>}><Main_Body_Park_Details /></React.Suspense>} />
                <Route path="/Event_hostPage" element={<React.Suspense fallback={<ClassicLoader/>}><Event_hostPage /></React.Suspense>} />
                <Route path="/Sub_Park_Details" element={<React.Suspense fallback={<ClassicLoader/>}><Sub_Park_Details /></React.Suspense>} />
                <Route path="/BookingDetails" element={<React.Suspense fallback={<ClassicLoader/>}><BookingDetails /></React.Suspense>} />
                <Route path="/About" element={<React.Suspense fallback={<ClassicLoader/>}><About /></React.Suspense>} />
                <Route path="/screen-reader-access" element={<React.Suspense fallback={<ClassicLoader/>}><ScreenReader /></React.Suspense>} />
                <Route path="/History" element={<React.Suspense fallback={<ClassicLoader/>}> <History /></React.Suspense>} />
                <Route path="/Organogram" element={<React.Suspense fallback={<ClassicLoader/>}><Organogram /></React.Suspense>} />
                <Route path="/Stakeholders" element={<React.Suspense fallback={<ClassicLoader/>}><Stakeholders /></React.Suspense>} />
                <Route path="/StandOut" element={<React.Suspense fallback={<ClassicLoader/>}><StandOut /></React.Suspense>} />
                <Route path="/faqs" element={<React.Suspense fallback={<ClassicLoader/>}><FqaPage /></React.Suspense>} />
                {/* Search by place name  */}
                <Route path="/Search_card" element={<React.Suspense fallback={<ClassicLoader/>}><Search_card /></React.Suspense>} />
                <Route path="/BookParks/Book_Now_Sport" element={<React.Suspense fallback={<ClassicLoader/>}><Book_Now_Sport /></React.Suspense>} />
                <Route path="/Book_Now_Multipurposeground" element={<React.Suspense fallback={<ClassicLoader/>}><Book_Now_Multipurposeground /></React.Suspense>} />
                {/* Public (sport)  */}
                <Route path="/GreenwaysBookingPage" element={<React.Suspense fallback={<ClassicLoader/>}><GreenwaysBookingPage/></React.Suspense>} />
                <Route path="/BookParks/Book_Now" element={<React.Suspense fallback={<ClassicLoader/>}><Book_Now /></React.Suspense>} />
                <Route path="/BluewaysBookPage" element={<React.Suspense fallback={<ClassicLoader/>}><BluewaysBookPage /></React.Suspense>} />
                <Route path="/BookEvent" element={<React.Suspense fallback={<ClassicLoader/>}><BookEvent /></React.Suspense>} />
                {/* Public (Add to Crad)  */}
                <Route path="/cart-details" element={<React.Suspense fallback={<ClassicLoader/>}><AddToCart /></React.Suspense>} />
                <Route path="/profile/booking-details/ticket" element={<React.Suspense fallback={<ClassicLoader/>}><Bokking_Bill /></React.Suspense>} />
                {/* Public (Book Details)  */}
                <Route path="/profile/booking-details" element={<React.Suspense fallback={<ClassicLoader/>}> <BookingDetails /></React.Suspense>} />
                {/* Public (Favorites)  */}
                <Route path="/UserProfile/Favorites" element={<React.Suspense fallback={<ClassicLoader/>}><Favorites /></React.Suspense>} />
                {/* Public (ProfileHistory)  */}
                <Route path="/UserProfile/ProfileHistory" element={<React.Suspense fallback={<ClassicLoader/>}> <ProfileHistory /></React.Suspense>} />
                {/* User-Profile */}
                <Route path="/Profile" element={<React.Suspense fallback={<ClassicLoader/>}><Profile /></React.Suspense>} />
                {/* gallery section */}
                <Route path="/View_Gallery/Image_Gallery" element={<React.Suspense fallback={<ClassicLoader/>}> <Image_Gallery /></React.Suspense>} />
                {/* Public User Login */}
                <Route path="/login-signup" element={<React.Suspense fallback={<ClassicLoader/>}> <Login /></React.Suspense>} />
                <Route path="/login/SignUp" element={<React.Suspense fallback={<ClassicLoader/>}><SignUp /></React.Suspense>} />
                <Route path="/ForgotPassword" element={<React.Suspense fallback={<ClassicLoader/>}><ForgotPassword /> </React.Suspense>} />
                {/* use Section  */}
                {/* Events */}
                <Route path="/events" element={<React.Suspense fallback="Loading page ..."><EventList /> </React.Suspense>} />
                <Route path="/event-book" element={<React.Suspense fallback="Loading page ..."> <Book_Event /></React.Suspense>} />
                <Route path="/events-details" element={<React.Suspense fallback="Loading page ..."> <Details /></React.Suspense>} />
                {/* ADMIN SECTION - Login */}
                <Route path="/admin-login" element={<React.Suspense fallback={<ClassicLoader/>} ><AdminLogin /></React.Suspense>} />
                {/* ADMIN SECTION - Activity */}
                <Route path="/Activity/ReviewUserRating" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><ReviewUserRating /></ProtectedRoute></React.Suspense>} />
                <Route path="/Activity/ReviewEventDetailsList" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><ReviewEventDetailsList /></ProtectedRoute></React.Suspense>} />
                <Route path="/Activity/EventDetailsPage" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><EventDetailsPage /></ProtectedRoute></React.Suspense>} />
                <Route path="/Activity/AddNewNotification" element={<React.Suspense fallback={<ClassicLoader/>}> <ProtectedRoute> <AddNewNotification /> </ProtectedRoute> </React.Suspense>} />
                <Route path="/Activity/ViewNotifications" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><ViewNotifications /></ProtectedRoute></React.Suspense>} />
                <Route path="/Activity/EditNotification" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><EditNotification /></ProtectedRoute></React.Suspense>} />
                {/* Activity - Grievance START */}
                <Route path="/activity/grievance" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><ViewGrievanceList /></ProtectedRoute> </React.Suspense>} />
                <Route path="/activity/assign-grievance" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><AssignGrievance /></ProtectedRoute></React.Suspense>} />
                <Route path="/activity/grievance-action" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><ActionAgainstGrievance /></ProtectedRoute></React.Suspense>} />
                <Route path="/grievance-feedback-form" element={<React.Suspense fallback={<ClassicLoader/>}> <ProtectedRoute><Grievance /></ProtectedRoute></React.Suspense>} />
                <Route path="/Advertising_with_us" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><Advertising_with_us /></ProtectedRoute></React.Suspense>} />
                {/* Advertisement */}
                <Route path="/MDM/CreateAdvertisement" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><CreateAdvertisement /></ProtectedRoute></React.Suspense>} />
                <Route path="/MDM/ViewAdvertisements" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><ViewAdvertisements /></ProtectedRoute></React.Suspense>} />
                <Route path="/MDM/UpdateAdvertisement" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><UpdateAdvertisement /></ProtectedRoute></React.Suspense>} />
                {/* Activity - Grievance END */}
                <Route path="/activity/gallery" element={<React.Suspense fallback={<ClassicLoader/>}> <ProtectedRoute><CreateNewGallery /></ProtectedRoute></React.Suspense>} />
                <Route path="/activity/ViewGalleryList" element={<React.Suspense fallback={<ClassicLoader/>}> <ProtectedRoute> <ViewGalleryList /></ProtectedRoute></React.Suspense>} />
                <Route path="/UAC/Resource/ListOfResources" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><ListOfResources /></ProtectedRoute></React.Suspense>} />
                <Route path="/UAC/Resource/CreateResource" element={<React.Suspense fallback={<ClassicLoader/>}> <ProtectedRoute> <CreateResource /></ProtectedRoute></React.Suspense>} />
                <Route path="/UAC/Resource/EditResource" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><EditResource /></ProtectedRoute></React.Suspense>} />
                <Route path="/UAC/Role/ListOfRoles" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute> <ListOfRoles /> </ProtectedRoute> </React.Suspense>} />
                <Route path="/UAC/Role/CreateRole" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute> <CreateRole /></ProtectedRoute></React.Suspense>} />
                <Route path="/UAC/Role/EditRole" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute> <EditRole /> </ProtectedRoute></React.Suspense>} />
                <Route path="/UAC/Users/ListOfUsers" element={<React.Suspense fallback={<ClassicLoader/>}> <ProtectedRoute><ListOfUsers /></ProtectedRoute></React.Suspense>} />
                <Route path="/UAC/Users/Create" element={<React.Suspense fallback={<ClassicLoader/>}> <ProtectedRoute> <CreateNewUser /></ProtectedRoute></React.Suspense>} />
                <Route path="/UAC/Users/Edit" element={<React.Suspense fallback={<ClassicLoader/>}> <ProtectedRoute> <EditUser /> </ProtectedRoute></React.Suspense>} />
                {/* Facility regd. */}
                <Route path="/Facility/Facility_Reg" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><Facility_Reg /> </ProtectedRoute></React.Suspense>} />
                <Route path="/Facility/Facility_ViewList" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><Facility_ViewList /></ProtectedRoute></React.Suspense>} />
                {/* Recource */}
                <Route path="/UAC/Resources/ListOfResources" element={<React.Suspense fallback={<ClassicLoader/>}> <ProtectedRoute> <ListOfResources /> </ProtectedRoute></React.Suspense>} />
                <Route path="/UAC/Resources/CreateResource" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute> <CreateResource /> </ProtectedRoute></React.Suspense>} />
                <Route path="/UAC/Resources/EditDisplayResource" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><EditDisplayResource /></ProtectedRoute></React.Suspense>} />
                {/* user Recource */}
                <Route path="/UAC/Users/CreateUserResourceMapping" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute> <CreateUserResourceMapping /></ProtectedRoute></React.Suspense>} />
                <Route path="/UAC/Users/EditUserResourceMapping" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><EditUserResourceMapping /> </ProtectedRoute> </React.Suspense>} />
                <Route path="/UAC/UserResource/View" element={<React.Suspense fallback={<ClassicLoader/>}> <ProtectedRoute><UserResourceMappingList /></ProtectedRoute></React.Suspense>} />
                {/* Role-Resource mapping  */}
                <Route path="/UAC/RoleResource/CreateRoleResourceMapping" element={<React.Suspense fallback={<ClassicLoader/>}> <ProtectedRoute><CreateRoleResourceMapping /> </ProtectedRoute></React.Suspense>} />
                <Route path="/UAC/RoleResource/EditRoleResourceMapping" element={<React.Suspense fallback={<ClassicLoader/>}> <ProtectedRoute><EditRoleResourceMapping /></ProtectedRoute></React.Suspense>} />
                <Route path="/UAC/RoleResource/View" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><RoleResourceMappingList /></ProtectedRoute></React.Suspense>} />
                <Route path="/unauthorized" element={<React.Suspense fallback={<ClassicLoader/>}> <UnauthorizedPage /> </React.Suspense>} />
                {/* DASHBOARD SECTION */}
                <Route path="/Dashboard/AdminDashboard" element={<React.Suspense fallback={<ClassicLoader/>}> <ProtectedRoute><AdminDashboard /></ProtectedRoute></React.Suspense>} />
                {/* Payment-razorPay */}
                <Route path="/paymentSection" element={<React.Suspense fallback={<ClassicLoader/>}> <ProtectedRoute> <PaymentHome /></ProtectedRoute></React.Suspense>} />
                {/* Admin Traiff Page */}
                <Route path="/mdm/TariffDetails" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute> <TariffDetails /></ProtectedRoute></React.Suspense>} />
                <Route path="/mdm/ViewTariffList" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><ViewTariffList /></ProtectedRoute></React.Suspense>} />
                <Route path="/mdm/Tariff_View_Details" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><Tariff_View_Details /> </ProtectedRoute></React.Suspense>} />
                <Route path="/ParkPayment" element={<React.Suspense fallback={<ClassicLoader/>}> <ProtectedRoute><ParkPayment /> </ProtectedRoute></React.Suspense>} />
                <Route path="/common/AdminHeader" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><AdminHeader /></ProtectedRoute></React.Suspense>} />
                <Route path="/common/CommonFrom" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><CommonFrom /></ProtectedRoute></React.Suspense>} />
                {/* Footer pages */}
                <Route path="/ContactUs" element={<React.Suspense fallback={<ClassicLoader/>}> <ProtectedRoute><ContactUs /></ProtectedRoute></React.Suspense>} />
                <Route path="/Terms_ConditionPage" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute> <Terms_ConditionPage /> </ProtectedRoute></React.Suspense>} />
                <Route path="/Disclaimer" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute>< Disclaimer /></ProtectedRoute></React.Suspense>} />
                <Route path="/Privacy_Policy" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><Privacy_Policy /> </ProtectedRoute> </React.Suspense>} />
                <Route path="/DosDont" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><DosDont /> </ProtectedRoute> </React.Suspense>}/>
                <Route path="/Partnerwithus" element={<React.Suspense fallback={<ClassicLoader/>}> <ProtectedRoute><Partnerwithus /></ProtectedRoute></React.Suspense>} />
                <Route path="/activity/special-event-booking" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><SpecialEvent /></ProtectedRoute></React.Suspense>} />
                {/** Master Data Management */}
                <Route path="/mdm/view-services" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><ViewServicesList /></ProtectedRoute></React.Suspense>} />
                <Route path="/mdm/edit-services" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><EditService /></ProtectedRoute> </React.Suspense>} />
                <Route path="/mdm/create-services" element={<React.Suspense fallback={<ClassicLoader/>}> <ProtectedRoute><CreateService /></ProtectedRoute></React.Suspense>} />
                <Route path="/mdm/view-amenities" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><ViewAmenitiesList /></ProtectedRoute></React.Suspense>} />
                <Route path="/mdm/create-amenities" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><CreateNewAmenity /></ProtectedRoute></React.Suspense>} />
                <Route path="/mdm/edit-amenities" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><EditAmenity /></ProtectedRoute></React.Suspense>} />
                <Route path="/mdm/view-inventory" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><ViewInventoryList /></ProtectedRoute></React.Suspense>} />
                <Route path="/mdm/create-inventory" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><CreateInventory /></ProtectedRoute></React.Suspense>} />
                <Route path="/mdm/edit-inventory" element={<React.Suspense fallback={<ClassicLoader/>}> <ProtectedRoute><EditInventory /></ProtectedRoute></React.Suspense>} />
                <Route path="/mdm/view-eventcategories" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><ViewEventCategoriesList /></ProtectedRoute></React.Suspense>} />
                <Route path="/mdm/create-eventcategories" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><CreateEventCategory /></ProtectedRoute></React.Suspense>} />
                <Route path="/mdm/edit-eventcategories" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><EditEventCategory /></ProtectedRoute></React.Suspense>} />
                <Route path="/mdm/view-facility-type-list" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><ViewFacilityTypeList /></ProtectedRoute></React.Suspense>} />
                <Route path="/mdm/create-facility-type-list" element={<React.Suspense fallback={<ClassicLoader/>}><ProtectedRoute><CreateFacilityType /></ProtectedRoute></React.Suspense>} />
                <Route path="/mdm/edit-facility-type-list" element={<React.Suspense fallback={<ClassicLoader/>}> <ProtectedRoute><EditFacilityType /></ProtectedRoute></React.Suspense>} />
                <Route path="/activity/view-staff-allocation" element={<React.Suspense fallback={<ClassicLoader/>}> <ViewStaffAllocation /> </React.Suspense>} />
                <Route path="/activity/create-staff-allocation" element={<React.Suspense fallback={<ClassicLoader/>}><CreateStaffAllocation /> </React.Suspense>} />
                <Route path="/activity/edit-staff-allocation" element={<React.Suspense fallback={<ClassicLoader/>}><EditStaffAllocation /> </React.Suspense>} />
                <Route path="/EditActivities" element={<React.Suspense fallback={<ClassicLoader/>}><EditActivities /> </React.Suspense>} />
                <Route path="/ViewActivityList" element={<React.Suspense fallback={<ClassicLoader/>}><ViewActivityList /> </React.Suspense>} />
                <Route path="/CreateNewActivity" element={<React.Suspense fallback={<ClassicLoader/>}><CreateNewActivity /> </React.Suspense>} />
                <Route path="/activity/Emp_Attendance" element={<React.Suspense fallback={<ClassicLoader/>}><Emp_Attendance/></React.Suspense>} />
                <Route path="/activity/Emp_Details_List" element={<React.Suspense fallback={<ClassicLoader/>}><Emp_Details_List/></React.Suspense>} />
                {/* Report section  */}
                <Route path="/Emp_List_Report" element={<React.Suspense fallback={<ClassicLoader/>}><Emp_List_Report/></React.Suspense>} />
                <Route path="/mdm/ViewAdvertisementTariffList" element={<React.Suspense fallback={<ClassicLoader />}><ViewAdvertisementTariffList/></React.Suspense>} />
                <Route path="/mdm/CreateAdvertisementTariff" element={<React.Suspense fallback={<ClassicLoader />}><CreateAdvertisementTariff/></React.Suspense>} />
                <Route path="/mdm/EditAdvertisementTariff" element={<React.Suspense fallback={<ClassicLoader />}><EditAdvertisementTariff/></React.Suspense>} />
              </Routes>
              <CommonFooter1 />
            </div>
            <ToastContainer />
          </BrowserRouter>
        </Provider>
      </AuthProvider>
    </>
  );
}
export default App;
