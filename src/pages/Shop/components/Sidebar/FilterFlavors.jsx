import 'styles/Shop.css'
import Input from '../SearchRadio'

function Flavors({handleChange}) {
  return (
      <fieldset>
        <legend className="categoryTitle">Nuty Smakowe</legend>
        <Input 
            title="Wszystko"
            value=""
            handleChange={handleChange}
            number={3}
        />
        <Input 
            title="Klasyki"
            value="klasyki"
            handleChange={handleChange}
            number={3}
        />
        <Input 
            title="Owocowe"
            value="owocowe"
            handleChange={handleChange}
            number={3}
        />
      </fieldset>
  )
}

export default Flavors
