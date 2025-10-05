import 'styles/Shop.css'

function Recommended({handleClick}) {
    return (
        <>
        <div>
            <h2 className='recommended-title'>Recommended</h2>
            <div className="recommended-flex">
                <button onClick={handleClick} className='rec-btn' value="">All Products</button>
                <button onClick={handleClick} className='rec-btn' value="beans">Beans</button>
                <button onClick={handleClick} className='rec-btn' value="brewers">Brewers</button>
                <button onClick={handleClick} className='rec-btn' value="accessory">Accessories</button>
            </div>
        </div>
        </>
    )
}

export default Recommended;