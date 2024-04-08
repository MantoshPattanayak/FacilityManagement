import React, { useRef, useState } from "react";
import "./CreateRoleResourceMapping.css";
import SearchDropdown from "./SearchDropdown";

const CreateRoleResourceMapping = () => {
  return (
    <div className="container-parent">
      <div className="headingHeader">
        <div className="heading">
          <h1 className="heading-title">Create Role Resource Mapping</h1>
        </div>
      </div>

      <div className="create-role-resource-mapping-container">
        <div className="left-container">
          {/* Sample content */}
          <input type="checkbox" className="checkbox" />
          <label htmlFor="checkbox1">Checkbox 1</label>
          <br />
          <input type="checkbox" className="checkbox" />
          <label htmlFor="checkbox2">Checkbox 2</label>
          <br />
          <div className="ChildCheckBox">
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            {/* Add more checkboxes and text as needed */}
          </div>
        </div>
        <div className="right-container">
          {/* Dropdown component goes here */}
          <SearchDropdown />
        </div>
      </div>
    </div>
  );
};

export default CreateRoleResourceMapping;
