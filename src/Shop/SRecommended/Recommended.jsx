import '../../styles/Shop.css'

function Recommended() {
    return (
        <>
        <div>
            <h2 className='recommended-title'>Recommended</h2>
            <div className="recommended-flex">
                <button className='rec-btn'>All Products</button>
                <button className='rec-btn'>Beans</button>
                <button className='rec-btn'>Brewers</button>
                <button className='rec-btn'>Accessories</button>
                <button className='rec-btn'>Drip Bags</button>
            </div>
        </div>
        </>
    )
}

export default Recommended;