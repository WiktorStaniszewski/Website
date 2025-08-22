import '../../../styles/Shop.css'

function Flavors() {
  return (
    <div>
      <h2 className="shopSidebar-cat-title">Flavors</h2>
      
      <label className="shopSidebar-label-container">
          <input type="radio" name='test3' className='price-input'/>
          <span className="checkmark"></span>
          <div>All</div>
        </label>
      <label className="shopSidebar-label-container">
          <input type="radio" name='test3' className='price-input'/>
          <span className="checkmark"></span>
          <div>Classic</div>
        </label>
      <label className="shopSidebar-label-container">
          <input type="radio" name='test3' className='price-input'/>
          <span className="checkmark"></span>
          <div>Fruity</div>
        </label>
    </div>
  )
}

export default Flavors
