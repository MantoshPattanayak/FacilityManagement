import React from 'react'
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({children}) => {
    // const user = useSelector((state) => state.user);
    let location = useLocation();

    console.log({location, });

    const accessRoutes = [
        {
            resourceName: 'Home',
            path: '/'
        },
        {
            resourceName: 'Profile',
            path: '/profile'
        },
        {
            resourceName: 'List of Roles',
            path: '/UAC/Role/ListOfRoles'
        }
    ];

    let isAuthorized = false;

    accessRoutes.forEach((route, index) => {
        console.log(route);
        if(route.path == location.pathname){
            isAuthorized = true;
            return;
        }
    })

    sessionStorage.setItem('isAuthorized', isAuthorized);

    if(!isAuthorized) {
        return <Navigate to="/unauthorized" state={{ from: location}} replace />
    }
 return children
};

export default ProtectedRoute;