import { AddToCartButton } from "./ShopButtons";
import { FiX } from "react-icons/fi";
import { createPortal } from 'react-dom';

// Using React Portal ensures the modal is rendered at the top level of the DOM (usually document.body),
// preventing it from being affected by parent transforms or overflow:hidden.
export const ProductDetails = ({ product, on, toggle, toggleClass, ref }) => {
  
  const modalContent = (
    <div className={`fixed inset-0 w-screen h-screen z-100 flex justify-center items-center transition-all duration-300 ${on ? 'opacity-100 visible backdrop-blur-md bg-black/60' : 'opacity-0 invisible pointer-events-none'}`}>
      
      <div 
        className={`bg-[#24201d] border border-white/10 h-[90vh] w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] max-w-6xl
        flex gap-6 relative overflow-hidden flex-col lg:flex-row items-start transition-transform ease-out duration-500 rounded-3xl shadow-2xl
        ${on ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'}`}
        ref={ref}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
          {/* Close Button Mobile - Floating */}
          <button 
             className='absolute top-4 right-4 z-20 lg:hidden p-2 bg-black/40 rounded-full text-white'
             onClick={(e) => {
                 e.stopPropagation();
                 toggleClass();
                 toggle();
             }}
          >
             <FiX size={24}/>
          </button>

         {/* Image Section */}
         <div className='w-full lg:w-1/2 h-[40vh] lg:h-full bg-black/20 flex justify-center items-center p-4 lg:p-8 relative'>
               <img 
                 src={"images/tempProducts/" + product.image} 
                 alt={product.name} 
                 className='w-full h-full object-contain drop-shadow-2xl'
               />
         </div>

         {/* Info Section */}
         <div className='flex-1 h-full flex flex-col justify-between p-6 lg:p-10 w-full overflow-y-auto custom-scrollbar'>
               <div>
                   <div className='flex justify-between items-start mb-6'>
                      <h2 className="text-3xl md:text-4xl font-serif font-bold text-(--font-color)">{product.name}</h2>
                      
                      {/* Desktop Close Button */}
                      <button 
                          className='hidden lg:block p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white/50 hover:text-white' 
                          onClick={(e) => {
                             e.stopPropagation();
                             toggleClass();
                             toggle();
                          }}>
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
                        <span className="font-medium text-right">{product.flavours}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-(--medium-shade) text-sm uppercase tracking-widest font-bold">Rodzaj</span>
                        <span className="h-px flex-1 bg-white/10"></span>
                        <span className="font-medium">{product.type}</span>
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
                   
                   {/* Full Size Button */}
                   <AddToCartButton product={product} />
               </div>
         </div>
      </div>
    </div>
  );

  // Use Portal to render outside the current DOM hierarchy (fixing scroll/transform issues)
  return createPortal(modalContent, document.body);
}