import React from 'react'
import './BackToTop.scss'

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const BackToTop = () => {

    const [visible, setVisible] = React.useState(false)

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300){
          setVisible(true)
        } 
        else if (scrolled <= 300){
          setVisible(false)
        }
      };
      
      const scrollToTop = () =>{
        window.scrollTo({
          top: 0, 
          behavior: 'smooth'
        });
      };
      
      window.addEventListener('scroll', toggleVisible);


  return (
    <button onClick={scrollToTop} className='backWrapper' >
        <KeyboardArrowUpIcon sx={{ height:'30px', width:'30px', display: visible ? 'inline' : 'none'}} className='toTop' />
    </button>
  )
}

export default BackToTop