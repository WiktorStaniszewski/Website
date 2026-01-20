import 'src/styles/Shop.css'
import Input from '../SearchRadio'

function Price({handleChange}) {
  return (
      <fieldset>
        <legend className="categoryTitle">Cena</legend>
        <Input title="Wszystko" value="" handleChange={handleChange} number={2} />
        <Input title="0-50zł" value={[0, 50]} handleChange={handleChange} number={2} />
        <Input title="51-70zł" value={[51, 70]} handleChange={handleChange} number={2} />
        <Input title="71-90zł" value={[71, 90]} handleChange={handleChange} number={2} />
        <Input title="91-110zł" value={[91, 110]} handleChange={handleChange} number={2} />
        <Input title="110+zł" value={[111, Infinity]} handleChange={handleChange} number={2} />
      </fieldset>
  )
}

export default Price
