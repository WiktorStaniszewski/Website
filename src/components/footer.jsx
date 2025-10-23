import { Link } from 'react-router-dom'

function Footer() {
    return(
    <footer className='flex flex-col w-full bottom-0 bg-(--header-footer-bg) overflow-hidden'>
        <div className='flex flex-row justify-evenly text-center px-[3vw] py-4 border-b'>
            <div className='max-w-50'>
                <div>
                    <Link to="/"><img className='cursor-pointer w-50' src="images/logo body_biale.png" alt="logo" /></Link>
                    <h4>Espresso Bar</h4>
                </div>
            </div>
        </div>
        <div className="text-center text-sm">&copy; All Rights Reserved by Wiktor Staniszewski</div>
    </footer>
)}

export default Footer