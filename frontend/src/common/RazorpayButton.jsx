import React, { useEffect } from "react";
import axiosHttpClient from "../utils/axios";
import { faCreditCard, faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from '../../src/assets/ama_bhoomi_logo_odia.jpeg';
import { decryptData, encryptData } from "../utils/encryptData";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import './RazorpayButton.css';

const RazorpayButton = ({ amount, currency, description, onSuccess, onFailure, isDisabled, data }) => {
  // dynamically load the script in the component
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const checkoutHandler = async () => {
    // fetch RAZORPAY API KEY
    const {
      data: { key, secret },
    } = await axiosHttpClient("FETCH_RAZORPAY_API_KEY", "get");
    // console.log('apiKey', key);

    /**
     * data = {
     *  entityId, entityTypeId, facilityPreference, userCartId (ref from cartTable)
     * }
     */

    console.log("data in razorpay btn", data);
    // create RAZORPAY order
    const { data: { order }, } = await axiosHttpClient("CREATE_RAZORPAY_ORDER_API", "post", { 
      data
    });
    // console.log("order", order);

    //proceed for RAZORPAY checkout
    const options = {
      key: decryptData(key),
      amount: decryptData(order.amount),
      currency: decryptData(order.currency )|| currency,
      name: "AMA BHOOMI",
      description: description,
      // image: Logo,
      order_id: decryptData(order.id),
      handler: async function (response) {
        try {
          console.log('razorpay response', response);
          let encryptedResponse = {
            razorpay_payment_id  : encryptData(response.razorpay_payment_id),
            razorpay_order_id    : encryptData(response.razorpay_order_id),
            razorpay_signature   : encryptData(response.razorpay_signature)
          };

          let res = await axiosHttpClient('RAZORPAY_PAYMENT_VERIFICATION', 'post', encryptedResponse);
          // mantosh added code
          // let res = await fetch('https://c6c7-122-187-160-238.ngrok-free.app/razorPayPayment/webHook', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify(response),
          // });

          // mantosh added code
          // console.log(res,'razorpayData');
          onSuccess({ response, res });
        }
        catch (error) {
          console.error(error);
          toast.error(error.response.data.message);
        }
      },
      prefill: {
        name: "Test",
        email: "test@email.com",
        contact: 9876543210,
      },
      notes: {
        address: "AMA BHOOMI, BDA, Ashok Seva Bhawan",
      },
      theme: {
        color: "#121212",
      },
    };
    const razor = new window.Razorpay(options);
    razor.on('payment.failed', function (response) {
      toast.error("Payment failed. Try again!");
      // console.log('payment failed in razorpay button', response.error);
      onFailure(response.error);
    })
    razor.open();
  };

  return (
    <>
      <button className="razorpay-button" onClick={checkoutHandler} disabled={isDisabled}>
        <FontAwesomeIcon icon={faCreditCard} />&nbsp; Pay Now &nbsp;<FontAwesomeIcon icon={faIndianRupeeSign} />{parseFloat(amount).toFixed(2)}
      </button>
      <ToastContainer />
    </>
  );
};

export default RazorpayButton;
