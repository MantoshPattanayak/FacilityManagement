import React from "react";
import "./ParkPayment.css";

export default function ParkPayment() {
  return (
    <main>
      <div className="Outside-Payment-Container">
        {/* <div className="Inside-Payment-Container"> */}
        <div className="Payment-main-container">
          <section className="Payment-methods">
            {/* Payment Options */}
            <div>
              <h1>Payment Options</h1>
              <div className="PaymentButtons">
                <button className="Payment-button">Credit Card</button>
                <button className="Payment-button">Debit Cards</button>
                <button className="Payment-button">Net Banking</button>
                <button className="Payment-button">Wallet</button>
                <button className="Payment-button Active-button">UPI</button>
              </div>
            </div>
          </section>
          <section className="Payment-Input">
            <div>
              <h1>Payment Options</h1>
              <div className="UPI-Input-Box">
                <label htmlFor="upiId">UPI ID: </label>
                <input type="text" placeholder="Enter UPI ID" />
              </div>
              <div className="agree-Box">
                <input type="checkbox" id="agree" />
                <label htmlFor="agree">
                  I agree with the privacy policy by proceeding with this
                  payment
                </label>
              </div>
            </div>
            <div className="QR-scan-Box">
              <img src="https://placehold.co/200x200" alt="QR Code" />
              <p>Scan and Pay from your mobile</p>
            </div>
            <div className="text-center mt-4">
              <p className="text-2xl font-semibold">INR 1500.00</p>
              <p className="text-sm">(Total amount Payable)</p>
            </div>
            <div className="payment-buttons">
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                Make Payment
              </button>
              <button className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-500 text-gray-500 hover:border-gray-800 hover:text-gray-800 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300 dark:hover:border-neutral-300">
                Cancel
              </button>
            </div>
          </section>
        </div>
        {/* </div> */}
      </div>
    </main>
  );
}
