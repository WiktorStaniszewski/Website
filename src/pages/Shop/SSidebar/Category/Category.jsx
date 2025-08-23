import 'styles/Shop.css'
import Input from 'pages/Shop/SComponents/Input'

function Category() {
  return (
    <div className='categoryDiv'>
      <h2 className="shopSidebar-cat-title">Kategorie</h2>
      <div>
        {Input("Wszystko", 1)}
        {Input("Ziarna", 1)}
        {Input("Zaparzarki", 1)}
        {Input("Akcesoria", 1)}
      </div>
    </div>
  )
}

export default Category
