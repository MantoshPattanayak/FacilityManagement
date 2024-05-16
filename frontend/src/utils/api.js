// to be maintained by backend developers

const api = {
    LANGUAGE_RESOURCE_API: '/languageContent/view', //post  language - EN or OD
    PUBLIC_LOGIN_API: '/auth/publicLogin',
    PUBLIC_SIGNUP_API: '/auth/signUp',
    PUBLIC_SIGNUP_GENERATE_OTP_API: '/auth/generateOTP',    // post - encryptMobile
    PUBLIC_SIGNUP_VERIFY_OTP_API: '/auth/verifyOTP ',   // post - encryptOtp
    MAP_DISPLAY_DATA: '/mapData/displayMapData',
    MAP_SEARCH: '/mapData/searchParkFacilities',
     PROFILE_DATA_VIEW_API: '/publicUser/viewpublicUser', // post
     PROFILE_DATA_UPDATE_API: '/publicUser/updatepublic_user', // put publicUserId, title, firstName, middleName, lastName, userName, password, phoneNo, altPhoneNo, emailId, profilePicture, lastLogin,
    //  Event_Host Api -------------------------------------
      Bank_details_Api:'/hosteventdetails/bankService', // get
      Create_Host_event:'/hosteventdetails/createHosteventdetails',  // post
    // Add to Cart----------------------------------------
       Add_to_Cart:'/booking/addToCart',  // Post
       View_Card_UserId:'/booking/viewCartByUserId', // Get
       Update_Card:'/booking/updateCart', // Put


    // Park_Booking(Search) Page
     View_Park_Data:'/mapData/viewParkDetails',
     View_By_ParkId:'/mapData/viewParkById',        
     VIEW_NEARBY_PARKS_API: '/mapData/nearByDataInMap',     //post    latitude,longitude,facilityTypeId,range
    // Recourece Api
    RESOURCE_VIEW_BY_ID_API: '/resource/resourceId', //get /resource//resourceId/:id
    RESOURCE_CREATE_API: '/resource/createResource',    //POST
    RESOURCE_UPDATE_API: '/resource/updateResource',    //PUT
    RESOURCE_VIEWLIST_API: '/resource/viewResources',   //POST
    RESOURCE_NAME_DROPDOWN:'/resource/isParent', // GET
    // here Search Loaction Api
    SearchLoaction_map:'/mapData/searchParkFacilities',
    //User-Resource
    USER_RESOURCE_DATALOAD_API: '/userResource/dataLoad', //get
    USER_RESOURCE_CREATE_API: '/userResource/insertUserResource', //post
    USER_RESOURCE_VIEW_API: '/userResource/viewUserResource', //get
    USER_RESOURCE_AUTOSUGGEST_API: '/userResource/autoSuggestionUserResource', //get
    //User
    ADMIN_USER_CREATE_API: '/userDetails/createUser', //post
    ADMIN_USER_VIEW_BY_ID_API: '/userDetails/getUserById',   //get /userDetails/getUserById/:id
    ADMIN_USER_VIEW_API: '/userDetails/viewList',   //post
    ADMIN_USER_INITIALDATA_API: '/userDetails/fetchInitialData',    //get
    ADMIN_USER_UPDATE_API: '/userDetails/updateUserData',   //put
    ADMIN_USER_AUTOSUGGEST_API: '/userDetails/autoSuggestionForUserSearch/',   //get /userDetails/autoSuggestionForUserSearch/:givenReq
    //Role
    ROLE_VIEW_BY_ID_API: '/role/',   //get /role/:roleId
    ROLE_UPDATE_API: '/role/updateRole/',  //put /role/update-profile/:id
    ROLE_CREATE_API: '/role/createRole',    //post
    ROLE_VIEW_API:'/role/viewRole/', //post /role/view
    //Role-Resource
    ROLE_RESOURCE_DATALOAD_API: '/roleResource/dataLoad', //get
    ROLE_RESOURCE_CREATE_API: '/roleResource/insertRoleResource',   //post
    ROLE_RESOURCE_VIEW_API: '/roleResource/viewRoleResource',   //get
    ROLE_RESOURCE_AUTOSUGGEST_API: '/roleResource/autoSuggestionRoleResource',    //get /roleResource/autoSuggestionRoleResource/:givenReq
    ROLE_RESOURCE_UPDATE_API: '/roleResource/updateRoleResource',   //put   /roleResource/updateRoleResource/:id
    ROLE_RESOURCE_VIEW_BY_ID_API: '/roleResource/',   //get   /roleResource/viewId/:id
    //Review Event Booking
    REVIEW_EVENTS_VIEWLIST_API: '/reviewEvents/viewList',   //post
    REVIEW_EVENTS_VIEW_BY_ID_API: '/reviewEvents/viewId',   //get /reviewEvents/viewId/id
    REVIEW_EVENTS_PERFORM_APPROVE_REJECT_API: '/reviewEvents/performAction', //put /reviewEvents/performAction/id
    // Public Notifications
    VIEW_NOTIFICATIONS_LIST_API: '/publicNotifications/viewList', //post givenReq page_size page_number currentDate
    ADD_NOTIFICATIONS_API: '/publicNotifications/add',  //post  notificationTitle, notificationContent, validFromDate, validToDate
     ADD_BOOKMARK_API: '/userDetails/bookmarkingAddAction',  //post - facilityId or eventId depending on record type (either parks, or events)
     REMOVE_BOOKMARK_API: '/userDetails/bookmarkingRemoveAction',    //post - bookmarkId
     VIEW_BOOKMARKS_LIST_API: '/userDetails/viewBookmarks',      //post - facilityType, fromDate, toDate

    //PARK-BOOK API
    PARK_BOOK_PAGE_SUBMIT_API: '/booking/park',  //post 
    PARK_BOOK_PAGE_INITIALDATA_API: '/booking/park-book-initialdata',   //get
    // User Loging/singUp-------------------------------
    User_Login:'/auth/publicLogin',    // Post
    User_SingUp:'/auth/signUp',
   //User profile
   VIEW_BOOKINGS_API: '/userDetails/profile/viewBookings', //post fromDate, toDate, bookingStatus, facilityType, sortingOrder
   FETCH_BOOKINGS_INITIAL_FILTERDATA_API: '/userDetails/profile/initalFilterDataForBooking',   //get

   //EVENTS Section
   VIEW_EVENTS_LIST_API: '/eventactivites/viewEventactivities',   // post givenReq
}

export default api;