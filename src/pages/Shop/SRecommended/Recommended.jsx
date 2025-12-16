import 'styles/Shop.css'

function Recommended({filters}) {
    return (
        <div className='flex flex-col justify-center items-center recommended-section lg:items-start'>
            <h2 className='flex justify-center items-center py-6 font-semibold text-2xl mx-5'>Recommended</h2>
            <div className='grid grid-cols-2 gap-4 justify-center items-center mb-6 px-4 lg:flex lg:flex-row flex-wrap'>
                <button onClick={filters.handleCategoryChange} className='mainButton text-sm border-0' value="">Wszystko</button>
                <button onClick={filters.handleCategoryChange} className='mainButton text-sm' value="ziarna">Ziarna</button>
                <button onClick={filters.handleCategoryChange} className='mainButton text-sm' value="zaparzarki">Zaparzarki</button>
                <button onClick={filters.handleCategoryChange} className='mainButton text-sm' value="akcesoria">Akcesoria</button>
            </div>
        </div>
    )
}

export default Recommended;