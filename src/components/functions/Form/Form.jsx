import React from 'react'
import { FaPlus, FaMinus } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { useToggle } from '@uidotdev/usehooks'

export default function Form() {
  const [on, toggle] = useToggle(false);
  
  
  const {register, handleSubmit} = useForm();
  
  
  const onSubmit = (d) =>
    alert(JSON.stringify(d));

  return (
    <>
      <div className='flex justify-center flex-col mb-10 rounded-3xl shadow-[1px_3px_10px_var(--header-footer-bg)] backdrop-blur-sm backdrop-brightness-85 gap-1 w-9/10 lg:w-6/10 self-center transition-all duration-200 ease-in-out min-h-25 form'>
          <h1 className='flex justify-between items-center w-full p-5 cursor-pointer' onClick={toggle}>
            Formularz Zgłoszeniowy
            {on ? <i><FaMinus /></i> : <i><FaPlus /></i>}
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} action="https://httpbin.org/post" method="post" className={on ? 'flex flex-col justify-start p-5 gap-4 leading-9' : 'hidden'} >
              <label>
                <p>Przedstaw się proszę imieniem i nazwiskiem.</p>
                <input {...register("imieNazwisko")} name="imie" type="text" placeholder="Imię i Nazwisko" required />
              </label>
              <label>
                <p>Adres Email</p>
                <input {...register("email")} name="email" type="email" placeholder="Email" required />
              </label>
              <label>
                <p>Nr. Telefonu</p>
                <input {...register("telephone")} type="tel" pattern="^(\+48\s?)?(\(?\d{2}\)?[\s\-]?)?[\d\s\-]{7,9}$" required/>
              </label>
              <label>
                <p>Jeśli posiadasz profil na którymś z portali społecznościowych i chcesz się nim pochwalić - zrób to</p>
                <input {...register("socialMedia")} type="text"/>
              </label>
              <label>
                <p>Skąd dowiedziałxś się o prowadzonej przez nas rekrutacji?</p>
                <input {...register("place")} type="text" required/>
              </label>
              <label>
                <p>Z czym przede wszystkim kojarzy ci się Somnium Cafe Bar?</p>
                <input {...register("association")} type="text" required/>
              </label>
              <label>
                <p>Na czym według ciebie polega praca na stanowisku baristy w kawiarni specialty?</p>
                <input {...register("workingForACafe")} type="text" required/>
              </label>
              <fieldset>
                <legend>Czy posiadasz doświadczenie na podobnym stanowisku?</legend>
                <label><input type="radio" required name='experience'/>Tak</label>
                <label><input type="radio" name='experience'/>Nie</label>
              </fieldset>
              {/*
              <label>
                <p>W Somnium serce poświęcamy nie tylko kawie, ale też wypiekom. Pieczenie ciast również należałoby do Twoich obowiązków. Czy jesteś na to gotowx?</p>
                <input type="text" required/>
              </label>
              <fieldset required>
                <legend>Jakie są Twoje kompetencje w zakresie latte art?</legend>
                <label><input type="checkbox" />Umiem spienić mleko</label>
                <label><input type="checkbox" />Namaluję serduszko</label>
                <label><input type="checkbox" />Namaluję tulipana</label>
                <label><input type="checkbox" />Umiem namalować rozetę</label>
                <label><input type="checkbox" />Potrafię malować inwerty</label>
                <label><input type="checkbox" />Pokonam Matviya!</label>
                <label><input type="checkbox" />Zająłem chociaż raz miejsce na podium zawodów</label>
                <label><input type="checkbox" />Malujuę łabędzie</label>
              </fieldset>
              <fieldset required>
                <legend>Jakie są Twoje kompetencje w zakresie espresso?</legend>
                <label><input type="checkbox" />to proste, wciskam przycisk i się robi</label>
                <label><input type="checkbox" />to nieco bardziej skomplikowane, parzę espresso z wagą</label>
                <label><input type="checkbox" />nie boję się zmieniać parametrów (temperatura, ciśnienie) w ekspresie</label>
                <label><input type="checkbox" />radzę sobie z korygowaniem ustawień młynka</label>
                <label><input type="checkbox" />wiem, co to TDS i EXT</label>
                <label><input type="checkbox" />umiem wymienić żarna w młynku i go ustawić</label>
                <label><input type="checkbox" />wiem kiedy espresso jest przeparzone lub niedoparzone</label>
              </fieldset>
              <fieldset>
                <legend>Jaki jest Twój stopień znajomości języka angielskiego?</legend>
                <label><input type="radio" required name='english'/>Nie znam tego języka</label>
                <label><input type="radio" name='english'/>Z trudem, ale się porozumiem</label>
                <label><input type="radio" name='english'/>Komunikatywny</label>
                <label><input type="radio" name='english'/>Płynny</label>
                <label><input type="radio" name='english'/>Native</label>
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
              <label className='w-fit!'>
                <p>Tutaj możesz przesłać swoje CV</p>
                <input type="file" required/>
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
                <input type="text"/>
              </label>
              <h3 className='text-center thank-info'>Dziękujemy Ci za poświęcony czas i udział w ankiecie. Na rozmowę rekrutacyjną przy kawie w Somnium Cafe Bar zaprosimy osoby, których zgłoszenia najbardziej nam  się spodobały.</h3>
              <br/>
              <label className='text-sm text-justify'>
                <h4 className='text-center'>Administratorem Twoich Danych Osobowych będzie Beata Madej Somnium Cafe Bar z siedzibą pod adresem: ul. Krakowska 14, 31-062 Kraków, NIP 9671229065.</h4>
                <input type="checkbox" required/>Wyrażam zgodę na przetwarzanie moich danych osobowych przez Beata Madej Somnium Cafe Bar dla potrzeb niezbędnych do realizacji procesu rekrutacji zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych RODO)
              </label>
              */}
              <button type="submit" className="mainButton text-base">
                <p>Submit Form</p>
              </button>
            </form>
        </div>
    </>
  )
}

