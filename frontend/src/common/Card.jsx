import React from "react";

const Card = ({ amount, img, checkoutHandler }) => {
  return (
    <section>
      <img src={img} />
      <h2>₹{amount}</h2>
      <button onClick={() => checkoutHandler(amount)}>Buy Now</button>
    </section>
  );
};

export default Card;
