import React from "react";
import "./EditRoleResourceMapping.css";
import PublicHeader from "../../../../../common/AdminHeader";
import CommonFooter1 from "../../../../../common/Common_footer1";

const EditRoleResourceMapping = () => {
  return (
    <div className="parentEditRoleResMap">
      <PublicHeader />
      <div className="EditRoleResMap-form-heading2">
        <div className="editRoleResMapHead">
          <div className="editRoleResMapHeadIn">
            <div className="greenBar"></div>
            <h2>Edit Role Resource Mapping</h2>
          </div>
        </div>
        <div className="form-grid">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="input2">Resource Name</label>
              <input type="text" id="input2" placeholder="Full Name" />
            </div>
            <div className="form-group">
              <label htmlFor="input2">Resource Description</label>
              <input type="text" id="input2" placeholder="Description" />
            </div>

            <div className="form-group">
              <label htmlFor="input2">Status</label>
              <select id="input2" className="selectInput">
                <option value="" disabled selected>
                  Select Status
                </option>
                <option value="Role1">Active</option>
                <option value="Role2">Inactive</option>
              </select>
            </div>
          </div>
          {/* End of form-row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="input2">Parent Resource Name</label>
              <select id="input2" className="selectInput">
                <option value="" disabled selected>
                  Select
                </option>
                <option value="Role1">Masters</option>
                <option value="Role2">Super Master</option>
              </select>
            </div>
          </div>
          {/* End of form-row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="input2">Status</label>
              <select id="input2" className="selectInput">
                <option value="" disabled selected>
                  Select Status
                </option>
                <option value="Role1">Active</option>
                <option value="Role2">Inactive</option>
              </select>
            </div>
          </div>
          <div class="buttonContainer">
            <button class="customButton">Back</button>
            <button class="customButton">Update</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRoleResourceMapping;
