import React from 'react'
import '../Events/BookEvent.css'
const BookEvent = () => {
  return (
    <div className='event-container'>
      <form action="" className="book-event">
        <div className="heading">
          <p>International Odishi dance festival</p>
        </div>
        <div className="total-members">
          <label htmlFor="totalMembers">Total Members:</label>
          <div className="input-bookevent">
            <select id="totalMembers">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="1">6</option>
              <option value="2">7</option>
              <option value="3">8</option>
              <option value="4">9</option>
              <option value="5">10</option>
             
            </select>
          </div>
        </div>

        <div className="total-members">
          <label htmlFor="">Date:</label>
          <div className="input-bookevent">
            <input type="date" />
          </div>
        </div>

        <div className="total-members">
          <label htmlFor="">Start Time:</label>
          <div className="input-bookevent">
            <input type="time" />
          </div>
        </div>

        <div className="total-members">
          <label htmlFor="">Duration:</label>
          <div className="input-bookevent">
            <input type="text" />
          </div>
        </div>
        <button className="add-to-cart-btn">
          Add to Cart
        </button>
      </form>
      
    </div>
  )
}

export default BookEvent
