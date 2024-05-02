import React from "react";
import "./Profile.css";

export default function Profile() {
  return (
    <main>
      <div className="profile--Box">
        <h1>Profile Section</h1>

        <div className="profile--body">
          <p>You can edit your Profile here</p>
          <div className="Profile--InsideBody">
            <section className="profile--section">
              <div className="profile-textPhoto">
                <img
                  src="https://placehold.co/100x100"
                  alt="Avatar"
                  className="rounded-full w-12 h-12"
                />
                <button className="bg-zinc-300 hover:bg-zinc-400 text-zinc-800 font-bold py-2 px-4 rounded inline-flex items-center">
                  Add Photo
                </button>
              </div>
            </section>

            <section className="profile-form-Section">
              <form className="profile-form">
                <div className="mb-4">
                  <label
                    className="block text-zinc-700 text-sm font-bold mb-2"
                    htmlFor="first-name"
                  >
                    First Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="first-name"
                    type="text"
                    value="Akash"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-zinc-700 text-sm font-bold mb-2"
                    htmlFor="last-name"
                  >
                    Last Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="last-name"
                    type="text"
                    value="Sharma"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-zinc-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    {" "}
                    Email{" "}
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    value="abc123@gmail.com"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-zinc-700 text-sm font-bold mb-2"
                    htmlFor="language"
                  >
                    Language
                  </label>
                  <select
                    className="block appearance-none w-full bg-white border border-zinc-400 hover:border-zinc-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    id="language"
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Spanish</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    className="block text-zinc-700 text-sm font-bold mb-2"
                    htmlFor="new-password"
                  >
                    New Password
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="new-password"
                    type="password"
                    value="qwerty"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-zinc-700 text-sm font-bold mb-2"
                    htmlFor="reenter-new-password"
                  >
                    Reenter New Password
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="reenter-new-password"
                    type="password"
                    value="qwerty"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-zinc-700 text-sm font-bold mb-2"
                    htmlFor="preferred-activity"
                  >
                    Preferred Activity
                  </label>
                  <div className="flex flex-wrap">
                    <div className="inline-block rounded-full text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 m-1">
                      Running
                    </div>
                    <div className="inline-block rounded-full text-white bg-green-500 hover:bg-green-700 font-bold py-2 px-4 m-1">
                      Yoga
                    </div>
                    <div className="inline-block rounded-full text-white bg-red-500 hover:bg-red-700 font-bold py-2 px-4 m-1">
                      Gym
                    </div>
                    <div className="inline-block rounded-full text-white bg-purple-500 hover:bg-purple-700 font-bold py-2 px-4 m-1">
                      Swimming
                    </div>
                    <div className="inline-block rounded-full text-white bg-yellow-500 hover:bg-yellow-700 font-bold py-2 px-4 m-1">
                      Cricket
                    </div>
                    <div className="inline-block rounded-full text-white bg-orange-500 hover:bg-orange-700 font-bold py-2 px-4 m-1">
                      Football
                    </div>
                    <div className="inline-block rounded-full text-white bg-pink-500 hover:bg-pink-700 font-bold py-2 px-4 m-1">
                      Volleyball
                    </div>
                    <div className="inline-block rounded-full text-white bg-teal-500 hover:bg-teal-700 font-bold py-2 px-4 m-1">
                      Badminton
                    </div>
                  </div>
                </div>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">
                  Proceed
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
