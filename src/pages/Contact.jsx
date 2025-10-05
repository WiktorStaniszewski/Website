import React from 'react'
import 'styles/Contact.css'

function Contact() {
  return (
    <>
      <div className="sec-5" id="sec5">
        <div className="sec5">
            <h1 className="hidden">
                KONTAKT
            </h1>
            <div className="container">
                <div className="hidden">
                    <h3>EMAIL:</h3>
                    <p>@gmail.com</p>   
                    <h3>TELEFON:</h3>
                    <p><a href="tel:+480123456789">0123456789</a></p>
                    <h3>ADRES:</h3>
                    <p><a target="_blank" href="https://www.google.pl/maps/place/Body+Espresso+Bar/@50.0639297,19.9253087,17z/data=!3m2!4b1!5s0x47165b0977f6ced9:0x1e9d024cb1297630!4m6!3m5!1s0x47165b35ad552877:0xe80ec041b165b4b6!8m2!3d50.0639263!4d19.927889!16s%2Fg%2F11fwnq6lb4?entry=ttu&g_ep=EgoyMDI1MDIyMy4xIKXMDSoASAFQAw%3D%3D', '_blank">ul, Dolnych Młynów 3/1, 31-124 Kraków</a>
                    </p>
                </div>
                <div>
                    <form method="post">
                        <input name="imie" type="text" placeholder="Imię" required className="home-input" />
                        <input name="nazwisko" type="text" placeholder="Nazwisko" required className="home-input" />
                        <input name="email" type="email" placeholder="Email" required className="home-input" />
                        <input name="opis_problemu" type="text" rows="4" placeholder="Opis problemu" required className="home-input" />
                        <button type="submit" className="btn-1">Submit Form</button>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default Contact
