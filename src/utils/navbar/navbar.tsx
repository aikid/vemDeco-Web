import React, {useState, useEffect} from 'react';
import "./navbar.css";

function NavBar() {
  const [disableMenu, setDisableMenu] = useState<boolean>(true);
  const [nameDisplayed, setNameDisplayed] = useState<string | null>("Dr. Mobile");
  // Verifica se a rota atual é a de login
  const isLoginPage = window.location.pathname === '/login';
  const isDefaultRoute = window.location.pathname === '/atendimento';
  // Se for a página de login, não renderiza a barra de navegação
  
  const logOut = () =>{
    localStorage.setItem("authkey","unlogged");
    localStorage.setItem("userLogger","");
    localStorage.setItem("userToken","");
    window.location.href = "/";
  }

  const redirect = (route: string) => {
    window.location.href = route;
  }

  useEffect(()=>{
    if(isDefaultRoute){
      setDisableMenu(false);
    } 
  },[isDefaultRoute])

  useEffect(()=>{
    if(localStorage.getItem("userLogger") !== null && localStorage.getItem("userLogger") !== ""){
      var fullName = localStorage.getItem("userLogger")?.split(' ');
      setNameDisplayed(fullName && fullName[0] ? fullName[0] : "Dr.Mobile");
    }
  },[])

  if (isLoginPage) {
    return null;
  }

  // Caso contrário, renderiza a barra de navegação
  return (
    <nav className='navContainer'>
      <div className='iconDiv'>
        <img src="RRIcon.svg" alt="" />
        <img style={{marginLeft:"5px"}}  src="RRINI.svg" alt="" />
        {/* <img style={{marginLeft:"5px", height:"35px", marginTop:"5px"}}  src="logoSC.png" alt="" /> */}
      </div>
      <div className='rightSide'>
        <img style={{marginLeft:"50px"}} src="Bell_pin.svg" alt="" />
        <img style={{marginLeft:"5px", marginRight:"5px"}} src="Line 8.svg" alt="" />
        {disableMenu ? (
          <>
            <div className='accountText'>
              <button className="buttonLinkCustom" onClick={()=>redirect('/atendimento')}>Voltar para o atendimento</button>
            </div>  
          </>
        ):(
          <>
            <div className='roundInitials'>DM</div>
            <div className='accountText'>
              <div>{nameDisplayed}</div>
              <button className="buttonLink" onClick={()=>redirect('/conta')}>Ver conta</button>
            </div>  
          </>
        )}
        
        <img style={{marginLeft:"5px", marginRight:"5px"}} src="Line 8.svg" alt="" />
        <div className='logOutLink'>
          <button onClick={()=>logOut()}>Sair</button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;