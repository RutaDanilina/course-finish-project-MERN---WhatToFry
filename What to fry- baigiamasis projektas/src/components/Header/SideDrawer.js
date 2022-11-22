import React from 'react'
import './SideDrawer.scss'
import ReactDOM from 'react-dom'
import logo from '../../img/sviesus-logo.png'


import { CSSTransition } from 'react-transition-group'

const SideDrawer = (props) => {
  const content = (
    <CSSTransition
      in={props.show}
      timeout={500}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={props.onClick}>{props.children}
      <img className='side-drawer-logo' src={logo} alt='logo'/>

      </aside>

    </CSSTransition>
  );

  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'))
}

export default SideDrawer