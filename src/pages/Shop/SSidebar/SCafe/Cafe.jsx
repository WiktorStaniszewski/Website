import 'styles/Shop.css'
import Input from 'pages/Shop/SComponents/Input'


function Cafe({handleChange}) {
  return (
    <div>
      <h2 className="shopSidebar-cat-title">Kawiarnia</h2>
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
    </div>
  )
}

export default Cafe
