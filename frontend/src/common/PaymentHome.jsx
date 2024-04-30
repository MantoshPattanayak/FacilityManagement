import React from "react";
import axios from "axios";
import Card from "./Card";

const PaymentHome = () => {
  const checkoutHandler = async (amount) => {
    // const {
    //   data: { key },
    // } = await axios.get("http://localhost:8000/api/getkey");

    const {
      data: { order },
    } = await axios.post("http://localhost:8000/razorPayPayment/checkout", {
      amount,
    });

    const options = {
      key: "rzp_test_9Lmyyi6QxCi0Ic",
      amount: order.amount,
      currency: "INR",
      name: "Akash-Satyam",
      description: "Tutorial of RazorPay",
      image: "https://avatars.githubusercontent.com/u/25058652?v=4",
      order_id: order.id,
      callback_url: "http://localhost:8000/razorPayPayment/paymentVerification",
      prefill: {
        name: "Satyam Vivek",
        email: "satyam.vivek@soulunileaders.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#121212",
      },
    };
    const razor = new window.Razorpay(options);
    razor.open();
  };

  const inlineStyles = {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    textAlign: "center",
  };
  return (
    <section>
      <div style={inlineStyles}>
        <Card
          amount={5000}
          img={
            "https://cdn.shopify.com/s/files/1/1684/4603/products/MacBookPro13_Mid2012_NonRetina_Silver.png"
          }
          checkoutHandler={checkoutHandler}
        />
        <Card
          amount={3000}
          img={
            "http://i1.adis.ws/i/canon/eos-r5_front_rf24-105mmf4lisusm_32c26ad194234d42b3cd9e582a21c99b"
          }
          checkoutHandler={checkoutHandler}
        />
      </div>
    </section>
  );
};

export default PaymentHome;
