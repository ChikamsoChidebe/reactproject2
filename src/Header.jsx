import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <div className='h-[60px] flex justify-between bg-slate-500 px-[300px] items-center text-white'>
        <div>
            <h1 className=' text-3xl font-bold'>Logo</h1>
        </div>
        <nav>
            <ul className=' flex gap-[30px]'>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
        </nav>
    </div>
  )
}

export default Header