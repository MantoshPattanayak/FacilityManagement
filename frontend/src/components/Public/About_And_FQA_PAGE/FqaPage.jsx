
import PublicHeader from "../../../common/PublicHeader";
import CommonFooter from "../../../common/CommonFooter";
import Fqa_image from "../../../assets/faq2.png"
import "./Fqapage.css"
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';


import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
const FqaPage = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleQuestion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    const aboutInitiativeQuestions = [
        {
        question: "What is AMA BHOOMI?",
        answer: "AMA BHOOMI is a community-driven initiative aimed at providing accessible and well-maintained spaces – parks, playfields, multi-purpose grounds, greenways, and blueways - for various activities such as sports, events, and gatherings."
        },
        {
        question: "What is the main objective of the AMA BHOOMI initiative?",
        answer: "The primary objective of AMA BHOOMI is to create and maintain vibrant, sustainable spaces that foster community interaction and provides venues that promote healthy living, fitness, sports, recreation, cultural and social activities for citizens of Bhubaneswar."
        },
        {
        question: "Who can use AMA BHOOMI facilities?",
        answer: "AMA BHOOMI facilities are open to all individuals and organizations, regardless of age or background. However, minors (under 18) must have consent from a parent or legal guardian to use the facilities."
        },
        {
        question: "What types of events can be held at AMA BHOOMI?",
        answer: "AMA BHOOMI facilities can host a wide range of events, including sports tournaments, community gatherings, cultural events, corporate training sessions, and private functions such as weddings or birthday parties."
        },
        {
        question: "How can I book a facility at AMA BHOOMI?",
        answer: "Facilities can be booked through the AMA BHOOMI website or mobile app. You will need to register and provide accurate information during the booking process. Please note that bookings should be made in advance, depending on the size and nature of the event."
        },
        {
        question: "Are there any costs associated with using AMA BHOOMI facilities?",
        answer: "Yes, there are costs associated with booking AMA BHOOMI facilities, which vary depending on the type of event and the facility being used. Full payment is required at the time of booking."
        },
        {
        question: "What amenities are available at AMA BHOOMI?",
        answer: "AMA BHOOMI facilities are equipped with a range of amenities, including well-maintained grounds, seating arrangements, lighting, restrooms, and waste management services. Specific amenities may vary depending on the facility booked."
        }
    ];

    const registerQuestions = [
        {
            question: "How do I create a new user account?",
            answer: `To create an account, you must have a phone number and be 10 years or older. If you are registering a child for an activity, create your own account and add family members after. Follow these steps:
            1.Click the Login/Sign up button on the main page.
            2.Under the Sign-up button, click “Enter Mobile Number”.
            3.Enter your phone number
            4.Enter the OTP for verification.
            5.Fill in all the required fields marked with an asterisk (*) in “your profile” and submit.`
        },
        {
            question: "How do I change or update my account’s information?",
            answer: `To log in, use your mobile number and OTP. Then, to manage your personal information (such as name, age, and other details), visit the "Profile" section.`
        },
        {
            question: "I am unable to log in to my account.",
            answer: "If you are not receiving an OTP, it is possible that you have entered an invalid mobile number. Please double-check the number and try again."
        },
        {
            question: "I want to delete my account.",
            answer: "To delete your account, go to your account dashboard and delete your account under Account Settings."
        }
    ];

    const slotBookingCancellationRefundQuestions = [
        {
            question: "How do I book a slot to organize an event?",
            answer: "To book a slot, log in to your account, navigate to the Booking section, select the desired date and time, and complete the booking form. Confirm your booking and make the necessary payment."
        },
        {
            question: "How do I check the status of my booking?",
            answer: "Log in to your account and navigate to the My Bookings section. There, you can view the status of all your bookings, pending & Approval."
        },
        {
            question: "How do I know when I have successfully registered for the slot?",
            answer: "Upon successful registration, you will receive a confirmation SMS with the booking details. You can also check the status in the My Bookings section of your account."
        },
        {
            question: "Can I modify or cancel my booking?",
            answer: "Yes, you can modify or cancel your booking within the timeframes specified in our booking policies. Modifications are subject to availability, and cancellations are eligible for refunds if made within the appropriate timeframe."
        }
    ];

    const hostEventQuestions = [
        {
            question: "What is a host event account?",
            answer: "A host event account allows users to host an event on the AMA Bhoomi platform. This includes booking slots, managing event details, and promoting the event."
        },
        {
            question: "How do I create a host event account?",
            answer: `1. To create a host event account:
            2. Sign in to your existing user account.
            3. Navigate to the Event Host section.
            4. Clck on Create Event Host Account.
            5. Fill in the required details and submit the application.`
        },
        {
            question: "What details do I need to provide to create an event host account?",
            answer: "You will need to provide your name, contact information, event details, UID (Aadhar card, Voter card, Driving Licence, PAN Card) and any relevant certifications or permissions required to host events."
        }
    ];

    const eventQuestions = [
        {
            question: "How can I view a schedule of upcoming activities?",
            answer: "You can view the schedule of upcoming activities by visiting the Events section on our website and provide the user details as -per requirement. The schedule is regularly updated with new activities."
        },
        {
            question: "How do I book tickets for an event?",
            answer: "Tickets for events organized by BDA can be purchased through our website. For events organized by other parties, ticketing will be managed by the respective organizers."
        }
    ];

    const transactionPaymentQuestions = [
        {
            question: "How do I find my transaction and payment history?",
            answer: "After logging into your account, go to the booking section. Here, you can access information on auto-charge payments, saved credit/debit cards, transaction and payment history, and account payment details."
        },
        {
            question: "What types of payment are accepted?",
            answer: "We accept UPI, Visa, Visa-Debit, MasterCard, Prepaid Credit Cards."
        }
    ];

    const grievanceQuestions = [
        {
            question: "How do I file a grievance?",
            answer: "To file a grievance, please visit grievance and complete the submission form with the required details. You will receive a confirmation SMS once your grievance has been submitted successfully."
        },
        {
            question: "What information do I need to provide when filing a grievance?",
            answer: "When filing a grievance, please include your full name, contact information/phone number, a detailed description of the issue, and any supporting documentation/photo/video that may help in resolving the matter.",
        },
        {
            question: "How long does it take to resolve a grievance?",
            answer: "The time required to resolve a grievance can vary depending on the complexity of the issue. Typically, we aim to resolve grievances within 21 business days. You will receive updates on the progress via SMS and mail."
        },
        {
            question: "Can I track the status of my grievance?",
            answer: "Yes, you can track the status of your grievance by logging into your account on our website and navigating to the ' Grievances' section. Here, you will find updates on the progress of your case."
        }
    ];

    const bookingCancellationQuestions = [
        {
            question: "Who is eligible to make a booking?",
            answer: "Bookings are open to all individuals and organizations. Minors under 18 years old must have consent from a parent or legal guardian. Approval from the relevant agency is required for bookings of Multipurpose Grounds and Parks."
        },
        {
            question: "How do I make a booking?",
            answer: "You can make a booking by registering with AMA BHOOMI through our website or mobile app. Please ensure that all the information provided during the booking process is accurate and complete."
        },
        {
            question: "When should I make my booking?",
            answer: "For small events, bookings must be made at least 48 hours in advance. For significant events, bookings should be made at least 7 days in advance."
        },
        {
            question: "What are the payment options?",
            answer: "Full payment is required at the time of booking. You can pay online using UPI, credit card, debit card, or net banking. A receipt will be issued upon successful payment."
        },
        {
            question: "How will I receive confirmation of my booking?",
            answer: "Booking confirmations will be sent to you via email and SMS. Please present the confirmation upon arrival at the venue."
        },
        {
            question: "Are there any rules I need to follow when using the facility?",
            answer: "Yes, all users must adhere to the facility’s rules and regulations. You are responsible for ensuring that no damage occurs during your event and that the facility is vacated at the end of the booking period."
        },
        {
            question: "Can I modify my booking?",
            answer: "Yes, you can request booking modifications. For small events, requests must be made at least 24 hours in advance, and for significant events, at least 72 hours in advance. Changes are subject to availability and approval from AMA BHOOMI administration."
        },
        {
            question: "What are the capacity and safety requirements?",
            answer: "Your booking must comply with the facility's capacity limits and all relevant safety regulations. As the event organizer, you are responsible for ensuring all participants follow safety guidelines."
        },
        {
            question: "Who is responsible for cleanup and waste management after the event?",
            answer: "The event organizer is responsible for post-event cleanup and proper waste disposal. Failure to comply may result in additional charges or denial of future bookings."
        }
    ];

    const cancellationPoliciesQuestion = [
        {
            question: "How can I cancel my booking?",
            answer: "Cancellations can be made online through the AMA BHOOMI website or mobile app. You will need to provide your booking reference number and a reason for cancellation."
        },
        {
            question: "What is the cancellation deadline for a refund?",
            answer: "Cancellations made up to 24 hours before the scheduled booking time are eligible for a full refund. Cancellations made less than 24 hours before the booking time are non-refundable."
        },
        {
            question: "How long does it take to receive a refund?",
            answer: "Refunds are processed within 7-10 business days and will be credited to the original payment method. Please note that service fees and charges are non-refundable."
        },
        {
            question: "What happens if I don’t show up for my booking?",
            answer: "If you do not show up for your booking and have not canceled in advance, no refund will be provided."
        },
        {
            question: "What if AMA BHOOMI cancels my booking?",
            answer: "If AMA BHOOMI cancels your booking due to unforeseen circumstances (e.g., severe weather, maintenance issues), we will offer you an alternative date or a full refund."
        },
        {
            question: "Are there any exceptions for cancellations due to Force Majeure?",
            answer: "No refunds will be issued for cancellations due to events beyond AMA BHOOMI’s control (e.g., natural disasters, pandemics). However, rescheduling at no additional cost may be possible, subject to availability."
        },
        {
            question: "What happens if I don’t comply with facility rules?",
            answer: "If you do not comply with facility rules or misuse the facility, your booking may be canceled without notice, and no refund will be issued. You may also be blocked from registering on the AMA BHOOMI portal for six (6) months."
        },
        {
            question: "What should I do if my transaction fails but the amount is debited from my account?",
            answer: "In cases of failed or unconfirmed transactions where your bank account is debited, refunds will be processed within 5-7 working days. If issues persist beyond this timeline, please contact AMA BHOOMI Customer Support for assistance."
        },
        {
            question: "How can I contact AMA BHOOMI for booking and cancellation inquiries?",
            answer: "For any inquiries related to bookings and cancellations, you can reach out to AMA BHOOMI support via email at [xxx] or phone at [xxx]."
        }
    ];

    const miscellaneousQuestions = [
        {
            question: "The issue I am experiencing wasn't listed. How do I get help with other common issues?",
            answer: "If your issue wasn't listed, you can contact our customer support team at support@amabhoomi.in or call our helpline at [Helpline Number]. Our team will be happy to assist you."
        }
    ]
    
    return (
        <div className="FQA_Main_Conatiner">
            <PublicHeader />

            <div className="Fqa_Child_Conatiner">
                <div className="Fqa_Child_Ask_QUESTION">
                 
                    <img src={Fqa_image}></img>
                </div>
                
                 <div className="fqa-body">
                 <div className="faq-section">
                        <h1 className="faq-title">Frequently Asked Questions</h1>
                        <div className="faq-container">
                            <h2>1. About AMA BHOOMI Initiative</h2>
                            {aboutInitiativeQuestions.map((item, index) => (
                                <div key={10 + index} className={`faq-item-1 ${activeIndex === index ? 'factive1' : ''}`}>
                                    <div className="question" onClick={() => toggleQuestion(10+index)}>
                                        <span className="question-text"><button className="Radio_Button"> <FontAwesomeIcon icon={faQuestionCircle} className="question-icon" /></button>
                                           <h1 className="Question_name">{item.question}</h1>  
                                        </span>
                                    </div>
                                    {activeIndex === 10 + index && (
                                        <div className="answer">
                                            <p>{item.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <h2>2. Registering and Creating Account</h2>
                            {registerQuestions.map((item, index) => (
                                <div key={20+index} className={`faq-item-2 ${activeIndex === index ? 'factive2' : ''}`}>
                                    <div className="question" onClick={() => toggleQuestion(20+index)}>
                                        <span className="question-text"><button className="Radio_Button"> <FontAwesomeIcon icon={faQuestionCircle} className="question-icon" /></button>
                                           <h1 className="Question_name">{item.question}</h1>  
                                        </span>
                                    </div>
                                    {activeIndex === 20 + index && (
                                        <div className="answer">
                                            <p>{item.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <h2>3. I want to create a Host Event account</h2>
                            {hostEventQuestions.map((item, index) => (
                                <div key={30+index} className={`faq-item-3 ${activeIndex === index ? 'factive3' : ''}`}>
                                    <div className="question" onClick={() => toggleQuestion(30+index)}>
                                        <span className="question-text"><button className="Radio_Button"> <FontAwesomeIcon icon={faQuestionCircle} className="question-icon" /></button>
                                           <h1 className="Question_name">{item.question}</h1>  
                                        </span>
                                    </div>
                                    {activeIndex === 30 + index && (
                                        <div className="answer">
                                            <p>{item.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <h2>4. Slot Booking, Cancellation and Refund</h2>
                            {slotBookingCancellationRefundQuestions.map((item, index) => (
                                <div key={40+index} className={`faq-item-4 ${activeIndex === index ? 'factive4' : ''}`}>
                                    <div className="question" onClick={() => toggleQuestion(40+index)}>
                                        <span className="question-text"><button className="Radio_Button"> <FontAwesomeIcon icon={faQuestionCircle} className="question-icon" /></button>
                                           <h1 className="Question_name">{item.question}</h1>  
                                        </span>
                                    </div>
                                    {activeIndex === 40 + index && (
                                        <div className="answer">
                                            <p>{item.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <h2>5. Events</h2>
                            {eventQuestions.map((item, index) => (
                                <div key={50+index} className={`faq-item-5 ${activeIndex === index ? 'factive5' : ''}`}>
                                    <div className="question" onClick={() => toggleQuestion(50+index)}>
                                        <span className="question-text"><button className="Radio_Button"> <FontAwesomeIcon icon={faQuestionCircle} className="question-icon" /></button>
                                           <h1 className="Question_name">{item.question}</h1>  
                                        </span>
                                    </div>
                                    {activeIndex === 50 + index && (
                                        <div className="answer">
                                            <p>{item.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <h2>6. Transaction and Payment</h2>
                            {transactionPaymentQuestions.map((item, index) => (
                                <div key={60+index} className={`faq-item-6 ${activeIndex === index ? 'factive6' : ''}`}>
                                    <div className="question" onClick={() => toggleQuestion(60+index)}>
                                        <span className="question-text"><button className="Radio_Button"> <FontAwesomeIcon icon={faQuestionCircle} className="question-icon" /></button>
                                           <h1 className="Question_name">{item.question}</h1>  
                                        </span>
                                    </div>
                                    {activeIndex === 60 + index && (
                                        <div className="answer">
                                            <p>{item.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            <h2>7. Grievance</h2>
                            {grievanceQuestions.map((item, index) => (
                                <div key={70+index} className={`faq-item-7 ${activeIndex === index ? 'factive7' : ''}`}>
                                    <div className="question" onClick={() => toggleQuestion(70+index)}>
                                        <span className="question-text"><button className="Radio_Button"> <FontAwesomeIcon icon={faQuestionCircle} className="question-icon" /></button>
                                           <h1 className="Question_name">{item.question}</h1>  
                                        </span>
                                    </div>
                                    {activeIndex === 70 + index && (
                                        <div className="answer">
                                            <p>{item.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <h2>8. Bookings & Cancellations</h2>
                            {bookingCancellationQuestions.map((item, index) => (
                                <div key={80+index} className={`faq-item-8 ${activeIndex === index ? 'factive8' : ''}`}>
                                    <div className="question" onClick={() => toggleQuestion(80+index)}>
                                        <span className="question-text"><button className="Radio_Button"> <FontAwesomeIcon icon={faQuestionCircle} className="question-icon" /></button>
                                           <h1 className="Question_name">{item.question}</h1>  
                                        </span>
                                    </div>
                                    {activeIndex === 80 + index && (
                                        <div className="answer">
                                            <p>{item.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <h2>9. Bookings & Cancellations</h2>
                            {bookingCancellationQuestions.map((item, index) => (
                                <div key={80+index} className={`faq-item-8 ${activeIndex === index ? 'factive8' : ''}`}>
                                    <div className="question" onClick={() => toggleQuestion(80+index)}>
                                        <span className="question-text"><button className="Radio_Button"> <FontAwesomeIcon icon={faQuestionCircle} className="question-icon" /></button>
                                           <h1 className="Question_name">{item.question}</h1>  
                                        </span>
                                    </div>
                                    {activeIndex === 80 + index && (
                                        <div className="answer">
                                            <p>{item.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            <h2>10. Cancellation Policies</h2>
                            {cancellationPoliciesQuestion.map((item, index) => (
                                <div key={100+index} className={`faq-item-10 ${activeIndex === index ? 'factive10' : ''}`}>
                                    <div className="question" onClick={() => toggleQuestion(100+index)}>
                                        <span className="question-text"><button className="Radio_Button"> <FontAwesomeIcon icon={faQuestionCircle} className="question-icon" /></button>
                                           <h1 className="Question_name">{item.question}</h1>  
                                        </span>
                                    </div>
                                    {activeIndex === 100 + index && (
                                        <div className="answer">
                                            <p>{item.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <h2>11. Miscellaneous </h2>
                            {miscellaneousQuestions.map((item, index) => (
                                <div key={110+index} className={`faq-item-11 ${activeIndex === index ? 'factive11' : ''}`}>
                                    <div className="question" onClick={() => toggleQuestion(110+index)}>
                                        <span className="question-text"><button className="Radio_Button"> <FontAwesomeIcon icon={faQuestionCircle} className="question-icon" /></button>
                                           <h1 className="Question_name">{item.question}</h1>  
                                        </span>
                                    </div>
                                    {activeIndex === 110 + index && (
                                        <div className="answer">
                                            <p>{item.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    )
}
export default FqaPage;