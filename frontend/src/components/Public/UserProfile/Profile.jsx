import React from "react";
import "./Profile.css";

export default function Profile() {
  function clearPhoto() {
    const photoInput = document.getElementById("photo");
    photoInput.value = ""; // Clear the value of the file input
  }
  return (
    <main>
      <div className="profile--Main-Box">
        {/* left side-section */}
        <aside className="profile-leftside--Body">
          <div className="profile-view--Body">
            <img
              src="https://placehold.co/100x100"
              alt="Profile Image"
              className="rounded-full mb-3"
            />
            <div className="profile-about">
              <p>Akash Sharma</p>
              <p>akashSharma4957@gmail.com</p>
              <p>8877228919</p>
            </div>
          </div>
          <div>
            <ul className="profile-button--Section">
              <li>
                <a href="#" className="">
                  {/* <svg
                    className="w-6 h-6 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2V6m0 4v10a1 1 0 01-1 1h-3m-6 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4m0-6V5a1 1 0 011-1h2a1 1 0 011 1v4m-4 0h4"
                    ></path>
                  </svg> */}
                  Edit User Profile
                </a>
              </li>
              <li>
                <a
                  href="#"
                  // className="flex items-center p-2 text-zinc-700 hover:bg-zinc-100 rounded-lg"
                >
                  {/* <svg
                    className="w-6 h-6 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 32 32"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M 16 3 C 14.136719 3 12.601563 4.277344 12.15625 6 L 3 6 L 3 26 L 29 26 L 29 6 L 19.84375 6 C 19.398438 4.277344 17.863281 3 16 3 Z M 16 5 C 16.808594 5 17.429688 5.386719 17.75 6 L 14.25 6 C 14.570313 5.386719 15.191406 5 16 5 Z M 5 8 L 27 8 L 27 17 L 5 17 Z M 16 14 C 15.449219 14 15 14.449219 15 15 C 15 15.550781 15.449219 16 16 16 C 16.550781 16 17 15.550781 17 15 C 17 14.449219 16.550781 14 16 14 Z M 5 19 L 27 19 L 27 24 L 5 24 Z"
                    ></path>
                  </svg> */}
                  Booking Details
                </a>
              </li>
              <li>
                <a href="#">
                  {/* <svg
                    className="w-6 h-6 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 24 24"
                  >
                    <path d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 4.9 8 4 8.9 4 10 L 4 20 C 4 21.1 4.9 22 6 22 L 18 22 C 19.1 22 20 21.1 20 20 L 20 10 C 20 8.9 19.1 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 8 14 C 8.55 14 9 14.45 9 15 C 9 15.55 8.55 16 8 16 C 7.45 16 7 15.55 7 15 C 7 14.45 7.45 14 8 14 z M 12 14 C 12.55 14 13 14.45 13 15 C 13 15.55 12.55 16 12 16 C 11.45 16 11 15.55 11 15 C 11 14.45 11.45 14 12 14 z M 16 14 C 16.55 14 17 14.45 17 15 C 17 15.55 16.55 16 16 16 C 15.45 16 15 15.55 15 15 C 15 14.45 15.45 14 16 14 z"></path>
                  </svg> */}
                  Change Password
                </a>
              </li>
              <li>
                <a href="#">Card Details</a>
              </li>
            </ul>
            {/* Logout Button */}
            <button className="button-67 ">Logout</button>
          </div>
        </aside>

        {/* right side-section */}
        <div className="profile-rightside--Body">
          <h1>User-Profile</h1>
          <form className="profile-form-Body">
            <h3>Edit your Profile here--</h3>

            {/* photo Upload */}
            <label htmlFor="photo" className="profile-photoLabel">
              Upload Photo
            </label>
            <input type="file" id="photo" accept="image/*" />
            <button type="button" onClick={() => clearPhoto()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-x"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="profile-formContainer">
              <label htmlFor="firstName">First Name</label>
              <input type="text" placeholder="akash" />
              <label htmlFor="firstName">Last Name</label>
              <input type="text" placeholder="sharma" />
              <label htmlFor="email">Email</label>
              <input type="email" placeholder="akashsharma4957@gmail.com" />
              <label htmlFor="firstName">Last Name</label>
              <input type="text" placeholder="sharma" />
              <label htmlFor="language">Language</label>
              <select id="language">
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
              </select>
              <label htmlFor="password">New Password</label>
              <input type="password" placeholder="*******" />
              <label htmlFor="NewPassword">Reenter New Password</label>
              <input type="password" placeholder="*******" />
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
