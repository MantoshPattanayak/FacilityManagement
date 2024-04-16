import React, { useState } from 'react';
import './SpecialEvent.css';

const SpecialEvent = () => {
  const [eventImage, setEventImage] = useState(null);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [isPublic, setIsPublic] = useState(true); // Set default to true (Public)

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setEventImage(file);
  };

  const handleImageDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setEventImage(file);
  };

  const handleImageDragOver = (event) => {
    event.preventDefault();
  };

  const handleAdditionalFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setAdditionalFiles([...additionalFiles, ...uploadedFiles]);
  };

  const handleAdditionalDrop = (event) => {
    event.preventDefault();
    const uploadedFiles = Array.from(event.dataTransfer.files);
    setAdditionalFiles([...additionalFiles, ...uploadedFiles]);
  };

  const handleAdditionalDragOver = (event) => {
    event.preventDefault();
  };

  const handleDeleteImage = () => {
    setEventImage(null);
  };

  const handleDeleteAdditionalFile = (index) => {
    const updatedFiles = [...additionalFiles];
    updatedFiles.splice(index, 1);
    setAdditionalFiles(updatedFiles);
  };

  const handleToggleChange = () => {
    setIsPublic(!isPublic); // Toggle the value
  };

  return (
    <div className="container-1">
      <body className="bg-white">
        <div className="max-w-2xl mx-auto p-6">
          {/* Common Header of the page */}
          <div className="header-role-specialevent">
            <div className="rectangle"></div>
            <div className="roles">
              <h1><b>Special Event Booking</b></h1>
            </div>
          </div>

          {/* Toggle for public and private */}
          <div className="bauble_box">
            <label className='toggle-text' htmlFor="bauble_check">Public</label>
            <input
              className="bauble_input"
              id="bauble_check"
              name="bauble"
              type="checkbox"
              checked={isPublic} // Set checked state
              onChange={handleToggleChange} // Handle toggle change
            />
            <label className="bauble_label" htmlFor="bauble_check"></label>
          </div><br />

          {/* Event title */}
          <div className="mb-4">
            <label className="block text-zinc-700 text-sm font-bold mb-2" htmlFor="event-title">
              Event Title
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline" id="event-title" type="text" placeholder="Enter title of your event" />
          </div>

          {/* Event categories */}
          <div className="event-catagory">
            <div className="heading">Event Category</div>
            <div className="events">
              <input type="checkbox" name="" id="" className='catagory-box' />Community Outreach <br />
              <input type="checkbox" name="" id="" className='catagory-box' />Networking <br />
              <input type="checkbox" name="" id="" className='catagory-box' />Fundraising <br />
              <input type="checkbox" name="" id="" className='catagory-box' />Member Support/ Appreciation  <br />
              <input type="checkbox" name="" id="" className='catagory-box' />Education <br />
              <input type="checkbox" name="" id="" className='catagory-box' />Other <br />
            </div>
          </div>

          {/* Location and Event Date */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block text-zinc-700 text-sm font-bold mb-2" htmlFor="location">
                Location of Event
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline" id="location" type="text" placeholder="Search location" />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block text-zinc-700 text-sm font-bold mb-2" htmlFor="event-date">
                Event Date
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline" id="event-date" type="date" placeholder="DD-MM-YYYY" />
            </div>
          </div>

          {/* Event Time */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block text-zinc-700 text-sm font-bold mb-2" htmlFor="start-time">
                Event Start Time
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline" id="start-time" type="text" placeholder="HH:MM AM/PM" />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block text-zinc-700 text-sm font-bold mb-2" htmlFor="end-time">
                Event End Time
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline" id="end-time" type="text" placeholder="HH:MM AM/PM" />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-zinc-700 text-sm font-bold mb-2" htmlFor="description">
              Description of Event
            </label>
            <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline" id="description" placeholder="Description"></textarea>
          </div>

          {/* Tickets */}
          <div className="mb-4">
            <label className="block text-zinc-700 text-sm font-bold mb-2" htmlFor="tickets">
              Will there be tickets sold?
            </label>
            <select className="block appearance-none w-full bg-white border border-zinc-400 hover:border-zinc-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" id="tickets">
              <option>Please Select</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          {/* Ticket Amount */}
          <div className="mb-4">
            <label className="block text-zinc-700 text-sm font-bold mb-2" htmlFor="ticket-amount">
              If yes, then how much are tickets?
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline" id="ticket-amount" type="text" placeholder="Enter amount" />
          </div><br />

          {/* Upload Event Image */}
          <div>
            <label className='upload-context' htmlFor="upload-event-image">Upload Event Image</label>
          </div>
          <div className="upload-section" onDrop={handleImageDrop} onDragOver={handleImageDragOver}>
            <div className="upload-container">
              <label htmlFor="event-image-upload" className="upload-label">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m5-4v4m0 0v4m0-4h4m3 9H4a2 2 0 01-2-2V7a2 2 0 012-2h6m3-4V2h.01L21 7l-5 5h-.01V6z" />
                </svg>
                <span className="upload-text">Drag & Drop or Browse Files</span>
              </label>
              <input
                type="file"
                id="event-image-upload"
                className="hidden"
                onChange={handleImageChange}
                accept='image/*'
              />
              {eventImage && (
                <div className="file-list">
                  <h3>Selected Image:</h3>
                  <ul>
                    <li>
                      <span>{eventImage.name}</span>
                      <button className='delete-uploadedfile-btn' onClick={handleDeleteImage}>Delete</button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div><br />

          {/* Upload Any Additional File */}
          <div>
            <label className='upload-context' htmlFor="upload-additional-files">Upload Any Additional Files</label>
          </div>
          <div className="upload-section" onDrop={handleAdditionalDrop} onDragOver={handleAdditionalDragOver}>
            <div className="upload-container">
              <label htmlFor="additional-files-upload" className="upload-label">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m5-4v4m0 0v4m0-4h4m3 9H4a2 2 0 01-2-2V7a2 2 0 012-2h6m3-4V2h.01L21 7l-5 5h-.01V6z" />
                </svg>
                <span className="upload-text">Drag & Drop or Browse Files</span>
              </label>
              <input
                type="file"
                id="additional-files-upload"
                className="hidden"
                onChange={handleAdditionalFileChange}
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
              />
            </div>
            {additionalFiles.length > 0 && (
              <div className="file-list">
                <h3>Selected Files:</h3>
                <ul>
                  {additionalFiles.map((file, index) => (
                    <li key={index}>
                      <span>{file.name}</span>
                      <button className='delete-uploadedfile-btn' onClick={() => handleDeleteAdditionalFile(index)}>Delete</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div><br />

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <button className="bg-zinc-200 text-black py-2 px-4 rounded" type="button">
              Cancel
            </button>
            <button className="bg-green-500 text-white py-2 px-4 rounded" type="button">
              Book
            </button>
          </div>
        </div>
      </body>
    </div>
  );
};

export default SpecialEvent;
