import React from 'react';
import './AboutWarehouse.css';
import aboutUsImage1 from '../../assets/images/AboutImg1.jpeg';
import aboutUsImage2 from '../../assets/images/AboutImg2.jpeg';
import aboutUsImage3 from '../../assets/images/AboutImg3.jpeg';
import aboutUsImage4 from '../../assets/images/AboutImg4.jpeg';
import aboutUsImage5 from '../../assets/images/AboutImg5.jpeg';
import aboutUsImage6 from '../../assets/images/AboutImg6.jpeg';

function AboutWarehouse() {
  return (
    <div className="about-us-page77">
      <section className="about-us-content77">
        <div className="image-container77">
          <div className="image-slider77">
            <img src={aboutUsImage1} alt="About Us 1" className="slider-image77" />
            <img src={aboutUsImage2} alt="About Us 2" className="slider-image77" />
            <img src={aboutUsImage3} alt="About Us 3" className="slider-image77" />
            <img src={aboutUsImage4} alt="About Us 4" className="slider-image77" />
            <img src={aboutUsImage5} alt="About Us 5" className="slider-image77" />
            <img src={aboutUsImage6} alt="About Us 6" className="slider-image77" />
          </div>
        </div>
        <div className="text-content77">
          <h1 className='title77'>מי אנחנו?</h1>
          <p className='lines77'>
            דני קלמן ז"ל חברנו, חבר קיבוץ ראש צורים, נפטר ממחלת קשה בכסלו תשע"ז. דני היה חבלן במשמרת, מתנדב במד"א ויחידת חילוץ גוש עציון. בנוסף לזאת, היה דני דמות יוזמת, פועלת ומעורבת בכל העשיה והנדרש בקיבוץ.
          </p>
          <p className='lines77'>
            "מחסן חיובי" הוא השם שנתן דני עצמו למפעל החסד שהקים, שמטרתו להנפיק ציוד להשאלה כגמ"ח. עיקר הכוונה ביסוד "מחסן חיובי" הייתה לרכוש ולאסוף ציוד המתאים לאירועים מחד גיסא, ומאידך להשאילו ע"מ לסייע בשמחות פרטיות וציבוריות ובאירועי תרבות בקיבוץ.
          </p>
          <p className='lines77'>
            בפרויקט זה ביקש דני לחזק את האווירה החיובית בקיבוץ, ולהדגיש את השמחות והאירועים המשמחים, ולכן קרא לו "מחסן חיובי". המחסן שדני הקים וטיפח כלל שולחנות, כיסאות, מזרנים, כלים שונים, אמצעי תאורה, מפות וקישוטי שולחן. דני, שהיה יצירתי ובעל ידי זהב, יצר ובנה בעצמו חלק רב מן הציוד, ואת הציוד שאסף מכל הבא ליד שדרג ותחזק את תכולת המחסן.
          </p>
          <p className='lines77'>
            בנוסף, גייס והפעיל חברים שסייעו לו בהרחבת ובתחזוקת המחסן. יש המנציחים את היקר להם בקריאת מפעל כלשהו על שמו ולזכרו. זכה דני להקים הוא בעצמו, בעשר אצבעותיו, את המפעל שיעמוד לו לזכרו. "מחסן חיובי" היה קרוב לליבו ושיקף באופן תמציתי את תכונותיו והערכים שהאמין בהם: חסד, אהבה ועזרת הזולת, שהיו נר לרגליו.
          </p>
          <p className='lines77'>
            מתוך כך, בחרנו אנו להמשיך את הפרויקט הזה כמפעל ההנצחה לדני. ברצוננו, חבריו ומשפחתו, להמשיך את מפעלו של דני ואף להגשים את חלומו, להגדיל ולחזק את "מחסן חיובי" כך שיוכל לשרת לא רק את תושבי ראש צורים אלא גם ציבורים נוספים.
          </p>
          <p className='lines77'>
            מעת לעת, יוכלו להשתלב חברין של דני מהמעגלים השונים של חייו בהרמת פרויקטים של שמחות למשפחות נזקקות לזכרו.
          </p>
          <p className='lines77'>
            נשמח להשתתפותך במפעל חשוב זה.
          </p>
          <p className='lines77'>
            בברכה,<br />
            משפחת קלמן וצוות "חיובי", ראש צורים.
          </p>
          <br></br>
          <h2 className='sec7'>לאחר שהתגבש צוות מנהל ל"מחסן חיובי" הוחלט כי:</h2>
          <div className="timeline77">
            <div className="timeline-item77">
              <div className="timeline-content77">
                <h3 className='stages77'>שלב 1</h3>
                <p>ישודרג כל הציוד במחסן באופן שיוכל להנפיק ציוד לשמחות של עד 300 איש.</p>
              </div>
            </div>
            <div className="timeline-item77">
              <div className="timeline-content77">
                <h3 className='stages77'>שלב 2</h3>
                <p>נעלה את מכסת הציוד באופן שנוכל להנפיק ציוד לשמחות של עד 500 איש.</p>
              </div>
            </div>
            <div className="timeline-item77">
              <div className="timeline-content77">
                <h3 className='stages77'>שלב 3</h3>
                <p>נפעל להפיק אירועים שלמים למען השאלת הציוד, דרך מנות האוכל ועד להגשה עצמה עבור משפחות נזקקות והכל על טהרת החסד וההתנדבות.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutWarehouse;
