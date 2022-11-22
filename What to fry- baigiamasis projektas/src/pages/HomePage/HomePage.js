import React from 'react'
import { Link } from "react-router-dom";
import './HomePage.scss'

const HomePage = () => {
    return (
        <div className='banner-wrapper' id='banner'>
           <div className='description-wrapper'>
               <h1><span style={{color:'#f0533a'}}>w</span>hat <span style={{color:'#f0533a'}}>t</span>o <span style={{color:'#f0533a'}}>f</span>ry </h1>
               <p>Users friendly online recipe book</p>
               <div className='btn-wrapper'>
                   <Link className="btn" to="/">All Users and their recipes</Link >
               </div>
           </div>
      
   
       </div>
       )  
}

export default HomePage