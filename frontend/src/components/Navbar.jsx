import React from 'react'
import {Link} from "react-router-dom"

function Navbar() {
    return (
        <div>
            <div className='flex bg-slate-100 px-28 justify-between text-lg py-3'>
                <div className='font-bold text-2xl'>
                    IPL Vision
                </div>

                <div>
                    <ul className="flex gap-8 text-black text-base">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar