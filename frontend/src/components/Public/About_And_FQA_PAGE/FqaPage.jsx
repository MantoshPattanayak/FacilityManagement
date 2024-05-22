
import PublicHeader from "../../../common/PublicHeader";
import CommonFooter from "../../../common/CommonFooter";
import Fqa_image from "../../../assets/FQA_IMAGE.png"
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

    const questions = [
        {
            question: "How Can I help You?",
            answer: "Answer 1"
        },
        {
            question: "Question 2?",
            answer: "Answer 2"
        },
        {
            question: "Question 2?",
            answer: "Answer 2"
        },
        {
            question: "Question 2?",
            answer: "Answer 2"
        },
        {
            question: "Question 2?",
            answer: "Answer 2"
        },
        {
            question: "Question 2?",
            answer: "Answer 2"
        },

        // Add more questions here
    ];
    return (
        <div className="FQA_Main_Conatiner">
            <PublicHeader />

            <div className="Fqa_Child_Conatiner">
                <div className="Fqa_Child_Ask_QUESTION">
                    <span className="Fqa_Child_Ask_QUESTION_text">
                        <h1 className="FQA_TEXT">FAQs</h1>
                        <p className="Have_q_text" >Have Questions.? Here You'll find the answer most valued by <br></br> our partne,along with access to step-step instructions <br></br> and Support</p>
                    </span>
                    <span className="Fqa_Child_Ask_QUESTION_Image">
                        <img className="FQA_IMAGE" src={Fqa_image}></img>
                    </span>
                </div>
                
                 <div className="fqa-body">
                 <div className="faq-section">
                        <h1 className="faq-title">Frequently Asked Questions</h1>
                        <div className="faq-container">
                            {questions.map((item, index) => (
                                <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
                                    <div className="question" onClick={() => toggleQuestion(index)}>
                                        <span className="question-text"><button className="Radio_Button"> <FontAwesomeIcon icon={faQuestionCircle} className="question-icon" /></button>
                                           <h1 className="Question_name">{item.question}</h1>  
                                         </span>
                                        <span className="icon">
                                        <FontAwesomeIcon icon={activeIndex === index ? faMinus : faPlus} />
                                        </span>
                                    </div>
                                    {activeIndex === index && (
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
            <CommonFooter/>
    
        </div>
    )
}
export default FqaPage;