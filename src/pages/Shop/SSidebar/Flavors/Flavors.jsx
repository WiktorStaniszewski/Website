import 'styles/Shop.css'
import Input from 'pages/Shop/SComponents/Input'

function Flavors() {
  return (
    <div>
      <h2 className="shopSidebar-cat-title">Nuty Smakowe</h2>
      
      {Input("Wszystko", 2)}
      {Input("Klasyki", 2)}
      {Input("Owocowe", 2)}
    </div>
  )
}

export default Flavors
