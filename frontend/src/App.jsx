import { useEffect, useState } from "react";
import instance from "../env";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoutes";
import ListOfRoles from "./components/Admin/UAC/Role/ListOfRoles";
import CreateRole from "./components/Admin/UAC/Role/CreateRole";
import EditRole from "./components/Admin/UAC/Role/EditRole";
import EditResource from "./components/Admin/UAC/Resource/EditResource";
import AdminDashboard from "./components/Admin/Dashboard/AdminDashboard";
//common table
import CommonTable from "./common/CommonTable";
import CommonFrom from "./common/CommonFrom";
import UnauthorizedPage from "./common/Unauthorized";
import ListOfUsers from "./components/Admin/UAC/User/ListOfUsers";
import CreateNewUser from "./components/Admin/UAC/User/CreateNewUser";
import EditUser from "./components/Admin/UAC/User/EditUser";
import ReviewUserRating from "./components/Admin/Activity/ReviewUserRating/ReviewUserRating";
import ReviewEventDetailsList from "./components/Admin/Activity/ReviewEventDetails/ReviewEventDetailsList";
//import public files here
import SignUp from "./components/Public/SignUp";
import Login from "./components/Public/Login";
import ForgotPassword from "./components/Public/Forgot_Password/ForgotPassword";
import Search_card from "./components/Public/Search_card";
//import BookParks files here
import Book_Now from "./components/Public/BookParks/Book_Now";
//User profile (Booking Details)
import BookingDetails from "./components/Public/UserProfile/BookingDetails";
//User profile (Favorites -USER PROFILE)
import Favorites from "./components/Public/UserProfile/Favorites";
import RoleResourceMappingList from "../../frontend/src/components/Admin/UAC/AccessControl/RoleResourceMapping/RoleResourceMappingList";
import CreateRoleResourceMapping from "../../frontend/src/components/Admin/UAC/AccessControl/RoleResourceMapping/CreateRoleResourceMapping";
import EditRoleResourceMapping from "../../frontend/src/components/Admin/UAC/AccessControl/RoleResourceMapping/EditRoleResourceMapping";
import SearchDropdown from "../../frontend/src/components/Admin/UAC/AccessControl/RoleResourceMapping/SearchDropdown";
//user Resource
import CreateUserResourceMapping from "./components/Admin/UAC/AccessControl/UserResourceMapping/CreateUserResourceMapping";
import EditUserResourceMapping from "./components/Admin/UAC/AccessControl/UserResourceMapping/EditUserResourceMapping";
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
import ProfileHistory from "./components/Public/UserProfile/ProfileHistory";
import About from "./components/Public/About_And_FQA_PAGE/About";
import History from "./components/Public/About_And_FQA_PAGE/History";
import Organogram from "./components/Public/About_And_FQA_PAGE/Organogram";
import Stakeholders from "./components/Public/About_And_FQA_PAGE/StakeHolder";
import FqaPage from "./components/Public/About_And_FQA_PAGE/FqaPage";
import StandOut from "./components/Public/About_And_FQA_PAGE/StandOut";
import AddNewNotification from "./components/Admin/Activity/Notifications/AddNewNotification";
import ViewNotifications from "./components/Admin/Activity/Notifications/ViewNotifications";
import AdminLogin from "./components/Admin/Login";
import EventList from "./components/Public/Events/EventList";
import Details from "./components/Public/Events/Details";
import BookEvent from "./components/Public/Events/BookEvent";
// Add to card
import AddToCart from "./components/Public/Add_To_Card/AddToCart";
import Book_Now_Sport from "./components/Public/BookParks/Book_Now_Sport";
import Book_Event from "./components/Public/BookParks/Book_Event";
// here PublicLoader
import PublicLoader from "./common/PublicLoader";
// here Gallery
import Image_Gallery from "./components/Public/View_Gallery/Image_Gallery";
//Here gallery for admin
import CreateNewGallery from "./components/Admin/Activity/Gallery/CreateNewGallery";
import ViewGalleryList from "./components/Admin/Activity/Gallery/ViewGalleryList";
// here Import Admin Page -----------------xxxx----------------------
import TariffDetails from "./components/Admin/MDM/Tariff/TariffDetails";
import ViewTariffList from "./components/Admin/MDM/Tariff/ViewTariffList";
import Tariff_View_Details from "./components/Admin/MDM/Tariff/Tariff_View_Details";
// import provider for connect to our app
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import ViewGrievanceList from "./components/Admin/Activity/Grievance/ViewGrievanceList";
import AssignGrievance from "./components/Admin/Activity/Grievance/AssignGrievance";
import ActionAgainstGrievance from "./components/Admin/Activity/Grievance/ActionAgainstGrievance";
import CommonFooter1 from "./common/Common_footer1";
import EditNotification from "./components/Admin/Activity/Notifications/EditNotification";
//Grievance
import Grievance from "./components/Public/FooterPages/Grievance";
// Booking_Bill
import Bokking_Bill from "./components/Public/Booking_Bill/Booking_Bill";
// Faclity Reg----------------
import Facility_Reg from "./components/Admin/Facility/Facility_Reg";
import Facility_Edit_View from "./components/Admin/Facility/Facility_Edit_View";
import AdminHeader from "./common/AdminHeader";
// import AdminHeader from "./common/AdminHeader";
import Facility_ViewList from "./components/Admin/Facility/Facility_ViewList";
import EventDetailsPage from './components/Admin/Activity/ReviewEventDetails/EventDetailsPage'
// import Conact Us Page-------------------------
import ContactUs from "./components/Public/FooterPages/ContactUs";
import Advertising_with_us from "./components/Public/FooterPages/Advertising_with_us";
// Terms and Condition ----------------------------------------
import Terms_ConditionPage from "./components/Public/FooterPages/Terms_ConditionPage";
import Disclaimer from "./components/Public/FooterPages/Disclaimer";
import Privacy_Policy from "./components/Public/FooterPages/Privacy_Policy";
import Partnerwithus from "./components/Public/FooterPages/PartnerWithUs";
import Gallery from "./components/Public/View_Gallery/Image_Gallery";
import SpecialEvent from "../src/components/Admin/Activity/SpecialEventBooking/SpecialEvent";
import ViewServicesList from "./components/Admin/MDM/Services/ViewServicesList";
import EditService from "./components/Admin/MDM/Services/EditService";
import CreateService from "./components/Admin/MDM/Services/CreateService";
import ViewAmenitiesList from "./components/Admin/MDM/AmenitiesMaster/ViewAmenitiesList";
import CreateNewAmenity from "./components/Admin/MDM/AmenitiesMaster/CreateNewAmenity";
import EditAmenity from "./components/Admin/MDM/AmenitiesMaster/EditAmenity";
import Activity_Preference_popup from './components/Public/BookParks/Popups_Book_now/Activity_Preference_popup'
import ViewInventoryList from "./components/Admin/MDM/InventoryMaster/ViewInventoryList";
import CreateInventory from "./components/Admin/MDM/InventoryMaster/CreateInventory";
import EditInventory from "./components/Admin/MDM/InventoryMaster/EditInventory";
import ViewEventCategoriesList from "./components/Admin/MDM/EventCategoriesMaster/ViewEventCategoriesList";
import CreateEventCategory from "./components/Admin/MDM/EventCategoriesMaster/CreateEventCategory";
import EditEventCategory from "./components/Admin/MDM/EventCategoriesMaster/EditEventCategory";
import ViewFacilityTypeList from "./components/Admin/MDM/FacilityTypeMaster/ViewFacilityTypeList";
import CreateFacilityType from "./components/Admin/MDM/FacilityTypeMaster/CreateFacilityType";
import EditFacilityType from "./components/Admin/MDM/FacilityTypeMaster/EditFacilityType";
import { ToastContainer } from "react-toastify";
import { AuthProvider, withAuth } from "./utils/ContextProvider/AuthContext";
import ViewStaffAllocation from "./components/Admin/Activity/FacilityStaffAllocation/ViewStaffAllocationList";
import CreateStaffAllocation from "./components/Admin/Activity/FacilityStaffAllocation/CreateStaffAllocation";
import EditStaffAllocation from "./components/Admin/Activity/FacilityStaffAllocation/EditStaffAllocation";

const ProtectedProfile = withAuth(Profile);

function App() {
  let isAuthorized = sessionStorage.getItem("isAuthorized") || false;

  return (
    <>
      {/* PUBLIC SECTION */}
      <Provider store={appStore}>
        <AuthProvider>
          <BrowserRouter basename={instance().baseName}>
            <div>
              <Routes>
                {/* USER PAGES ROUTES */}
                <Route path="/" element={<Landing />} />
                <Route path="/PublicLoader" element={<PublicLoader />} />
                <Route path="/facilities" element={<Main_Body_Park_Details />} />
                <Route path="/Event_hostPage" element={<Event_hostPage />} />
                <Route path="/Sub_Park_Details" element={<Sub_Park_Details />} />
                <Route path="/BookingDetails" element={<BookingDetails />} />
                <Route path="/About" element={<About />} />
                <Route path="/History" element={<History />} />
                <Route path="/Organogram" element={<Organogram />} />
                <Route path="/Stakeholders" element={<Stakeholders />} />
                <Route path="/StandOut" element={<StandOut />} />
                <Route path="/faqs" element={<FqaPage />} />
                <Route path="/Search_card" element={<Search_card />} />  { /* Overall search page */}
                {/* Booking summary page - Park, Playgrounds, Events */}
                <Route path="/BookParks/Book_Now" element={<Book_Now />} />
                <Route path="/BookParks/Book_Now_Sport" element={<Book_Now_Sport />} />
                <Route path="/BookEvent" element={<BookEvent />} />
                {/* Cart Details */}
                <Route path="/cart-details" element={<AddToCart />} />
                {/* User profile - Booking Details page */}
                <Route path="/Profile" element={<ProtectedProfile />} />
                <Route path="/profile/booking-details" element={<BookingDetails />} />
                <Route path="/UserProfile/Favorites" element={<Favorites />} />
                <Route path="/profile/booking-details/ticket" element={<Bokking_Bill />} />
                <Route path="/UserProfile/ProfileHistory" element={<ProfileHistory />} />

                {/* MDM - Facility master */}
                <Route path="/Facility_Edit_View" element={<ProtectedRoute><Facility_Edit_View /></ProtectedRoute>} />
                <Route path="/facility-registration" element={<ProtectedRoute><Facility_Reg /></ProtectedRoute>} />
                <Route path="/facility-viewlist" element={<ProtectedRoute><Facility_ViewList /></ProtectedRoute>} />

                {/* gallery section */}
                <Route
                  path="/View_Gallery/Image_Gallery"
                  element={
                    <Image_Gallery />
                  }
                />

                {/* Public User Login */}
                <Route path="/login-signup" element={<Login />} />
                <Route path="/login/SignUp" element={<SignUp />} />
                <Route path="/ForgotPassword" element={<ForgotPassword />} />

                {/* use Section  */}

                {/* Events */}
                <Route path="/events" element={<EventList />} />
                <Route path="/events-details" element={<Details />} />
                <Route path="/event-book" element={<Book_Event />} />

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
                  path="/Activity/EventDetailsPage"
                  element={
                    <ProtectedRoute>
                      <EventDetailsPage />
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
                <Route
                  path="/Activity/EditNotification"
                  element={
                    <ProtectedRoute>
                      <EditNotification />
                    </ProtectedRoute>
                  }
                />
                {/* Activity - Grievance START */}
                <Route
                  path="/activity/grievance"
                  element={
                    <ProtectedRoute>
                      <ViewGrievanceList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/activity/assign-grievance"
                  element={
                    <ProtectedRoute>
                      <AssignGrievance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/activity/grievance-action"
                  element={
                    <ProtectedRoute>
                      <ActionAgainstGrievance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/grievance-feedback-form"
                  element={
                    <ProtectedRoute>
                      <Grievance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Advertising_with_us"
                  element={
                    <ProtectedRoute>
                      <Advertising_with_us />
                    </ProtectedRoute>
                  }
                />

                {/* Activity - Grievance END */}
                <Route
                  path="/activity/gallery"
                  element={
                    <ProtectedRoute>
                      <CreateNewGallery />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/activity/ViewGalleryList"
                  element={
                    <ProtectedRoute>
                      <ViewGalleryList />
                    </ProtectedRoute>
                  }
                />
                {/* Activity Gallery Start */}
                {/* Activity Gallery end */}
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

                {/* Facility regd. */}
                <Route
                  path="/Facility/Facility_Reg"
                  element={
                    <ProtectedRoute>
                      <Facility_Reg />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Facility/Facility_ViewList"
                  element={
                    <ProtectedRoute>
                      <Facility_ViewList />
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
                  path="/UAC/Users/EditUserResourceMapping"
                  element={
                    <ProtectedRoute>
                      <EditUserResourceMapping />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/UAC/UserResource/View"
                  element={
                    <ProtectedRoute>
                      <UserResourceMappingList />
                    </ProtectedRoute>
                  }
                />
                {/* Role-Resource mapping  */}
                <Route
                  path="/UAC/RoleResource/CreateRoleResourceMapping"
                  element={
                    <ProtectedRoute>
                      <CreateRoleResourceMapping />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/UAC/RoleResource/EditRoleResourceMapping"
                  element={
                    <ProtectedRoute>
                      <EditRoleResourceMapping />
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
                {/* Admin Traiff Page */}
                <Route
                  path="/mdm/TariffDetails"
                  element={
                    <ProtectedRoute>
                      <TariffDetails />
                    </ProtectedRoute>
                  }
                />



                <Route
                  path="/mdm/ViewTariffList"
                  element={
                    <ProtectedRoute>
                      <ViewTariffList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mdm/Tariff_View_Details"
                  element={
                    <ProtectedRoute>
                      <Tariff_View_Details />
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
                <Route
                  path="/common/AdminHeader"
                  element={
                    <ProtectedRoute>
                      <AdminHeader />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/common/CommonFrom"
                  element={
                    <ProtectedRoute>
                      <CommonFrom />
                    </ProtectedRoute>
                  }
                />

                {/* Footer pages */}
                <Route
                  path="/ContactUs"
                  element={
                    <ProtectedRoute>
                      <ContactUs />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/Terms_ConditionPage"
                  element={
                    <ProtectedRoute>
                      <Terms_ConditionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Disclaimer"
                  element={
                    <ProtectedRoute>
                      < Disclaimer />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/Privacy_Policy"
                  element={
                    <ProtectedRoute>
                      <Privacy_Policy />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Partnerwithus"
                  element={
                    <ProtectedRoute>
                      <Partnerwithus />
                    </ProtectedRoute>
                  }
                />

                <Route path="/SpecialEvent" element={<ProtectedRoute><SpecialEvent /></ProtectedRoute>}/>
                {/** Master Data Management */}
                <Route path="/mdm/view-services" element={<ProtectedRoute><ViewServicesList /></ProtectedRoute>} />
                <Route path="/mdm/edit-services" element={<ProtectedRoute><EditService /></ProtectedRoute>} />
                <Route path="/mdm/create-services" element={<ProtectedRoute><CreateService /></ProtectedRoute>} />
                <Route path="/mdm/view-amenities" element={<ProtectedRoute><ViewAmenitiesList /></ProtectedRoute>} />
                <Route path="/mdm/create-amenities" element={<ProtectedRoute><CreateNewAmenity /></ProtectedRoute>} />
                <Route path="/mdm/edit-amenities" element={<ProtectedRoute><EditAmenity /></ProtectedRoute>} />
                <Route path="/mdm/view-inventory" element={<ProtectedRoute><ViewInventoryList /></ProtectedRoute>} />
                <Route path="/mdm/create-inventory" element={<ProtectedRoute><CreateInventory /></ProtectedRoute>} />
                <Route path="/mdm/edit-inventory" element={<ProtectedRoute><EditInventory /></ProtectedRoute>} />
                <Route path="/mdm/view-eventcategories" element={<ProtectedRoute><ViewEventCategoriesList /></ProtectedRoute>} />
                <Route path="/mdm/create-eventcategories" element={<ProtectedRoute><CreateEventCategory /></ProtectedRoute>} />
                <Route path="/mdm/edit-eventcategories" element={<ProtectedRoute><EditEventCategory /></ProtectedRoute>} />
                <Route path="/mdm/view-facility-type-list" element={<ProtectedRoute><ViewFacilityTypeList /></ProtectedRoute>} />
                <Route path="/mdm/create-facility-type-list" element={<ProtectedRoute><CreateFacilityType /></ProtectedRoute>} />
                <Route path="/mdm/edit-facility-type-list" element={<ProtectedRoute><EditFacilityType /></ProtectedRoute>} />
                <Route path="/activity/view-staff-allocation" element={<ViewStaffAllocation />} />
                <Route path="/activity/create-staff-allocation" element={<CreateStaffAllocation />} />
                <Route path="/activity/edit-staff-allocation" element={<EditStaffAllocation />} />
              </Routes>
              {/* <Footer /> */}
              <CommonFooter1 />
            </div>
            <ToastContainer />
          </BrowserRouter>
        </AuthProvider>
      </Provider>
    </>
  );
}

export default App;
