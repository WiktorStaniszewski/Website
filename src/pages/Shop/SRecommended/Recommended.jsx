import 'styles/Shop.css'
import { useViewport } from 'src/components/hooks/useViewport';

function Recommended({handleClick}) {
    const { isMobile } = useViewport();
    return (
        <div className={!isMobile ? 'recommended-section' : 'recommended-section-mobile'}>
            <h2 className='recommended-title'>Recommended</h2>
            <div className="recommended-flex">
                <button onClick={handleClick} className='rec-btn' value="">Wszystko</button>
                <button onClick={handleClick} className='rec-btn' value="ziarna">Ziarna</button>
                <button onClick={handleClick} className='rec-btn' value="zaparzarki">Zaparzarki</button>
                <button onClick={handleClick} className='rec-btn' value="akcesoria">Akcesoria</button>
            </div>
        </div>
    )
}

export default Recommended;