import React from "react";
import "./CreateNewUser.css";
const CreateNewUser = () => {
  return (
    <div>
      <div className="form-heading">
        <div className="heading">
          <h2>Heading 1</h2>
        </div>
        <div className="form-grid">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="input1">Title</label>
              <select id="input1" className="selectInput">
                <option value="" disabled selected>
                  Select a title
                </option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="input2">Full Name</label>
              <input type="text" id="input2" placeholder="Full Name" />
            </div>
            <div className="form-group">
              <label htmlFor="input3">User Name</label>
              <input type="text" id="input3" placeholder="User Name" />
            </div>
          </div>
          {/* End of form-row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="input1">Mobile Number</label>
              <input type="text" id="input1" placeholder="Mobile Number" />
            </div>

            <div className="form-group">
              <label htmlFor="input2">Role</label>
              <select id="input2" className="selectInput">
                <option value="" disabled selected>
                  Select a Role
                </option>
                <option value="Role1">Role1</option>
                <option value="Role2">Role2</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="input3">Email Id</label>
              <input type="text" id="input3" placeholder="Input 3" />
            </div>
          </div>
          {/* End of form-row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="input2">Status</label>
              <select id="input3" className="selectInput">
                <option value="" disabled selected>
                  Select a Status
                </option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        {/* End of form-grid */}
        <div className="buttomContainer">
          <button className="resetbutton">Reset</button>
          <button className="submitButton">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewUser;
