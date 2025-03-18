import * as React from 'react'
import './App.css'
import {Route, Routes} from 'react-router-dom';
import LoginPage from "./pages/auth/login_page.jsx";
import Navbar from "./components/navbar.jsx";
import CustomersPage from "./pages/personal/customers_page.jsx";
import ProtocolsPage from "./pages/personal/protocols_page.jsx";
import RequestPage from "./pages/personal/requests_page.jsx";
import AdminEmployees from "./pages/admin/admin_employees.jsx";
import AdminNotifications from "./pages/admin/admin_notifications.jsx";
import AdminPositions from "./pages/admin/admin_positions.jsx";
import AdminClients from "./pages/admin/admin_clients.jsx";
import AdminClient from "./pages/admin/admin_client.jsx";
import AdminBuilding from "./pages/admin/admin_building.jsx";
import AdminMachines from "./pages/admin/admin_machines.jsx";
import AdminCertificates from "./pages/admin/admin_certificates.jsx";
import AdminSettings from "./pages/admin/admin_settings.jsx";
import AdminProtocols from "./pages/admin/admin_protocols.jsx";
import AdminEmployee from "./pages/admin/admin_employee.jsx";
import {ProtectedAdminRoute, ProtectedPersonalRoute} from "./components/protected_routes.jsx";


export default function App() {
    const noNavBar = location.pathname === "/register"
        || location.pathname === "/"
        || location.pathname.includes("password");

    return (
        <>
            <Navbar noNavBar={noNavBar} content={
                <Routes>
                    <Route path="/" element={<LoginPage/>}/>
                    <Route element={<ProtectedPersonalRoute/>}>
                        <Route path="/customers" element={<CustomersPage/>}/>
                        <Route path="/protocols" element={<ProtocolsPage/>}/>
                        <Route path="/requests" element={<RequestPage/>}/>
                    </Route>
                    <Route element={<ProtectedAdminRoute/>}>
                        <Route path="/admin" element={<AdminNotifications/>}/>
                        <Route path="/admin/employees" element={<AdminEmployees/>}/>
                        <Route path="/admin/employee/:id" element={<AdminEmployee/>}/>
                        <Route path="/admin/positions" element={<AdminPositions/>}/>
                        <Route path="/admin/protocols" element={<AdminProtocols/>}/>
                        <Route path="/admin/clients" element={<AdminClients/>}/>
                        <Route path="/admin/client/:id" element={<AdminClient/>}/>
                        <Route path="/admin/building/:id" element={<AdminBuilding/>}/>
                        <Route path="/admin/machines" element={<AdminMachines/>}/>
                        <Route path="/admin/certificates" element={<AdminCertificates/>}/>
                        <Route path="/admin/settings" element={<AdminSettings/>}/>
                    </Route>
                </Routes>
            }/>
        </>
    )
}
