import 'styles/Shop.css'
import Input from 'pages/Shop/SComponents/Input'

function Category({handleChange}) {
  return (
    <div className='categoryDiv'>
      <h2 className="shopSidebar-cat-title">Kategorie</h2>
      <div>
        <Input 
          title="Wszystko"
          value=""
          handleChange={handleChange}
          number={1}
        />
        <Input 
          title="Ziarna"
          value="beans"
          handleChange={handleChange}
          number={1}
        />
        <Input 
          title="Zaparzarki"
          value="brewers"
          handleChange={handleChange}
          number={1}
        />
        <Input 
          title="Akcesoria"
          value="accessory"
          handleChange={handleChange}
          number={1}
        />
      </div>
    </div>
  )
}

export default Category
