import React from 'react';
import { Link } from 'react-router-dom';
import "./navbar.css";

function NavBar() {
  // Verifica se a rota atual é a de login
  const isLoginPage = window.location.pathname === '/login';

  // Se for a página de login, não renderiza a barra de navegação
  if (isLoginPage) {
    return null;
  }

  // Caso contrário, renderiza a barra de navegação
  return (
    <nav className='navContainer'>
      <div className='iconDiv'>
        <img style={{marginLeft:"50px"}} src="RRIcon.svg" alt="" />
        <img style={{marginLeft:"5px"}}  src="RRINI.svg" alt="" />
      </div>
      <div className='rightSide'>
        <img style={{marginLeft:"50px"}} src="Bell_pin.svg" alt="" />
        <img style={{marginLeft:"5px", marginRight:"5px"}} src="Line 8.svg" alt="" />
        <div className='roundInitials'>DM</div>
        <div className='accountText'>
          <div>Dr. Mobile</div>
          <a >Ver conta</a>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;