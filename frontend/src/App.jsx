import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListOfRoles from "./components/Admin/UAC/Role/ListOfRoles";
import CreateRole from "./components/Admin/UAC/Role/CreateRole";
import EditRole from "./components/Admin/UAC/Role/EditRole";

//Public Header
// import PublicHeader from "./common/PublicHeader";
// Admin Header
import AdminHeader from "./common/AdminHeader";
// Import Footer
import Footer from "./common/Footer";
//import home page
import Home from "./components/Public/Home";
// Import here Partice Page
import ParticePage from "./components/Admin/MDM/FacilityRegistration/ParPage";

// here import list of resources
// import ListOfResources from './components/Admin/UAC/Resource/ListOfResources';
// here Import the role list table'
///
import CommonFrom from "./common/CommonFrom";

// Import common Table
import CommonTable from "./common/CommonTable";

import RoleResourceMappingList from "../../frontend/src/components/Admin/UAC/AccessControl/RoleResourceMapping/RoleResourceMappingList";

import CreateRoleResourceMapping from "../../frontend/src/components/Admin/UAC/AccessControl/RoleResourceMapping/CreateRoleResourceMapping";

import SearchDropdown from "../../frontend/src/components/Admin/UAC/AccessControl/RoleResourceMapping/SearchDropdown";

function App() {
  return (
    <>
      {/* PUBLIC SECTION */}
      <BrowserRouter>
        <div>
          {/* <PublicHeader /> */}

          <Routes>
            <Route path="/public/Home" element={<Home />} />
          </Routes>

          {/* ADMIN SECTION */}
          {/* <AdminHeader/> */}

          {/* dummy page */}
          <Routes>
            <Route path="/common/ParticePage" element={<ParticePage />} />
          </Routes>

          {/* here common  table */}
          <Routes>
            <Route path="/common/CommonTable" element={<CommonTable />} />
          </Routes>

          {/* here UAC */}
          <Routes>
            <Route path="/UAC/Role/ListOfRoles" element={<ListOfRoles />} />
          </Routes>

          {/* here UAC create role */}
          <Routes>
            <Route path="/UAC/Role/CreateRole" element={<CreateRole />} />
          </Routes>

          {/* here UAC create role */}
          <Routes>
            <Route path="/UAC/Role/EditRole" element={<EditRole />} />
          </Routes>

          {/* import commonfrom */}
          <Routes>
            <Route path="/Common/CommonFrom" element={<CommonFrom />} />
          </Routes>

          {/* here UAC create RoleResourceMappingList */}
          <Routes>
            <Route
              path="/UAC/AccessControl/RoleResourceMapping/RoleResourceMappingList"
              element={<RoleResourceMappingList />}
            />
          </Routes>

          {/* here UAC create CreateRoleResourceMapping */}
          <Routes>
            <Route
              path="/UAC/AccessControl/RoleResourceMapping/CreateRoleResourceMapping"
              element={<CreateRoleResourceMapping />}
            />
          </Routes>

          <Routes>
            <Route
              path="/UAC/AccessControl/RoleResourceMapping/SearchDropdown"
              element={<SearchDropdown />}
            />
          </Routes>

          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
