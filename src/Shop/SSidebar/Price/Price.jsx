import '../../../styles/Shop.css'

function Price() {
  return (
    <div>
      <h2 className="shopSidebar-cat-title">Price</h2>

      <label className="shopSidebar-label-container">
          <input type="radio" name='test2' className='price-input'/>
          <span className="checkmark"></span>
          <div>All</div>
        </label>
      <label className="shopSidebar-label-container">
          <input type="radio" name='test2' className='price-input'/>
          <span className="checkmark"></span>
          <div>0-70zł</div>
        </label>
      <label className="shopSidebar-label-container">
          <input type="radio" name='test2' className='price-input'/>
          <span className="checkmark"></span>
          <div>70+zł</div>
        </label>
    </div>
  )
}

export default Price
