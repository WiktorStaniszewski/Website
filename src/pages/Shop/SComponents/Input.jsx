  function Input({ title, value, handleChange, number, checked }) {
      return (
          <label className="flex items-center relative left-0 cursor-pointer mr-auto text-lg select-none">
            <input
              className='mr-2 focus:outline-none accent-(--darker-bg)'
              onChange={handleChange} 
              type="radio" 
              name={'test'+number} 
              defaultChecked={title==="Wszystko"}
              value={typeof value === 'string' ? value : JSON.stringify(value)} 
              checked={checked} 
            />
            <div>{title}</div>
          </label >
      );
  }

  export default Input;