function Input(prompt, fName) {
    return (
        <label className="shopSidebar-label-container">
          <input type="radio" name={'test'+fName} className='input'/>
          <span className="checkmark"></span>
          <div>{prompt}</div>
        </label>
    )
}

export default Input