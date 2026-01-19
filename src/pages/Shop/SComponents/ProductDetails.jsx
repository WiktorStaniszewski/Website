import { AddToCartButton } from "./Buttons";
import { FiX } from "react-icons/fi";

// Note: `ref` needs to be forwarded if using it on the wrapper div directly, 
// but since you are passing it as a prop from useClickAway, this works fine.
export const ProductDetails = ({ product, on, toggle, toggleClass, ref }) => {
  
  return (
    <div className={`fixed w-full h-screen left-0 top-0 flex justify-center items-center z-50 transition-all duration-300 ${on ? 'opacity-100 visible backdrop-blur-sm' : 'opacity-0 invisible pointer-events-none'}`}>
      
      <div 
        className={`bg-(--darker-bg) h-9/10 my-8 w-9/10 sm:w-120 lg:w-8/10 xl:w-6/10 lg:h-8/10 
        flex gap-4 relative overflow-y-auto not-lg:flex-col items-start transition-transform ease-in-out duration-500 rounded-3xl shadow-[0px_0px_30px_rgba(0,0,0,0.5)]
        ${on ? 'translate-y-0' : 'translate-y-[100vh]'}`}
        ref={ref}
      >
         {/* Image Section */}
         <div className='w-full lg:w-1/2 h-full flex justify-center lg:items-center p-4'>
               <img src={"images/tempProducts/" + product.image} alt={product.name} className='w-full h-auto rounded-xl object-contain max-h-[80%]'/>
         </div>

         {/* Info Section */}
         <div className='h-auto lg:h-full flex lg:w-1/2 flex-col justify-between p-8'>
               <div>
                   <div className='flex justify-between w-full items-start pb-4'>
                      <h2 className="text-3xl font-bold mb-4 leading-tight">{product.name}</h2>
                      <div className='cursor-pointer hover:rotate-90 transition-transform duration-300 p-2' 
                          onClick={(e) => {
                             e.stopPropagation();
                             toggleClass();
                             toggle();
                          }}>
                          <FiX size={32}/>
                      </div>
                   </div>

                   <div className='flex flex-col gap-3 text-lg'>
                      <p><span className="font-semibold">Firma:</span> {product.company}</p>
                      <p><span className="font-semibold">Smak:</span> {product.flavours}</p>
                      <p><span className="font-semibold">Rodzaj:</span> {product.type}</p>
                      <p className="mt-4 text-gray-300 leading-relaxed text-base">{product.description}</p>
                   </div>
               </div>

               <div className="mt-8">
                   <div className="card-price mb-4">
                      <div className='text-4xl font-bold text-white'>
                         {product.price} PLN
                      </div>
                   </div>
                   
                   {/* PASSED PRODUCT PROP HERE */}
                   <AddToCartButton product={product} className="w-full py-4 text-lg hover:scale-105 hover:rotate-1" />
               </div>
         </div>
      </div>
    </div>
  )
}