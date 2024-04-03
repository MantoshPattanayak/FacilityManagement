import React from "react";
import "./CommonFrom.css";

const CommonFrom = () => {
  return (
    <div className="form-container">
      <div className="form-heading">
        <h2>Heading 1</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="input1">Label 1:</label>
            <input type="text" id="input1" placeholder="Input 1" />
          </div>
          <div className="form-group">
            <label htmlFor="input2">Label 2:</label>
            <input type="text" id="input2" placeholder="Input 2" />
          </div>
          <div className="form-group">
            <label htmlFor="input3">Label 3:</label>
            <input type="text" id="input3" placeholder="Input 3" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="input1">Label 1:</label>
            <input type="text" id="input1" placeholder="Input 1" />
          </div>
          <div className="form-group">
            <label htmlFor="input2">Label 2:</label>
            <input type="text" id="input2" placeholder="Input 2" />
          </div>
          <div className="form-group">
            <label htmlFor="input3">Label 3:</label>
            <input type="text" id="input3" placeholder="Input 3" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="input1">Label 1:</label>
            <input type="text" id="input1" placeholder="Input 1" />
          </div>
          <div className="form-group">
            <label htmlFor="input2">Label 2:</label>
            <input type="text" id="input2" placeholder="Input 2" />
          </div>
          <div className="form-group">
            <label htmlFor="input3">Label 3:</label>
            <input type="text" id="input3" placeholder="Input 3" />
          </div>
        </div>
        {/* Two more similar rows for Heading 1 */}
      </div>
      <div className="form-heading">
        <h2>Heading 1</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="input1">Label 1:</label>
            <input type="text" id="input1" placeholder="Input 1" />
          </div>
          <div className="form-group">
            <label htmlFor="input2">Label 2:</label>
            <input type="text" id="input2" placeholder="Input 2" />
          </div>
          <div className="form-group">
            <label htmlFor="input3">Label 3:</label>
            <input type="text" id="input3" placeholder="Input 3" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="input1">Label 1:</label>
            <input type="text" id="input1" placeholder="Input 1" />
          </div>
          <div className="form-group">
            <label htmlFor="input2">Label 2:</label>
            <input type="text" id="input2" placeholder="Input 2" />
          </div>
          <div className="form-group">
            <label htmlFor="input3">Label 3:</label>
            <input type="text" id="input3" placeholder="Input 3" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="input1">Label 1:</label>
            <input type="text" id="input1" placeholder="Input 1" />
          </div>
          <div className="form-group">
            <label htmlFor="input2">Label 2:</label>
            <input type="text" id="input2" placeholder="Input 2" />
          </div>
          <div className="form-group">
            <label htmlFor="input3">Label 3:</label>
            <input type="text" id="input3" placeholder="Input 3" />
          </div>
        </div>
        {/* Two more similar rows for Heading 1 */}
      </div>
      {/* Two more similar headings */}
      <div className="buttons-container">
        <button className="approve-button">Approve</button>
        <button className="cancel-button">Cancel</button>
      </div>
    </div>
  );
};

export default CommonFrom;
