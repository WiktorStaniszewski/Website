import 'styles/Shop.css'
import Input from 'pages/Shop/SComponents/Input'


function Cafe() {
  return (
    <div>
      <h2 className="shopSidebar-cat-title">Kawiarnia</h2>
      {Input("Wszystkie", 4)}
      {Input("Body", 4)}
      {Input("Somnium", 4)}
    </div>
  )
}

export default Cafe
