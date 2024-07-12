import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const accessRoutes = useSelector((state) => state.auth.accessRoutes) || JSON.parse(sessionStorage.getItem('accessRoutes'));
    const role = useSelector((state) => state.auth.roleId);
    let location = useLocation();
    let isAuthorized = false;
    console.log('access routes', accessRoutes);
    // for citizen role, don't check protected routes
    if(role == 4)
        return children;

    // console.log('access routes', accessRoutes);
    // check in parent resources
    accessRoutes?.forEach((route) => {
        // console.log(route);
        if (route.path == location.pathname) {
            isAuthorized = true;
            return;
        }
    });

    // check in child resources
    accessRoutes?.forEach((route) => {
        // console.log('route', route.children);
        if (route.children.length > 0) {
            // console.log(route.children)
            route.children.forEach((child) => {
                if(child.path == location.pathname) {
                    // console.log({isAuthorized: child.path == location.pathname})
                    isAuthorized = true;
                    return;
                }
            })
        }
    });

    // if (!isAuthorized) {
    //     return <Navigate to="/unauthorized" state={{ from: location }} replace />
    // }
    return children
};

export default ProtectedRoute;