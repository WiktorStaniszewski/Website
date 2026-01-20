function Input({ title, value, handleChange, number, checked }) {
  return (
    <label className="group flex items-center cursor-pointer py-2 select-none relative transition-all duration-300">
      <input
        className="peer sr-only"
        onChange={handleChange}
        type="radio"
        name={'test' + number}
        value={typeof value === 'string' ? value : JSON.stringify(value)}
        checked={checked}
      />
      
      {/* Custom Radio Indicator */}
      <div className="
        w-5 h-5 mr-3 
        rounded-full border border-white/20 bg-black/40 backdrop-blur-sm
        flex items-center justify-center 
        transition-all duration-300 ease-out
        group-hover:border-(--medium-shade)/50
        peer-focus:ring-2 peer-focus:ring-(--medium-shade)/30
        peer-checked:border-(--medium-shade) peer-checked:bg-(--darker-bg)/20
      ">
        {/* Inner Dot */}
        <div 
            className={`
                w-2.5 h-2.5 rounded-full bg-(--medium-shade) 
                shadow-[0_0_8px_rgba(143,120,93,0.6)]
                transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
                ${checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
            `} 
        />
      </div>

      {/* Label Text */}
      <div className={`
          text-sm lg:text-base tracking-wide transition-colors duration-300
          ${checked ? 'text-white font-bold' : 'text-white/60 group-hover:text-white'}
      `}>
        {title}
      </div>
    </label>
  );
}

export default Input;