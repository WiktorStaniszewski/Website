import React from 'react'
import 'styles/Contact.css'
import Form from 'components/ui/Form';

export default function Recruitment() {
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
          <Form />
      </div>
    </>
  )
}

