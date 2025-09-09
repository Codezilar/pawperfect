import React from 'react'
import Logo from './ui/Logo'

const Nav = () => {
  return (
    <nav className='nav'>
        <div className="nav-container">
            <Logo />
            <ul>
                <Link href={'/'}>
                    <p>Home</p>
                </Link>
                <Link href={'/'}>
                    <p>Browse Dogs</p>
                </Link>
                <Link href={'/'}>
                    <p>Support</p>
                </Link>
                <Link href={'/'}>
                    <p>About</p>
                </Link>
            </ul>
            <Link href={'/'}>
                <button>
                    Find Your Dog
                </button>
            </Link>
        </div>
    </nav>
  )
}

export default Nav