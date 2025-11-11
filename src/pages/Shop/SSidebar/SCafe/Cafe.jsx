import 'styles/Shop.css'
import Input from 'pages/Shop/SComponents/Input'


function Cafe({handleChange}) {
  return (
      <fieldset>
        <legend className="categoryTitle">Kawiarnia</legend>
        <Input 
          title="Wszystko"
          value=""
          handleChange={handleChange} 
          number={4}
        />
        <Input 
          title="Body"
          value="Body"
          handleChange={handleChange} 
          number={4}
        />
        <Input 
          title="Somnium"
          value="Somnium"
          handleChange={handleChange} 
          number={4}
        />
      </fieldset>
  )
}

export default Cafe
