import React from "react";
import "./EditRoleResourceMapping.css";

const EditRoleResourceMapping = () => {
  return (
    <div>
      <div className="form-heading">
        <div className="heading">
          <h2>Edit Resources</h2>
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

            <div className="form-group checkBox">
              <input type="checkbox" className="checkbox" />
              <label htmlFor="checkbox3" className="checkboxLabel">
                Checkbox 3
              </label>
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
              <label htmlFor="input2">Path</label>
              <input type="text" id="input2" placeholder="URL" />
            </div>
            <div className="form-group">
              <label htmlFor="input2">Show in Order</label>
              <input type="text" id="input2" placeholder="Total" />
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
        </div>
      </div>
    </div>
  );
};

export default EditRoleResourceMapping;
