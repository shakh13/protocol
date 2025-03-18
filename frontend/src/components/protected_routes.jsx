import {Outlet, Navigate} from "react-router-dom";
import AxiosInstance from "./axios_instance.jsx";

const ProtectedAdminRoute = () => {
    let token = localStorage.getItem("token");
    let isAdmin = localStorage.getItem("isAdmin") === 'true';

    return (
        token
            ? (isAdmin ? <Outlet/> : <Navigate to='/protocols'/>)
            : <Navigate to={'/'}/>
    );
}

const ProtectedPersonalRoute = () => {
    let token = localStorage.getItem("token");
    let isAdmin = localStorage.getItem("isAdmin") === 'true';

    return (
        isAdmin === true ? <Navigate to={"/admin"}/> :
            token ? <Outlet/> : <Navigate to="/"/>
    );
}

export {ProtectedAdminRoute, ProtectedPersonalRoute};