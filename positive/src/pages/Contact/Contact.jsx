import React from 'react';
import './Contact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

function Contact() {
    return (
        <div className="contact-page">

            <div className="contact-form-container">
                <div className="details-bar-wrapper">
                    
                    <div className="text-wrapper">
                        <p className="text-one">דרכי התקשרות</p>
                        <p className="text-two">לתיאום זמני הגעה לאיסוף ההזמנה יש ליצור קשר עמנו</p>
                        <p className="text-two">עבור הזמנות שכללו מוצרים בתשלום (מקרן/בידורית), יש לשלם תחילה 50 ש"ח דרך פייבוקס</p>
                    </div>
                    <div className="contact-email">
                        <p className="text-one">אימייל ליצירת קשר</p>
                        <p className="text-two">postivestorage@gmail.com</p>
                    </div>
                </div>
                <div className="contact-section">
                <h1 className="team-container">צוות המחסן</h1>

                    <div className="column">
                        <div className="contact-person">
                            <h2 className='member-name'>
                                <FontAwesomeIcon icon={faPhone} className="phone-icon" />תמי קלמן</h2>
                            <h4 className='phone-number'>0546700721</h4>
                        </div>
                        <div className="contact-person">
                            <h2 className='member-name'>
                                <FontAwesomeIcon icon={faPhone} className="phone-icon" />
                                פזית ורדי
                            </h2>
                            <h4 className='phone-number'>0546700721</h4>
                        </div>
                        <div className="contact-person">
                            <h2 className='member-name'>
                                <FontAwesomeIcon icon={faPhone} className="phone-icon" />
                                מוטי כהן
                            </h2>
                            <h4 className='phone-number'>0505994488</h4>
                        </div>
                        <div className="contact-person">
                            <h2 className='member-name'>
                                <FontAwesomeIcon icon={faPhone} className="phone-icon" />
                                אסי ברוש
                            </h2>
                            <h4 className='phone-number'>0528522668</h4>
                        </div>
                        <div className="contact-person">
                            <h2 className='member-name'>
                                <FontAwesomeIcon icon={faPhone} className="phone-icon" />
                                כהתיה דרורי
                            </h2>
                            <h4 className='phone-number'>0545250219</h4>
                        </div>
                        <div className="contact-person">
                            <h2 className='member-name'>
                                <FontAwesomeIcon icon={faPhone} className="phone-icon" />
                                אלעד לוי
                            </h2>
                            <h4 className='phone-number'> 0507942849</h4>
                        </div>
                        <div className="contact-person">
                            <h2 className='member-name'>
                                <FontAwesomeIcon icon={faPhone} className="phone-icon" />
                                דודי אלאלוף
                            </h2>
                            <h4 className='phone-number'>0534256567</h4>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    );
}

export default Contact;