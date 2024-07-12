// Import Css file -----------------------
import './PartnerWithUs.css'
import PublicHeader from '../../../common/PublicHeader';
import patherwithus from '../../../assets/patnerwithus.png'
import howtowork from '../../../assets/workwith.png'
// Funcation Pather With us ------------------------
const Partnerwithus = () => {
    return (
        <div className='PatherWithUs_main_Conatiner'>
            <PublicHeader />
            <div className='Child_PatnerUs_Conatiner'>
                <div className='Patnerwithus_text_image_container'>
                    <div className='Patnerwithus_Image_Conatiner'>
                        <span className='text_patner'>
                            <h1 className='Join'> Join </h1>
                            <h1 className='Patner_Network'>Partner Network</h1>
                            <p>Let's work together.Join our community of partners who are dedicated to fostering growth <br></br>
                                By partnering with us, you'll have access to a network of professionals, resources, and opportunities <br></br> that can help you achieve your goals and make a meaningful impact in your industry </p>
                            <span className='Join_Now_Button'>
                                <button class="button-38" role="button">Join Now</button>
                            </span>
                        </span>
                        <span className='Patner_image'>
                            <img src={patherwithus}></img>
                        </span>

                    </div>
                    <div className='Patnerwitus_text_conatiner'>
                        <span className='Image_how_work'>
                            <img src={howtowork}></img>
                        </span>
                        <span className='Image_how_work_text'>
                            <h1 className='How'>How to</h1>
                            <h1 className='work'>Work</h1>
                            <p>To work effectively, start by  organizing your tasks and  setting clear priorities. <br></br>
                                Break down larger projects into manageable steps and  allocate time for focused  work <br></br>
                                without distractions.Remember to take regular breaks to maintain productivity and stay  refreshed.
                            </p>
                            <span className='Join_Now_Button'>
                                <button class="button-38" role="button">Let's Work</button>
                            </span>
                        </span>
                    </div>
                    <div className='Become_Patner'>
                        <h1 className='become_patner_text'>Become Our Patner</h1>
                        <p className='Become_p_tag'>
                            Join us in creating a network
                            of innovation and success. As
                            a partner, you'll gain access
                            to exclusive resources, expert
                            <br></br>
                            support, and a community
                            dedicated to achieving
                            excellence together. Let's
                            grow and thrive as partners
                            in this journey.
                            <br></br>
                            Join us in creating a network
                            of innovation and success. As
                            a partner, you'll gain access
                            to exclusive resources, expert
                            support, and a community

                        </p>
                    </div>
                    <div className='Req_Partner'>
            <h1 className='interested'>Interested in becoming Partner</h1>
           
            <div className='Form_Container'>
                <form className='partner-form'>
                    <label htmlFor='name'>Full Name</label>
                    <input type='text' id='name' name='name'
                    placeholder='Please Enter your Full Name'
                     required />

                    <label htmlFor='email'>Email</label>
                    <input type='email' id='email' name='email' 
                    placeholder='Please Enter your email id'
                    required />

                    <label htmlFor='phone'>Phone Number</label>
                    <input type='tel' id='phone' name='phone' 
                    placeholder='Please Enter your Phone Number'
                    required />

                    <label htmlFor='title'>Title</label>
                    <input type='text' id='title' name='title'
                    placeholder='Please Enter the Tittle'
                     required />

                    <label htmlFor='message'>Message</label>
                    <textarea id='message' name='message' rows='4'
                    placeholder='Please write a message'
                     required></textarea>
                    <div className='Patner_submit_button'>
                    <button type='submit'>Request Partnership</button>
                    </div>
                    
                </form>
            </div>
        </div>

                </div>


            </div>
        </div>
    )
}
export default Partnerwithus;