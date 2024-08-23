import React, { useState } from 'react';
import './DosDont.css';

const DosDont = () => {
  const [popUpClosed, setPopUpClosed] = useState(false);

  return (
      <>
          {!popUpClosed &&
              (<div className="dosdonts-container">
                  <span className="flex justify-end gap-x-2">
                      <button className="text-red-500 font-semibold hover:underline" onClick={(e) => setPopUpClosed(true)}>Close</button>
                  </span>
                  <h1 className="dosdont-header">Do's and Don'ts</h1>
                  <div className="dosdont-content">
                      <h2>TENNIS</h2>
                      <p>
                          <b>DO's:</b>
                          <li>Wear sports shoes with rubber soles.</li>
                          <li>Clean footwear before entering the court.</li>
                          <li>Dress in comfortable sports clothing.</li>
                          <li>Carry your own tennis racket, balls, and water bottle.</li>
                          <li>Respect time slots and be punctual.</li>
                          <li>Warm up outside the court.</li>
                          <li>Keep noise levels down and avoid distractions.</li>
                          <li>Guests must stay within their designated area.</li>
                          <li>Report dirt, debris, or damage to staff immediately.</li>
                          <li>Children under 8 must be supervised by an adult.</li>

                          <b>DON'Ts:</b>
                          <li>No sports shoes with studs or spikes.</li>
                          <li>Don't hang, hold, or rest on the nets.</li>
                          <li>No spitting, smoking, or chewing gum.</li>
                          <li>Avoid glass or sharp items for safety.</li>
                          <li>No food or liquids other than water.</li>
                          <li>No littering; use bins provided.</li>
                          <li>Remove all personal belongings before leaving.</li>
                          <li>Avoid using the field during severe weather.</li>
                      </p>

                      <h2>FOOTBALL</h2>
                      <p>
                          <b>DO's:</b>
                          <li>Wear sports shoes with rubber studs.</li>
                          <li>Clean footwear before exiting the field.</li>
                          <li>Dress in comfortable sports clothing.</li>
                          <li>Carry your own football, water bottle, and personal gear.</li>
                          <li>Respect time slots and be punctual.</li>
                          <li>Warm up outside the field.</li>
                          <li>Keep noise levels down and avoid distractions.</li>
                          <li>Guests must stay within their designated area.</li>
                          <li>Report dirt, debris, or damage to staff immediately.</li>
                          <li>Children under 8 must be supervised by an adult.</li>

                          <b>DON'Ts:</b>
                          <li>No shoes with metal studs or spikes.</li>
                          <li>Don't hang, hold, or rest on the goals or nets.</li>
                          <li>No spitting, smoking, or chewing gum.</li>
                          <li>Avoid glass or sharp items for safety.</li>
                          <li>No food or liquids other than water.</li>
                          <li>No littering; use bins provided.</li>
                          <li>Remove all personal belongings before leaving.</li>
                          <li>Avoid using the field during severe weather.</li>
                      </p>

                      <h2>KABADDI</h2>
                      <p>
                          <b>DO's:</b>
                          <li>Wear comfortable sports attire and non-slip footwear.</li>
                          <li>Warm up thoroughly before playing.</li>
                          <li>Trim your nails to prevent injuries.</li>
                          <li>Stay hydrated; carry your own water bottle.</li>
                          <li>Respect time slots and be punctual.</li>
                          <li>Ensure the playing area is clear of debris and hazards.</li>
                          <li>Communicate with your team effectively.</li>
                          <li>Report any injuries or issues to the staff immediately.</li>
                          <li>Supervise children under 8 years old.</li>

                          <b>DON'Ts:</b>
                          <li>No wearing jewellery or accessories during the game.</li>
                          <li>Avoid rough or dangerous play.</li>
                          <li>No spitting, smoking, or chewing gum.</li>
                          <li>Avoid glass or sharp items for safety.</li>
                          <li>Avoid consuming food or beverages other than water on the field.</li>
                          <li>No littering; use the bins provided.</li>
                          <li>Do not leave personal belongings on the playing area.</li>
                          <li>Avoid playing in severe weather conditions.</li>
                      </p>

                      <h2>VOLLEYBALL</h2>
                      <p>
                          <b>DO's:</b>
                          <li>Wear comfortable sports attire and sports shoes.</li>
                          <li>Warm up thoroughly before playing.</li>
                          <li>Carry your own volleyball and water bottle.</li>
                          <li>Respect time slots and be punctual.</li>
                          <li>Ensure the playing area is clear of debris and hazards.</li>
                          <li>Communicate with your team effectively.</li>
                          <li>Report any injuries or issues to the staff immediately.</li>
                          <li>Supervise children under 8 years old.</li>

                          <b>DON'Ts:</b>
                          <li>No wearing jewellery or accessories during the game.</li>
                          <li>Avoid rough or dangerous play.</li>
                          <li>No spitting, smoking, or chewing gum.</li>
                          <li>Avoid glass or sharp items for safety.</li>
                          <li>No food or beverages other than water on the court.</li>
                          <li>No littering; use the bins provided.</li>
                          <li>Do not leave personal belongings on the playing area.</li>
                          <li>Avoid playing in severe weather conditions.</li>
                      </p>
                  </div>
                  <span className="flex gap-x-2 justify-center">
                      <button className="proceed-button1" onClick={(e) => setPopUpClosed(true)}>Proceed</button>
                      <button className="close-button1" onClick={(e) => setPopUpClosed(true)}>Close</button>
                  </span>
              </div>)
          }
      </>
  );
};

export default DosDont;
