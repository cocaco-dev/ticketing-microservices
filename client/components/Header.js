import React from 'react';
import Link from 'next/link'

export default function Header({currentUser}) {
    
    return (
        <nav className="navbar navbar-light bg-light">
            <Link href="/">
                <a className="navbar-brand">Microservices</a>
            </Link>
            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    {currentUser?
                    (
                        <>
                        <li className="nav-item"><Link href="/tickets/new"><a className="nav-link">New Ticket</a></Link></li>
                        <li className="nav-item"><Link href="/orders"><a className="nav-link">My Orders</a></Link></li>
                        <li className="nav-item"><Link href="/auth/signout"><a className="nav-link">Sign Out</a></Link></li>
                        </>
                    )
                    :
                    (
                        <>
                        <li className="nav-item"><Link href="/auth/signin"><a className="nav-link">Sign In</a></Link></li>
                        <li className="nav-item"><Link href="/auth/signup"><a className="nav-link">Sign Up</a></Link></li>
                        </>
                    )}
                    
                </ul>

            </div>
        </nav>
    )
}