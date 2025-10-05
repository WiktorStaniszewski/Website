import 'styles/Shop.css'
import Input from 'pages/Shop/SComponents/Input'

function Flavors({handleChange}) {
  return (
    <div>
      <h2 className="shopSidebar-cat-title">Nuty Smakowe</h2>
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
    </div>
  )
}

export default Flavors
