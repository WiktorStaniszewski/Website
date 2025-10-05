function Input({ title, value, handleChange,number }) {
    return (
        <label className="shopSidebar-label-container">
          <input 
            onChange={handleChange} 
            type="radio" 
            name={'test'+number} 
            //defaultChecked={title==="Wszystko"}
            className='input' 
            value={typeof value === 'string' ? value : JSON.stringify(value)} 
          />
          <span className="checkmark"></span>
          <div>{title}</div>
        </label>
    );
}

export default Input;