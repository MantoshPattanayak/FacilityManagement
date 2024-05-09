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
          <label htmlFor="">Total Members:</label>
          <div className="input-bookevent">
            <input type="text" />
          </div>
        </div>

        <div className="total-members">
          <label htmlFor="">Total Members:</label>
          <div className="input-bookevent">
            <input type="date" />
          </div>
        </div>

        <div className="total-members">
          <label htmlFor="">Total Members:</label>
          <div className="input-bookevent">
            <input type="time" />
          </div>
        </div>

        <div className="total-members">
          <label htmlFor="">Total Members:</label>
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
