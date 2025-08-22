import '../../../styles/Shop.css'

function Category() {
  return (
    <div className='categoryDiv'>
      <h2 className="shopSidebar-cat-title">Category</h2>

      <div>
        <label className="shopSidebar-label-container">
          <input type="radio" name='test' className='category-input'/>
          <span className="checkmark"></span>
          <div>All</div>
        </label>
        <label className="shopSidebar-label-container">
          <input type="radio" name='test' className='category-input'/>
          <span className="checkmark"></span>
          <div>Beans</div>
        </label>
        <label className="shopSidebar-label-container">
          <input type="radio" name='test' className='category-input'/>
          <span className="checkmark"></span>
          <div>Brewers</div>
        </label>
        <label className="shopSidebar-label-container">
          <input type="radio" name='test' className='category-input'/>
          <span className="checkmark"></span>
          <div>Accessories</div>
        </label>
      </div>
    </div>
  )
}

export default Category
