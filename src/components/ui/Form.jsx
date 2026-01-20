import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { FaPaperPlane, FaCheckCircle, FaSpinner } from "react-icons/fa";
import api from "src/services/api"; // Assuming we use your api service wrapper

export default function Form() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simulate API delay
    try {
        // In a real scenario: await api.post('recruitment', data);
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        
        console.log("Form Data:", data);
        setIsSuccess(true);
        reset();
    } catch (error) {
        console.error("Submission failed", error);
        alert("Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.");
    } finally {
        setIsSubmitting(false);
    }
  };

  // Reusable Input Style Class
  const inputClass = "w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-[var(--font-color)] placeholder-white/30 focus:outline-none focus:border-[var(--medium-shade)] focus:bg-black/30 transition-all duration-300";
  const labelClass = "block text-sm uppercase tracking-widest text-[var(--medium-shade)]/80 mb-2 font-bold";
  const errorClass = "text-red-400 text-xs mt-1 ml-1";

  if (isSuccess) {
      return (
        <div className='bg-[#24201d]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-12 shadow-2xl text-center min-h-[400px] flex flex-col items-center justify-center animate-in zoom-in-95 duration-500'>
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                <FaCheckCircle className="text-5xl text-green-500" />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-4">Dziękujemy!</h2>
            <p className="text-lg text-white/80 max-w-lg">
                Twoje zgłoszenie zostało przyjęte. Skontaktujemy się z wybranymi kandydatami, aby zaprosić ich na kawę i rozmowę.
            </p>
            <button 
                onClick={() => setIsSuccess(false)}
                className="mt-8 px-8 py-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"
            >
                Wyślij kolejne zgłoszenie
            </button>
        </div>
      );
  }

  return (
    <div className='bg-[#24201d]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden'>
        <div className="mb-10 border-b border-white/10 pb-6">
            <h2 className='font-serif font-bold text-3xl text-(--font-color)'>Formularz Zgłoszeniowy</h2>
            <p className="text-white/60 mt-2">Wypełnij dokładnie wszystkie pola. To Twój pierwszy krok do Somnium.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
            
            {/* --- Personal Info Section --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block">
                    <span className={labelClass}>Imię i Nazwisko *</span>
                    <input 
                        {...register("imieNazwisko", { required: true })} 
                        type="text" 
                        placeholder="Jan Kowalski" 
                        className={inputClass} 
                    />
                    {errors.imieNazwisko && <p className={errorClass}>To pole jest wymagane</p>}
                </label>
                
                <label className="block">
                    <span className={labelClass}>Email *</span>
                    <input 
                        {...register("email", { required: true })} 
                        type="email" 
                        placeholder="jan@example.com" 
                        className={inputClass} 
                    />
                </label>

                <label className="block">
                    <span className={labelClass}>Telefon *</span>
                    <input 
                        {...register("telephone", { required: true, pattern: /^(\+48\s?)?(\(?\d{2}\)?[\s\-]?)?[\d\s\-]{7,9}$/ })} 
                        type="tel" 
                        placeholder="000 000 000" 
                        className={inputClass} 
                    />
                    {errors.telephone && <p className={errorClass}>Błędny format numeru</p>}
                </label>

                <label className="block">
                    <span className={labelClass}>Instagram / LinkedIn</span>
                    <input 
                        {...register("socialMedia")} 
                        type="text" 
                        placeholder="@twojprofil" 
                        className={inputClass} 
                    />
                </label>
            </div>

            {/* --- Experience Questions --- */}
            <div className="space-y-6 pt-6 border-t border-white/5">
                <label className="block">
                    <span className={labelClass}>Z czym kojarzy Ci się Somnium? *</span>
                    <textarea 
                        {...register("association", { required: true })} 
                        rows={3}
                        className={inputClass}
                    />
                </label>

                <label className="block">
                    <span className={labelClass}>Na czym polega praca baristy? *</span>
                    <textarea 
                        {...register("workingForACafe", { required: true })} 
                        rows={3}
                        className={inputClass}
                    />
                </label>

                <fieldset className="bg-black/10 p-6 rounded-2xl border border-white/5">
                    <legend className={labelClass}>Doświadczenie *</legend>
                    <div className="flex gap-8 mt-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input {...register("experience", { required: true })} type="radio" value="yes" className="accent-(--medium-shade) w-5 h-5 cursor-pointer" />
                            <span className="text-white/80 group-hover:text-white transition-colors">Tak</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input {...register("experience", { required: true })} type="radio" value="no" className="accent-(--medium-shade) w-5 h-5 cursor-pointer" />
                            <span className="text-white/80 group-hover:text-white transition-colors">Nie</span>
                        </label>
                    </div>
                </fieldset>
            </div>

            {/* --- Skills Checkboxes --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                 <fieldset className="bg-black/10 p-6 rounded-2xl border border-white/5">
                    <legend className={labelClass}>Latte Art (Zaznacz co potrafisz)</legend>
                    <div className="flex flex-col gap-3 mt-3">
                        {["Umiem spienić mleko", "Serce", "Tulipan", "Rozeta", "Inwerty", "Łabędź"].map((skill, i) => (
                             <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" {...register(`skills.latteArt.${i}`)} className="accent-(--medium-shade) w-4 h-4 rounded cursor-pointer" />
                                <span className="text-white/70 group-hover:text-white text-sm transition-colors">{skill}</span>
                             </label>
                        ))}
                    </div>
                </fieldset>

                <fieldset className="bg-black/10 p-6 rounded-2xl border border-white/5">
                    <legend className={labelClass}>Espresso & Sprzęt</legend>
                    <div className="flex flex-col gap-3 mt-3">
                        {["Parzę z wagą", "Ustawiam młynek", "Znam TDS/EXT", "Wymieniam żarna", "Rozróżniam defekty (przeparzenie)"].map((skill, i) => (
                             <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" {...register(`skills.espresso.${i}`)} className="accent-(--medium-shade) w-4 h-4 rounded cursor-pointer" />
                                <span className="text-white/70 group-hover:text-white text-sm transition-colors">{skill}</span>
                             </label>
                        ))}
                    </div>
                </fieldset>
            </div>

            {/* --- Logistics --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                <label className="block">
                    <span className={labelClass}>Oczekiwania finansowe (netto/h) *</span>
                    <input {...register("salary", { required: true })} type="text" className={inputClass} />
                </label>
                
                <label className="block">
                    <span className={labelClass}>Dyspozycyjność (od kiedy?) *</span>
                    <input {...register("availability", { required: true })} type="text" className={inputClass} />
                </label>
            </div>

            {/* --- Details --- */}
            <div className="space-y-6 pt-6 border-t border-white/5">
                 <label className="block">
                    <span className={labelClass}>Dlaczego chcesz tę pracę? *</span>
                    <textarea 
                        {...register("whyUs", { required: true })} 
                        rows={4}
                        className={inputClass}
                    />
                </label>

                <label className="block">
                    <span className={labelClass}>Coś od siebie (opcjonalnie)</span>
                    <textarea 
                        {...register("extraInfo")} 
                        rows={2}
                        className={inputClass}
                    />
                </label>

                 <label className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                    <input 
                        type="checkbox" 
                        {...register("rodo", { required: true })} 
                        className="mt-1 accent-(--medium-shade) w-5 h-5 shrink-0 cursor-pointer" 
                    />
                    <span className="text-xs text-white/60 text-justify leading-relaxed">
                        Wyrażam zgodę na przetwarzanie moich danych osobowych przez Somnium Cafe Bar dla potrzeb niezbędnych do realizacji procesu rekrutacji zgodnie z RODO.
                    </span>
                </label>
                {errors.rodo && <p className={errorClass}>Musisz zaakceptować zgodę RODO</p>}
            </div>

            {/* --- Submit --- */}
            <div className="pt-6 flex justify-center">
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="group relative px-10 py-4 bg-(--medium-shade) text-[#24201d] font-bold text-lg rounded-full shadow-[0_0_20px_rgba(143,120,93,0.3)] hover:shadow-[0_0_30px_rgba(143,120,93,0.5)] hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
                >
                    <span className="flex items-center gap-3">
                        {isSubmitting ? (
                            <>
                                <FaSpinner className="animate-spin" /> Wysyłanie...
                            </>
                        ) : (
                            <>
                                Wyślij zgłoszenie <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </span>
                </button>
            </div>
        </form>
    </div>
  )
}