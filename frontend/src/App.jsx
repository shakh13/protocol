import * as React from 'react'
import './App.css'
import {Route, Routes} from 'react-router-dom';
import LoginPage from "./pages/auth/login_page.jsx";
import Navbar from "./components/navbar.jsx";
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
import BuildingsPage from "./pages/personal/buildings_page.jsx";
import ClientsPage from "./pages/personal/clients_page.jsx";
import CreatePage from "./pages/personal/create_page.jsx";
import Protocol from "./pages/protocol.jsx";
import ProtocolPage from "./pages/personal/protocol_page.jsx";
import BuildingPage from "./pages/personal/building_page.jsx";
import ClientPage from "./pages/personal/client_page.jsx";
import AdminProtocol from "./pages/admin/admin_protocol.jsx";
import NotFoundPage from "./pages/not_found_page.jsx";

export default function App() {
    const noNavBar = location.pathname === "/register"
        || location.pathname === "/"
        || location.pathname.includes("password")
        || location.pathname === "/protocol-pdf";

    return (
        <>
            <Navbar noNavBar={noNavBar} content={
                <Routes>
                    <Route path="/protocol-pdf" element={<Protocol/>}/>
                    <Route path="/" element={<LoginPage/>}/>
                    <Route element={<ProtectedPersonalRoute/>}>
                        <Route path="/clients" element={<ClientsPage/>}/>
                        <Route path="/client/:id" element={<ClientPage/>}/>
                        <Route path="/protocols" element={<ProtocolsPage/>}/>
                        <Route path="/protocol/:id" element={<ProtocolPage/>}/>
                        <Route path="/requests" element={<RequestPage/>}/>
                        <Route path="/buildings" element={<BuildingsPage/>}/>
                        <Route path="/building/:id" element={<BuildingPage/>}/>
                        <Route path="/create" element={<CreatePage/>}/>
                    </Route>
                    <Route element={<ProtectedAdminRoute/>}>
                        <Route path="/admin" element={<AdminNotifications/>}/>
                        <Route path="/admin/employees" element={<AdminEmployees/>}/>
                        <Route path="/admin/employee/:id" element={<AdminEmployee/>}/>
                        <Route path="/admin/positions" element={<AdminPositions/>}/>
                        <Route path="/admin/protocols" element={<AdminProtocols/>}/>
                        <Route path="/admin/protocol/:id" element={<AdminProtocol/>}/>
                        <Route path="/admin/clients" element={<AdminClients/>}/>
                        <Route path="/admin/client/:id" element={<AdminClient/>}/>
                        <Route path="/admin/building/:id" element={<AdminBuilding/>}/>
                        <Route path="/admin/machines" element={<AdminMachines/>}/>
                        <Route path="/admin/certificates" element={<AdminCertificates/>}/>
                        <Route path="/admin/settings" element={<AdminSettings/>}/>
                    </Route>
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            }/>
        </>
    )
}
