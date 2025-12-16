import { AddToCartButton } from "./Buttons";
import { FiX } from "react-icons/fi";

export const ProductDetails = ({product, on, toggle, toggleClass, ref}) => {
  return (
    <div className={`fixed w-full h-screen left-0 flex justify-center items-center z-25  ${on ? 'backdrop-blur-sm top-0' : ''}`}>
      <div className={`h-9/10 my-8 w-9/10 sm:w-120 lg:w-8/10 xl:w-6/10 lg:h-8/10 
      flex gap-4 relative overflow-y-auto not-lg:flex-col items-start transition-all ease-in-out duration-500                
      rounded-3xl shadow-[1px_3px_10px_var(--header-footer-bg)] bg-(--darker-bg)  ${on ? 'top-0' : 'top-[100vh]'}`}
      ref={ref}>
         <div className='w-full h-full flex lg:ml-8 justify-center lg:items-center'>
               <img src={"images/tempProducts/"+product.image} alt={product.name} className='w-full mt-8 rounded-xl max-w-100'/>
         </div>
         <div className='h-9/10 flex w-9/10 flex-col justify-between mx-4 my-8 px-4'>
               <div className='flex justify-between w-full items-center pb-4'>
                  <h2 className="text-3xl font-semibold mb-4">{product.name}</h2>
                  <div className='headerButton text-4xl' 
                  onClick={e => {
                     toggleClass();
                     toggle();
                  }}>
                     <FiX className='mainButton'/>
                  </div>
               </div>
               <div className='flex flex-col gap-2'>
                  <p>Firma: {product.company}</p>
                  <p>Smak: {product.flavours}</p>
                  <p>Rodzaj: {product.type}</p>
                  <p className="mb-4"> {product.description}</p>
                  <div className="card-price">
                     <div className='text-3xl'>
                     {product.price}PLN
                     </div>
                  </div>
               </div>
               <AddToCartButton />
         </div>
      </div>
   </div>
  )
}

