import 'src/styles/Shop.css'
import Input from 'pages/Shop/SComponents/Input'

function Price() {
  return (
    <div>
      <h2 className="shopSidebar-cat-title">Cena</h2>
      {Input("Wszystko", 3)}
      {Input("0-70zł", 3)}
      {Input("71+zł", 3)}
    </div>
  )
}

export default Price
