import React from 'react'
import './NavLinks.scss'
import { AuthContext } from '../Context/AuthContext'

import { NavLink } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout'

const NavLinks = (props) => {

  const {isLoggedIn, logout, userId} = React.useContext(AuthContext)

  return (
    <ul className='nav-links'>
      <li>
        <NavLink to='/home' end>Home</NavLink>
      </li>
      <li>
        <NavLink to='/' end>All Users</NavLink>
      </li>
  

      {isLoggedIn &&(
        <li style={{position: 'relative'}}>
          <NavLink to={`/${userId}/recipes`}>My RecipeBook</NavLink>
        </li>
        )}

      {isLoggedIn &&( 
        <li>
          <NavLink to='/recipes/new'>Add Recipe</NavLink>
        </li>
      )}

      {!isLoggedIn && (
        <li>
          <NavLink to='/auth'>Log in</NavLink>
        </li>
      )}

      {isLoggedIn && (
        <li>
          <button onClick={logout}> <LogoutIcon sx={{ color:'#798764', height:'1.3rem', "&:hover": {transition: 'ease .8s', color:'#f1533a', scale:'1.1'}}} /> </button>
        </li>
      ) }
    </ul>
  )
}

export default NavLinks