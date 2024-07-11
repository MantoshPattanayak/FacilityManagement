import React, { useEffect } from "react";
import axiosHttpClient from "../utils/axios";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from '../../src/assets/ama_bhoomi_logo_odia.jpeg';
import { decryptData } from "../utils/encryptData";
import axios from "axios";

const RazorpayButton = ({ amount, currency, description, onSuccess, onFailure, isDisabled }) => {
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
    const {
      data: { key, secret },
    } = await axiosHttpClient("FETCH_RAZORPAY_API_KEY", "get");
    console.log('apiKey', key);

    const { data: { order }, } = await axiosHttpClient("CREATE_RAZORPAY_ORDER_API", "post", { amount });
    console.log("order", order);

    const options = {
      key: decryptData(key),
      amount: order.amount,
      currency: order.currency || currency,
      name: "AMA BHOOMI",
      description: description,
      image: Logo,
      order_id: order.id,
      handler: async function (response) {
        try {
            console.log('razorpay response', response);            
            // check for payment status
            // let paymentStatusResponse = await fetch(`https://${key}:${secret}@api.razorpay.com/v1/orders/${order.id}`);
            // if(!paymentStatusResponse.ok) {
            //   throw new Error('Network response not OK.')
            // }
            // console.log('paymentStatusResponse', paymentStatusResponse);
            //payment verification
            response.payment_status = paymentStatusResponse.status; // added payment capture status to request body
            let res = await axiosHttpClient('RAZORPAY_PAYMENT_VERIFICATION', 'post', response);
            console.log(res);
            onSuccess({response, res});
        }
        catch(error) {
            console.error(error);
        }
      },
      prefill: {
        name: "Customer name",
        email: "Customer email",
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
      console.error('payment failed', response);
        // onFailure(response.error);
    })
    razor.open();
  };

  return (
    <button className="submit-and-proceed-button" onClick={checkoutHandler} disabled={isDisabled}>
      <FontAwesomeIcon icon={faCreditCard} />&nbsp; Pay Now
    </button>
  );
};

export default RazorpayButton;
