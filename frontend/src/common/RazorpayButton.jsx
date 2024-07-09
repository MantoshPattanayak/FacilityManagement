import React from "react";
import axiosHttpClient from "../utils/axios";
import instance from "../../env";
import api from "../utils/api";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from '../../src/assets/ama_bhoomi_logo_odia.jpeg';

const RazorpayButton = ({ amount, currency, description, onSuccess, onFailure, isDisabled }) => {
  const checkoutHandler = async () => {
    // const {
    //   data: { key },
    // } = await axios.get("http://localhost:8000/api/getkey");

    const { data: { order }, } = await axiosHttpClient("CREATE_RAZORPAY_ORDER_API", "post", { amount });
    console.log("order", order);

    const options = {
      key: "rzp_test_9Lmyyi6QxCi0Ic",
      amount: order.amount,
      currency: order.currency || currency,
      name: "AMA BHOOMI",
      description: description,
      image: Logo,
      order_id: order.id,
      handler: async function (response) {
        try {
            console.log('razorpay response', response);
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
        onFailure(response.error);
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
