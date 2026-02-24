import React, { useState, useEffect } from 'react';
import { AddToCartButton } from "./ShopButtons";
import { FiX, FiAlertTriangle, FiMail, FiCheck } from "react-icons/fi";
import { createPortal } from 'react-dom';
import api from 'services/api';

import { useAuth } from 'context/AuthProvider';

export const ProductDetails = ({ product, on, toggle, toggleClass, ref }) => {
  const { user } = useAuth();
  
  const [email, setEmail] = useState(user?.email || ''); 
  const [waitlistStatus, setWaitlistStatus] = useState('idle');
  
  const available = product.availableStock !== undefined ? product.availableStock : (product.stockQuantity || 0);
  const isSoldOut = available <= 0;
  const isLowStock = available > 0 && available <= 5;

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleWaitlist = async (e) => {
      e.preventDefault();
      setWaitlistStatus('loading');
      try {
          await api.post('waitlist', { productId: product.id, email });
          setWaitlistStatus('success');
      } catch (error) {
          console.error(error);
          setWaitlistStatus('idle');
          alert("Wystąpił błąd zapisu.");
      }
  };

  const getImageUrl = (imageName) => {
    if (!imageName) return 'https://placehold.co/150x150?text=Brak+foto';
    if (/^\d{10,}-/.test(imageName)) return `http://localhost:5000/images/products/${imageName}`;
    return `images/tempProducts/${imageName}`;
  };

  const modalContent = (
    <div className={`fixed inset-0 w-screen h-screen z-100 flex justify-center items-center transition-all duration-300 ${on ? 'opacity-100 visible backdrop-blur-md bg-black/60' : 'opacity-0 invisible pointer-events-none'}`}>
      
      <div 
        className={`bg-[#24201d] border border-white/10 h-[90vh] w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] max-w-6xl
        flex gap-6 relative overflow-hidden flex-col lg:flex-row items-start transition-transform ease-out duration-500 rounded-3xl shadow-2xl
        ${on ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'}`}
        ref={ref}
        onClick={(e) => e.stopPropagation()} 
      >
          <button 
             className='absolute top-4 right-4 z-20 lg:hidden p-2 cursor-pointer bg-black/40 rounded-full text-white'
             onClick={(e) => { e.stopPropagation(); toggleClass(); toggle(); }}
          >
             <FiX size={24}/>
          </button>

         <div className='w-full lg:w-1/2 h-[40vh] lg:h-full bg-black/20 flex justify-center items-center p-4 lg:p-8 relative'>
               {isLowStock && (
                   <div className="absolute top-8 left-8 bg-orange-500/80 backdrop-blur-md text-white font-bold px-4 py-2 rounded-xl shadow-lg border border-orange-400/50 flex items-center gap-2">
                       <FiAlertTriangle /> Pospiesz się, ostatnie {available} sztuki!
                   </div>
               )}
               <img 
                 src={getImageUrl(product.image || product.img)} 
                 alt={product.name} 
                 className={`w-full h-full object-contain drop-shadow-2xl ${isSoldOut ? 'grayscale opacity-70' : ''}`}
               />
         </div>

         <div className='flex-1 h-full flex flex-col justify-between p-6 lg:p-10 w-full overflow-y-auto custom-scrollbar'>
               <div>
                   <div className='flex justify-between items-start mb-6'>
                      <h2 className="text-3xl md:text-4xl font-serif font-bold text-(--font-color)">{product.name}</h2>
                      <button 
                          className='hidden lg:block p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white/50 hover:text-white' 
                          onClick={(e) => { e.stopPropagation(); toggleClass(); toggle(); }}>
                          <FiX size={28}/>
                      </button>
                   </div>

                   <div className='space-y-4 text-(--font-color) opacity-90'>
                      <div className="flex items-center gap-2">
                        <span className="text-(--medium-shade) text-sm uppercase tracking-widest font-bold">Producent</span>
                        <span className="h-px flex-1 bg-white/10"></span>
                        <span className="font-medium">{product.company}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-(--medium-shade) text-sm uppercase tracking-widest font-bold">Nuty Smakowe</span>
                        <span className="h-px flex-1 bg-white/10"></span>
                        <span className="font-medium text-right">{product.flavours || "Brak danych"}</span>
                      </div>
                      
                      <div className="mt-8 pt-6 border-t border-white/10">
                        <h3 className="text-lg font-bold mb-2">Opis</h3>
                        <p className="text-white/70 leading-relaxed font-light text-justify">
                            {product.description || "Ten produkt to kwintesencja smaku Somnium. Wyselekcjonowane ziarna, idealnie wypalone, by dostarczyć Ci niezapomnianych wrażeń w każdej filiżance."}
                        </p>
                      </div>
                   </div>
               </div>

               <div className="mt-8 pt-6 border-t border-white/10 w-full sticky bottom-0 bg-[#24201d] lg:static lg:bg-transparent pb-0">
                   <div className="flex justify-between items-end mb-4">
                      <span className="text-sm uppercase text-white/50">Cena</span>
                      <div className='text-4xl font-bold text-(--medium-shade)'>
                         {product.price} PLN
                      </div>
                   </div>
                   
                   {isSoldOut ? (
                       <div className="bg-white/5 border border-white/10 p-5 rounded-2xl mt-4">
                           <h4 className="text-red-400 font-bold flex items-center gap-2 mb-2"><FiAlertTriangle /> Produkt chwilowo niedostępny</h4>
                           <p className="text-sm text-white/60 mb-4">Zostaw nam swój e-mail, a powiadomimy Cię, gdy ktoś zrezygnuje z koszyka lub produkt wróci na magazyn!</p>
                           
                           {waitlistStatus === 'success' ? (
                               <div className="bg-green-500/10 text-green-400 border border-green-500/20 p-3 rounded-xl flex items-center justify-center gap-2 font-bold">
                                   <FiCheck /> Zapisano na listę!
                               </div>
                           ) : (
                               <form onSubmit={handleWaitlist} className="flex gap-2 mt-2">
                                   <div className="relative flex-1">
                                       { !email && (
                                           <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg pointer-events-none" />
                                       )}
                                       
                                       <input 
                                           type="email" 
                                           required 
                                           placeholder="Twój adres e-mail" 
                                           value={email}
                                           onChange={(e) => setEmail(e.target.value)}
                                           className={`w-full bg-black/30 border border-white/10 rounded-xl py-3 pr-4 text-white focus:outline-none focus:border-(--medium-shade) text-base transition-colors ${!email ? 'pl-11' : 'pl-4'}`}
                                           style={{ paddingLeft: !email ? "2.75rem" : "1rem" }}
                                       />
                                   </div>
                                   <button 
                                       type="submit" 
                                       disabled={waitlistStatus === 'loading'}
                                       className="bg-(--medium-shade) hover:brightness-110 text-[#24201d] px-6 rounded-xl font-bold transition-all cursor-pointer text-sm shadow-[0_0_15px_rgba(143,120,93,0.3)]"
                                   >
                                       {waitlistStatus === 'loading' ? '...' : 'Powiadom'}
                                   </button>
                               </form>
                           )}
                       </div>
                   ) : (
                       <AddToCartButton product={product} />
                   )}
               </div>
         </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}