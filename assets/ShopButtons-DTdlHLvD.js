import{z as A,r as f,j as e,q as g,O as h,P as j,Q as p}from"./index-DwLvrPMU.js";const v=({product:s,compact:w=!1,className:l=""})=>{const{addToCart:y,cartItems:C}=A(),[n,c]=f.useState(!1),[o,m]=f.useState(!1),x=C.find(d=>d.id===(s.id||s.name)),k=x?x.quantity:0,u=s.stockQuantity||0,t=u<=0,a=k>=u,r=t||a||o,b=async d=>{if(d.stopPropagation(),r)return;m(!0);const z={id:s.id||s.name,title:s.name,price:Number(s.price),img:s.image||s.img,...s},N=await y(z);m(!1),N&&(c(!0),setTimeout(()=>c(!1),1500))};let i="Dodaj do koszyka";return o?i="Dodawanie...":t?i="Wyprzedane":a?i="Max. ilość w koszyku":n&&(i="Dodano!"),w?e.jsx("button",{onClick:b,disabled:r,className:`
                    flex items-center justify-center p-3 rounded-full transition-all duration-300 ease-in-out shadow-lg
                    ${t||a?"bg-red-500/10 text-red-400 opacity-50 cursor-not-allowed border border-red-500/20":n?"bg-green-500 text-[#24201d]":"bg-(--medium-shade) text-[#24201d] hover:brightness-110 hover:scale-110 cursor-pointer"}
                    ${l}
                `,title:i,children:o?e.jsx(g,{className:"animate-spin",size:18}):t||a?e.jsx(h,{size:18}):n?e.jsx(j,{size:18}):e.jsx(p,{size:18})}):e.jsxs("button",{onClick:b,disabled:r,className:`
                flex w-full justify-center items-center gap-3 px-6 py-4 mt-4 
                rounded-xl transition-all duration-200 ease-in-out border font-bold text-sm md:text-base shadow-lg
                ${t||a?"bg-red-500/10 text-red-400 border-red-500/20 cursor-not-allowed opacity-70":n?"bg-green-500 text-[#24201d] border-green-500":"bg-(--medium-shade) hover:bg-(--button-hover-bg) text-[#24201d] border-(--medium-shade) cursor-pointer"}
                ${l}
            `,children:[e.jsx("span",{className:"select-none",children:i}),o?e.jsx(g,{className:"h-5 w-5 animate-spin"}):t||a?e.jsx(h,{className:"h-5 w-5"}):n?e.jsx(j,{className:"h-5 w-5 animate-bounce text-[#24201d]"}):e.jsx(p,{className:"h-5 w-5"})]})};export{v as A};
