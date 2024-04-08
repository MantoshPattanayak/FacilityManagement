// SearchDropdown.jsx
import "./SearchDropdown.css";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

const SearchDropdown = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const filterFunction = () => {
    let input, filter, div, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    // a = div.getElementsByTagName("a");
    a = div.getElementsByClassName("dropdown-content-child");
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  };

  return (
    <div className="search-dropdown">
      <div className="inside-search-dropdown">
        <input
          type="text"
          placeholder="Search.."
          id="myInput"
          onClick={toggleDropdown}
          onKeyUp={filterFunction}
        />
        <div className="dropicon">
          <FontAwesomeIcon icon={faAngleDown} />
        </div>
      </div>
      {isDropdownVisible && (
        <div id="myDropdown" className="dropdown-content">
          <div className="dropdown-content-child" href="#about">
            About
          </div>
          <div className="dropdown-content-child" href="#base">
            Base
          </div>
          <div className="dropdown-content-child" href="#blog">
            Blog
          </div>
          <div className="dropdown-content-child" href="#contact">
            Contact
          </div>
          <div className="dropdown-content-child" href="#custom">
            Custom
          </div>
          <div className="dropdown-content-child" href="#support">
            Support
          </div>
          <div className="dropdown-content-child" href="#tools">
            Tools
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
