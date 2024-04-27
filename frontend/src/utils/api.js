// to be maintained by backend developers

const api = {
    LOGIN_API: '/auth/login',
    SIGNUP_API: '/auth/signup',
    MAP_DISPLAY_DATA: '/mapData/displayMapData',
    MAP_SEARCH: '/mapData/searchParkFacilities',

    // Park_Booking(Search) Page
     View_Park_Data:'/mapData/viewParkDetails',
      View_By_ParkId:'/mapData/viewParkById',          
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
    REVIEW_EVENTS_PERFORM_APPROVE_REJECT_API: '/reviewEvents/performAction' //put /reviewEvents/performAction/id
}

export default api;