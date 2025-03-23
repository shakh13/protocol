import {Outlet, Navigate} from "react-router-dom";

const ProtectedAdminRoute = () => {
    let token = localStorage.getItem("token");
    let isAdmin = localStorage.getItem("isAdmin") === 'true';

    return (
        token
            ? (isAdmin ? <Outlet/> : window.location.href = '/protocols')
            : window.location.href = '/'
    );
}

const ProtectedPersonalRoute = () => {
    let token = localStorage.getItem("token");
    let isAdmin = localStorage.getItem("isAdmin") === 'true';

    return (
        isAdmin === true ? window.location.href = '/admin' :
            token ? <Outlet/> : window.location.href = '/'
    );
}

export {ProtectedAdminRoute, ProtectedPersonalRoute};