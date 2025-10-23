import React from 'react'
import 'styles/Contact.css'
import { useToggle } from '@uidotdev/usehooks'
import { FaPlus, FaMinus } from "react-icons/fa";

function Contact() {
  const [on, toggle] = useToggle(false);
  return (
    <>
      <div className='min-h-screen flex justify-top flex-col'>        
          <div className='flex justify-center flex-col my-10 lg:mb-10 p-5 rounded-3xl shadow-[1px_3px_10px_var(--header-footer-bg)] backdrop-blur-sm backdrop-brightness-85 gap-1 w-9/10 lg:w-6/10 self-center cursor-default lg:hover:scale-102 lg:hover:backdrop-brightness-75 transition-all duration-200 ease-in-out disclaimer'>
            <h1 className='font-semibold text-center text-3xl mb-4'>Somnium Rekrutacja - Barista</h1> 
            <p>Cześć, tu Somnium Cafe Bar! Jesteśmy kawiarnią specialty z Krakowa i poszukujemy kawowych bohaterów! </p><br />
            <p>Chcielibyśmy zatrudnić baristów:</p>
            <p>⭐️ W pełnym wymiarze godzin, oraz tych poszukujących pracy w weekendy;</p>
            <p>⭐️ Stawiających na rozwój - w Somnium nie będą Ci obce szkolenia sensoryczne, latte art, espresso, sprzedażowe oraz częste wewnętrzne cuppingi kaw z naszej oferty;</p>
            <p>⭐️ Profesjonalnych - pracujących z pozytywną energią i uśmiechem za barem;</p>
            <p>⭐️ Którzy uwielbiają rozmowy o kawie, ale w czasie przysłowiowej tabaki dzielnie dzierżą kolbę w dłoni;</p>
            <p>⭐️ Dla których dobra organizacja i komunikacja w pracy oraz wysoka kultura osobista to podstawa;</p>
            <p>⭐️ Sumiennych i obowiązkowych, czyli dbających o swoje stanowisko pracy, klimat i estetykę lokalu, szanujących czas pracy;</p>
            <p>⭐️ Z opanowaną  sztuką dobrego hospitality.</p>
            <p>⭐Podczas obecnej rekrutacji poszukujemy baristów z doświadczeniem, na minimum pół etatu (ok. 80h w miesiącu) z gotowością do pracy przede wszystkim w weekendy.</p>
            <h3 className='mt-10 leading-6 text-lg'><strong>UWAGA!</strong> Nie szukamy osób na sezon. Wychodzimy z założenia, że to ludzie tworzą kawiarnie, dlatego jeśli posiadasz powyższe kompetencje i chcesz zostać z nami na dłużej, to wypełnij ankietę poniżej.</h3>
            <h3 className='leading-6 text-lg'><strong>PAMIĘTAJ!</strong> Ważne, aby odpowiedzieć zgodnie ze stanem faktycznym. Poszukujemy ludzi na różnym poziomie wiedzy, ale chcących w pełni zaangażować się w rozwój naszych kawowych miejsc.</h3>
          </div>
       
        <div className='flex justify-center flex-col mb-10 rounded-3xl shadow-[1px_3px_10px_var(--header-footer-bg)] backdrop-blur-sm backdrop-brightness-85 gap-1 w-9/10 lg:w-6/10 self-center cursor-default transition-all duration-200 ease-in-out min-h-25 form'>
          <h1 className='flex justify-between items-center w-full p-5 ' onClick={toggle}>
            Formularz Zgłoszeniowy
            {on ? <i><FaMinus /></i> : <i><FaPlus /></i>}
          </h1>
          <form action="https://httpbin.org/post" method="post" className={on ? 'flex flex-col justify-start p-5 gap-4 leading-9' : 'hidden'} >
              <label>
                <p>Przedstaw się proszę imieniem i nazwiskiem i podaj swój nr telefonu.</p>
                <input name="imie" type="text" placeholder="Imię" required />
              </label>
              <label>
                <p>Adres Email</p>
                <input name="email" type="email" placeholder="Email" required />
              </label>
              <label>
                <p>Nr. Telefonu</p>
                <input type="tel" pattern="^(\+48\s?)?(\(?\d{2}\)?[\s-]?)?[\d\s-]{7,9}$" required/>
              </label>
              <label>
                <p>Jeśli posiadasz profil na którymś z portali społecznościowych i chcesz się nim pochwalić - zrób to.</p>
                <input type="text" required/>
              </label>
              <label>
                <p>Skąd dowiedziałxś się o prowadzonej przez nas rekrutacji?</p>
                <input type="text" required/>
              </label>
              <label>
                <p>Z czym przede wszystkim kojarzy ci się Somnium Cafe Bar?</p>
                <input type="text" required/>
              </label>
              <label>
                <p>Na czym według ciebie polega praca na stanowisku baristy w kawiarni specialty?</p>
                <input type="text" required/>
              </label>
              <fieldset>
                <legend>Czy posiadasz doświadczenie na podobnym stanowisku?</legend>
                <label><input type="radio" required/>Tak</label>
                <label><input type="radio" />Nie</label>
              </fieldset>
              <label>
                <p>W Somnium serce poświęcamy nie tylko kawie, ale też wypiekom. Pieczenie ciast również należałoby do Twoich obowiązków. Czy jesteś na to gotowx?</p>
                <input type="text" required/>
              </label>
              <fieldset>
                <legend>Jakie są Twoje kompetencje w zakresie latte art?</legend>
                <label><input type="checkbox" required/>Umiem spienić mleko</label>
                <label><input type="checkbox" />Namaluję serduszko</label>
                <label><input type="checkbox" />Namaluję tulipana</label>
                <label><input type="checkbox" />Umiem namalować rozetę</label>
                <label><input type="checkbox" />Potrafię malować inwerty</label>
                <label><input type="checkbox" />Pokonam Matviya!</label>
                <label><input type="checkbox" />Zająłem chociaż raz miejsce na podium zawodów</label>
                <label><input type="checkbox" />Malujuę łabędzie</label>
              </fieldset>
              <fieldset>
                <legend>Jakie są Twoje kompetencje w zakresie espresso?</legend>
                <label><input type="checkbox" required/>to proste, wciskam przycisk i się robi</label>
                <label><input type="checkbox" />to nieco bardziej skomplikowane, parzę espresso z wagą</label>
                <label><input type="checkbox" />nie boję się zmieniać parametrów (temperatura, ciśnienie) w ekspresie</label>
                <label><input type="checkbox" />radzę sobie z korygowaniem ustawień młynka</label>
                <label><input type="checkbox" />wiem, co to TDS i EXT</label>
                <label><input type="checkbox" />umiem wymienić żarna w młynku i go ustawić</label>
                <label><input type="checkbox" />wiem kiedy espresso jest przeparzone lub niedoparzone</label>
              </fieldset>
              <fieldset>
                <legend>Jaki jest Twój stopień znajomości języka angielskiego?</legend>
                <label><input type="radio" required/>Nie znam tego języka</label>
                <label><input type="radio" />Z trudem, ale się porozumiem</label>
                <label><input type="radio" />Komunikatywny</label>
                <label><input type="radio" />Płynny</label>
                <label><input type="radio" />Native</label>
                </fieldset>
              <label>
                <p>Jaki wymiar godzin pracy Cię interesuje?</p>
                <input type="text" required/>
              </label>
              <label>
                <p>Jaką preferujesz formę zatrudnienia?</p>
                <input type="text" required/>
              </label>
              <label>
                <p>Jakie są Twoje oczekiwania finansowe? Jaka stawka godzinowa "na rękę" Cię interesuje?</p>
                <input type="text" required/>
              </label>
              <label>
                <p>Określ proszę swoją dyspozycyjność. Kiedy możesz rozpocząć pracę?</p>
                <input type="text" required/>
              </label>
              <label>
                <p>W jakie dni tygodnia jesteś dostępnx do pracy?</p>
                <input type="text" required/>
              </label>
              <label>
                <p>Tutaj możesz przesłać swoje CV</p>
                <input type="file"/>
              </label>
              <label>
                <p>Opisz krótko swoje doświadczenie zawodowe.</p>
                <input type="text" required/>
              </label>
              <label>
                <p>Czym dla Ciebie jest customer service, a czym hospitality w kawiarni specialty?</p>
                <input type="text" required/>
              </label>
              <label>
                <p>Jakie konkretne działania podejmujesz, by dobrze współpracować z zespołem?</p>
                <input type="text" required/>
              </label>
              <label>
                <p>Co robisz w sytuacji, gdy jest kolejka do zamówienia, goście zamawiają kilka kaw na wynos, a gdy już są gotowe zmieniają zdanie i proszą o podanie ich na miejscu?</p>
                <input type="text" required/>
              </label>
              <label>
                <p>Jak zareagujesz, gdy Twój gość zamawia kawę, jest niezdecydowany i prosi Cię o zaparzenie Twojej ulubionej, ale ostatecznie jest rozczarowany smakiem?</p>
                <input type="text" required/>
              </label>
              <fieldset>
                <legend>Do którego Zespołu chcesz dołączyć?</legend>
                <label><input type="checkbox" required/>Somnium na Kazimierzu</label>
                <label><input type="checkbox" />Somnium na Zabłociu</label>
                <label><input type="checkbox" />Body Espresso Bar</label>
              </fieldset>
              <label>
                <p>Dlaczego chcesz dostać tę pracę?</p>
                <input type="text" required/>
              </label>
              <label>
                <p>Jeśli chcesz nam coś jeszcze o sobie powiedzieć, to tu jest na to miejsce :)</p>
                <input type="text" required/>
              </label>
              <h3>Dziękujemy Ci za poświęcony czas i udział w ankiecie. Na rozmowę rekrutacyjną przy kawie w Somnium Cafe Bar zaprosimy osoby, których zgłoszenia najbardziej nam  się spodobały.</h3>
              <br/>
              <label>
                <h4>Administratorem Twoich Danych Osobowych będzie Beata Madej Somnium Cafe Bar z siedzibą pod adresem: ul. Krakowska 14, 31-062 Kraków, NIP 9671229065.</h4>
                <input type="checkbox" required/>Wyrażam zgodę na przetwarzanie moich danych osobowych przez Beata Madej Somnium Cafe Bar dla potrzeb niezbędnych do realizacji procesu rekrutacji zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych RODO)
              </label>
              <button type="submit" className="mainButton text-base">
                <p>Submit Form</p>
              </button>
            </form>
        </div>
      </div>
    </>
  )
}

export default Contact
