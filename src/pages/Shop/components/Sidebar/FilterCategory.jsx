import 'styles/Shop.css'
import Input from '../SearchRadio'

function Category({handleChange}) {
  return (
        <fieldset className='block'>
          <legend className="categoryTitle">Kategorie</legend>
          <Input 
            title="Wszystko"
            value=""
            handleChange={handleChange}
            number={1}
          />
          <Input 
            title="Ziarna"
            value="ziarna"
            handleChange={handleChange}
            number={1}
          />
          <Input 
            title="Zaparzarki"
            value="zaparzarki"
            handleChange={handleChange}
            number={1}
          />
          <Input 
            title="Akcesoria"
            value="akcesoria"
            handleChange={handleChange}
            number={1}
          />
        </fieldset>
  )
}

export default Category
