// to be maintained by backend developers
const api = {
   LANGUAGE_RESOURCE_API: '/languageContent/view', //post  language - EN or OD
   REFRESH_TOKEN_API: '/auth/refresh-token',
   PUBLIC_LOGIN_API: '/auth/publicLogin',
   PUBLIC_SIGNUP_API: '/auth/signUp',
   LOGOUT_API: '/auth/logout',  //post
   FORGOT_PASSWORD_API: '/auth/forgotPassword', //put  mobileNo password
   PUBLIC_SIGNUP_GENERATE_OTP_API: '/auth/generateOTP',    // post - encryptMobile
   PUBLIC_SIGNUP_VERIFY_OTP_API: '/auth/verifyOTP ',   // post - encryptOtp
   PRIVATE_LOGIN_VERIFY_OTP_API: '/userDetails/verifyOTPHandlerWithGenerateTokenForAdmin',   //post  encryptMobile  encryptOtp
   MAP_DISPLAY_DATA: '/mapData/displayMapData',
   OVERALL_SEARCH_DATA_API:'/mapData/findOverallSearch',  // overall search data ----- method-- get method parma giveReq
   AUTO_SUGGEST_OVERALL_API: '/mapData/autoSuggestionForOverallSearch',  //post givenReq
   MAP_SEARCH: '/mapData/searchParkFacilities',
   PROFILE_DATA_VIEW_API: '/publicUser/viewpublicUser', // post
   PROFILE_DATA_UPDATE_API: '/publicUser/updatepublic_user', // put publicUserId, title, firstName, middleName, lastName, userName, password, phoneNo, altPhoneNo, emailId, profilePicture, lastLogin,
   //  Event_Host Api -------------------------------------
   Bank_details_Api: '/hosteventdetails/bankService', // get
   Create_Host_event: '/hosteventdetails/createHosteventdetails',  // post
   Get_initail_Data_Facility_Type:'/hosteventdetails/eventDropdown', // post 
   // Add to Cart----------------------------------------
   Add_to_Cart: '/booking/addToCart',  // Post
   View_Card_UserId: '/booking/viewCartByUserId', // Get
   Update_Card: '/booking/updateCart', // Put
   //  Landing page Api......................................
   LandingApi: '/publicUser/homePage',
   GOOGLE_MAPS_API: '/publicUser/fetchGoogleMap', //post apiKey
   //Admin login
   ADMIN_LOGIN_API: '/auth/privateLogin',    //post = encryptMobile or encryptEmail, encryptPassword
   // Park_Booking(Search) Page
   View_Park_Data: '/mapData/viewParkDetails',
   View_By_ParkId: '/mapData/viewParkById',
   VIEW_NEARBY_PARKS_API: '/mapData/nearByDataInMap',     //post    latitude,longitude,facilityTypeId,range
   VIEW_FILTER_OPTIONS_API: '/mapData/filterList',     //get
   // Recourece Api
   RESOURCE_VIEW_BY_ID_API: '/resource/resourceId', //get /resource//resourceId/:id
   RESOURCE_CREATE_API: '/resource/createResource',    //POST
   RESOURCE_UPDATE_API: '/resource/updateResource',    //PUT
   RESOURCE_VIEWLIST_API: '/resource/viewResources',   //POST
   RESOURCE_NAME_DROPDOWN: '/resource/isParent', // GET
   // here Search Loaction Api
   SearchLoaction_map: '/mapData/searchParkFacilities',
   //User-Resource
   USER_RESOURCE_DATALOAD_API: '/userResource/dataLoad', //get
   USER_RESOURCE_CREATE_API: '/userResource/insertUserResource', //post
   USER_RESOURCE_VIEW_API: '/userResource/viewUserResource', //post
   USER_RESOURCE_AUTOSUGGEST_API: '/userResource/autoSuggestionUserResource', //get
   //User
   ADMIN_USER_CREATE_API: '/userDetails/createUser', //post
   ADMIN_USER_VIEW_BY_ID_API: '/userDetails/getUserById',   //get /userDetails/getUserById/:id
   ADMIN_USER_VIEW_API: '/userDetails/viewList',   //post
   ADMIN_USER_INITIALDATA_API: '/userDetails/fetchInitialData',    //get
   ADMIN_USER_UPDATE_API: '/userDetails/updateUserData',   //put
   ADMIN_USER_AUTOSUGGEST_API: '/userDetails/autoSuggestionForUserSearch/',   //get /userDetails/autoSuggestionForUserSearch/:givenReq
   //Role
   ROLE_VIEW_BY_ID_API: '/role/roleId',   //get /roleId/:roleId
   ROLE_UPDATE_API: '/role/updateRole/',  //put /role/update-profile/:id
   ROLE_CREATE_API: '/role/createRole',    //post
   ROLE_VIEW_API: '/role/viewRole/', //post /role/view
   //Role-Resource
   ROLE_RESOURCE_DATALOAD_API: '/roleResource/dataLoad', //get
   ROLE_RESOURCE_CREATE_API: '/roleResource/insertRoleResource',   //post
   ROLE_RESOURCE_VIEW_API: '/roleResource/viewRoleResource',   //get
   ROLE_RESOURCE_AUTOSUGGEST_API: '/roleResource/autoSuggestionRoleResource',    //get /roleResource/autoSuggestionRoleResource/:givenReq
   ROLE_RESOURCE_UPDATE_API: '/roleResource/updateRoleResource',   //put   /roleResource/updateRoleResource/:id
   ROLE_RESOURCE_VIEW_BY_ID_API: '/roleResource/viewId',   //get   /roleResource/viewId/:id
   //Review Event Booking
   REVIEW_EVENTS_VIEWLIST_API: '/reviewEvents/viewList',   //post
   REVIEW_EVENTS_VIEW_BY_ID_API: '/reviewEvents/viewId',   //get /reviewEvents/viewId/id
   REVIEW_EVENTS_PERFORM_APPROVE_REJECT_API: '/reviewEvents/performAction', //put /reviewEvents/performAction/id
   // Public Notifications
   VIEW_NOTIFICATIONS_LIST_API: '/publicNotifications/viewList', //post givenReq page_size page_number currentDate
   ADD_NOTIFICATIONS_API: '/publicNotifications/add',  //post  notificationTitle, notificationContent, validFromDate, validToDate
   VIEW_NOTIFICATION_DETAILS_API: '/publicNotifications/view', //get notificationId
   EDIT_NOTIFICATION_DETAILS_API: '/publicNotifications/edit',   //put notificationTitle, notificationContent, validFromDate, validToDate, publicNotificationsId
   // bookmarks
   ADD_BOOKMARK_API: '/userDetails/bookmarkingAddAction',  //post - facilityId or eventId depending on record type (either parks, or events)
   REMOVE_BOOKMARK_API: '/userDetails/bookmarkingRemoveAction',    //post - bookmarkId
   VIEW_BOOKMARKS_LIST_API: '/userDetails/viewBookmarks',      //post - facilityType, fromDate, toDate
   //PARK-BOOK API
   PARK_BOOK_PAGE_SUBMIT_API: '/booking/park',  //post 
   PARK_BOOK_PAGE_INITIALDATA_API: '/booking/park-book-initialdata',   //get
   // User Loging/singUp-------------------------------
   User_Login: '/auth/publicLogin',    // Post
   User_SingUp: '/auth/signUp',
   //User profile
   VIEW_BOOKINGS_API: '/userDetails/profile/viewBookings', //post fromDate, toDate, bookingStatus, facilityType, sortingOrder
   FETCH_BOOKINGS_INITIAL_FILTERDATA_API: '/userDetails/profile/initalFilterDataForBooking',   //get
   //EVENTS Section
   VIEW_EVENTS_LIST_API: '/eventactivites/viewEventactivities',   // post givenReq
   VIEW_EVENT_BY_ID_API: '/eventactivites/viewEventactivitiesById', // get eventId
   // Here Ticket Bill Api ----------------------
   VIEW_TICKET_BILL_API: '/booking/generateQRCode', //post
   // Get Facility Initail Data Admin--------------------
   Get_Facility_Intail_Data:'/adminFacility/initialData', // get Method
   Facility_Reg_Api:'/adminFacility/facilityRegistration', // Post Method
   Facility_Update_View_By_ID_Api:'/adminFacility/getFacilityWrtId', //Post Method \
   Facility_Update_Api:'/adminFacility/updateFacility', //Put Method
   //grievance-feedback for user
   GRIEVANCE_INITIAL_DATA_API: '/grievance/initial-data',  //get
   USER_SUBMIT_GRIEVANCE_API: '/grievance/submit-grievance',   //post   fullname, emailId, phoneNo, subject, details, statusId, filepath, isWhatsappNumber
   USER_SUBMIT_FEEDBACK_API: '/grievance/createFeedback',      //post   name, mobile, email, subject, feedback, isWhatsappNumber
   //grievance-feedback for admin
   ADMIN_VIEW_GRIEVANCE_LIST_API: '/grievance/viewgrievancelist',    //post   page_size, page_number, givenReq
   ADMIN_ACTION_GRIEVANCE_API: '/grievance/action-grievance',  //post grievanceMasterId, response, filepath
   ADMIN_VIEW_GRIEVANCE_BY_ID_API: '/grievance/viewgrievance', //get          params - grievanceId
   ADMIN_VIEW_FEEDBACK_LIST: '/grievance/viewfeedbacklist',   // post  givenReq
   ADMIN_VIEW_FEEDBACK_BY_ID: '/grievance/viewfeedback',   // ---- get       in req.params - feedbackId
   // admin-dashboard
   ADMIN_DASHBOARD_FETCH_API: '/auth/admin-dashboard',   //post    facilityId
   // Tariff Api (MDM)
   View_Tariff_List_Api:'/tariffData/viewTariff', // Post Method
   Create_Tariff_Details_Api: '/tariffData/createTariff ', // Post Method
   Initial_Data_Tariff_Details:'/tariffData/initialDataForTariffSelectionWRTCategory', //post
   VIEW_TARIFF_DATA_BY_ID_API:'/tariffData/getTariffById', //post
   Update_Tariff_Data:'/tariffData/updateTariff', //Put
   Delete_Tariff_Data:'/tariffData/inActiveEachTariffData', //Post
   // SERVICES MASTER (MDM)
   VIEW_SERVICES_LIST_API: '/services/viewServicesList', //post givenReq
   CREATE_NEW_SERVICE_API: '/services/createService', //post code, description
   VIEW_SERVICE_BY_ID_API: '/services/viewServiceById', //get :serviceId
   UPDATE_SERVICE_API: '/services/updateService', //put code, description, serviceId, statusId
   // AMENITIES MASTER (MDM)
   VIEW_AMENITIES_LIST_API: '/amenities/viewAmenitiesList', //post givenReq
   CREATE_NEW_AMENITY_API: '/amenities/createAmenity', //post code, description
   VIEW_AMENITY_BY_ID_API: '/amenities/viewAmenityById', //get :serviceId
   UPDATE_AMENITY_API: '/amenities/updateAmenity', //put code, description, serviceId, statusId
   // INVENTORY MASTER (MDM)
   VIEW_INVENTORIES_LIST_API: '/inventories/viewInventoryList', //post givenReq
   CREATE_NEW_INVENTORY_API: '/inventories/createInventory', //post code, description
   VIEW_INVENTORY_BY_ID_API: '/inventories/viewInventoryById', //get :equipmentId
   UPDATE_INVENTORY_API: '/inventories/updateInventory', //put code, description, equipmentId, statusId
   // EVENT CATEGORIES MASTER (MDM)
   VIEW_EVENTCATEGORIES_LIST_API: '/eventcategories/viewEventCategoriesList', //post givenReq
   CREATE_NEW_EVENTCATEGORY_API: '/eventcategories/createEventCategory', //post eventCategoryName, description
   VIEW_EVENTCATEGORY_BY_ID_API: '/eventcategories/viewEventCategoryById', //get :eventCategoryId
   UPDATE_EVENTCATEGORY_API: '/eventcategories/updateEventCategory', //put eventCategoryName, description, eventCategoryId, statusId
   // FACILITY TYPE MASTER (MDM)
   VIEW_FACILITYTYPE_LIST_API: '/facilitytype/viewFacilityTypeList', //post givenReq
   CREATE_NEW_FACILITYTYPE_API: '/facilitytype/createFacilityType', //post code, description
   VIEW_FACILITYTYPE_BY_ID_API: '/facilitytype/viewFacilityTypeById', //get :facilityTypeId
   UPDATE_FACILITYTYPE_API: '/facilitytype/updateFacilityType', //put code, description, facilityTypeId, statusId
   // PAYMENT
   FETCH_RAZORPAY_API_KEY: '/razorPayPayment/getRazorpayApiKeys', //get
   CREATE_RAZORPAY_ORDER_API: '/razorPayPayment/checkout',    // post amount
   RAZORPAY_PAYMENT_VERIFICATION: '/razorPayPayment/paymentVerification',  //post 
   //GALLERY ADMIN
   ADD_NEW_GALLERY_DATA_API: '/gallery/insertNewGalleryRecord',   //post description, fileAttachment: {name: '', data: ''}
   FETCH_GALLERY_LIST_DATA_API: '/gallery/fetchGalleryList',   //post page_size, page_number
   FETCH_GALLERY_DATA_BY_ID_API: '/gallery/fetchGalleryById',  //get :galleryId
   UPDATE_GALLERY_DATA_API: '/gallery/updateGalleryRecord', //put :galleryId --- description, fileAttachment: {name: '', data: ''}
   /// here footer pages api like contact with us, pathner with us...etc
   contact_with_us_api:'/grievance/contactUs',
   // Facility staff allocation
   VIEW_STAFF_ALLOCATION_LIST_API: '/facilityStaff/viewStaffAllocation',  //post page_size, page_number
   VIEW_STAFF_ALLOCATION_DATA_API: '/facilityStaff/viewStaffAllocationById',  //post page_size, page_number
   CREATE_STAFF_ALLOCATION_API: '/facilityStaff/createFacilityStaffAllocation',  //post
   UPDATE_STAFF_ALLOCATION_LIST_API: '/facilityStaff/updateFacilityStaffAllocation',   //post
   UPLOAD_STAFF_ATTENDANCE_API: '/facilityStaff/uploadStaffAttendance', //post
   FETCH_INITIAL_DATA_FOR_STAFFALLOCATION: '/facilityStaff/initialData',   // get
   // User activity master
   VIEW_USER_ACTIVITY_LIST_API: '/userActivity/viewUserActivitiesList',  //post page_size, page_number, givenReq
   VIEW_USER_ACTIVITY_DATA_API: '/userActivity/viewUserActivityById',  //get
   CREATE_USER_ACTIVITY_API: '/userActivity/createUserActivity',  //post   userActivityName, facilityTypeId
   UPDATE_USER_ACTIVITY_LIST_API: '/userActivity/updateUserActivity',   //post  userActivityName, facilityTypeId, userActivityId, statusId
   FETCH_INITIAL_DATA_FOR_USER_ACTIVITY: '/userActivity/initialData',   // get
}

export default api;