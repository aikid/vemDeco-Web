import React, {useState, useEffect, useRef} from 'react';
import "./navbar.css";
import { Notifications } from '../../interfaces/notifications.interfaces';
import ResumoRapidoService from '../../Service/resumo-rapido-service';
import generalHelper from '../../helpers/generalHelper';

function NavBar() {
  const [disableMenu, setDisableMenu] = useState<boolean>(true);
  const [nameDisplayed, setNameDisplayed] = useState<string | null>("Dr. Mobile");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notifications[]>();
  const notificationsRef = useRef<HTMLDivElement>(null);
  // Verifica se a rota atual é a de login
  const isLoginPage = window.location.pathname === '/login';
  const isDefaultRoute = window.location.pathname === '/atendimento';
  // Se for a página de login, não renderiza a barra de navegação
  const token = localStorage.getItem("userToken");

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
      setShowNotifications(false);
    }
  };
  
  const logOut = () =>{
    localStorage.setItem("authkey","unlogged");
    localStorage.setItem("userLogger","");
    localStorage.setItem("userToken","");
    localStorage.setItem("loginTime","");
    localStorage.setItem("userPlan","");
    window.location.href = "/";
  }

  const redirect = (route: string) => {
    window.location.href = route;
  }

  useEffect(()=>{
    const checkSession = async () => {
      const loginTime = localStorage.getItem('loginTime');

    if (loginTime) {
      const loginDate = new Date(loginTime);
      const currentDate = new Date();
      const diffInMinutes = (currentDate.getTime() - loginDate.getTime()) / 1000 / 60;

      if (diffInMinutes > 60) {
        logOut();
      }
    }
    };

    checkSession();
  },[])

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

  useEffect(() => {
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  useEffect(()=>{
    const getNotifications = async () => {
      try{
        if(token){
          let notifications = await ResumoRapidoService.getNotifications(token);
          if(notifications && notifications.data){
              setNotifications(notifications.data);
          }
        }
      }catch (e){
          console.log('Erro encontrado:', e);
      }
    }
    getNotifications()
  },[token])

  if (isLoginPage) {
    return null;
  }

  // Caso contrário, renderiza a barra de navegação
  return (
    <nav className='navContainer'>
      <div className='iconDiv' onClick={()=>redirect('/configuracoes')}>
        <img src="RRIcon.svg" alt="" />
        <img style={{marginLeft:"5px"}}  src="RRINI.svg" alt="" />
        {/* <img style={{marginLeft:"5px", height:"35px", marginTop:"5px"}}  src="logoSC.png" alt="" /> */}
      </div>
      <div className='rightSide'>
        <img className='bell' src="Bell_pin.svg" alt="Notificações" onClick={handleBellClick}/>
        <img className='line' src="Line 8.svg" alt="" />
        {disableMenu ? (
          <>
            <div className='accountText'>
              <button className="buttonLinkCustom" onClick={()=>redirect('/atendimento')}>Voltar para atendimento</button>
            </div>  
          </>
        ):(
          <>
            <div className='roundInitials'>DM</div>
            <div className='accountText'>
              <div>{nameDisplayed}</div>
              <button className="buttonLink" onClick={()=>redirect('/configuracoes')}>Configurações</button>
            </div>  
          </>
        )}
        
        <img style={{marginLeft:"5px", marginRight:"5px"}} src="Line 8.svg" alt="" />
        <div className='logOutLink'>
          <button onClick={()=>logOut()}>Sair</button>
        </div>
      </div>
      {showNotifications && (
        <div className="notificationsContainer" ref={notificationsRef}>
          <div className="notificationsHeader">
            <span>Notificações</span>
            <button className="markAllReadButton">Marcar como lidas</button>
          </div>
          <ul className="notificationsList">
            {notifications && notifications.length > 0 ?
              notifications.map((notification)=>(
                <li key={notification._id} className="notificationItem">
                  <img src="user-avatar.png" alt="User Avatar" className="notificationAvatar" />
                  <div className="notificationContent">
                    <p>{generalHelper.getNotificationMessage(notification.notificationType)}</p>
                    <span className="notificationTime">{generalHelper.formattedDate(notification.createdAt)}</span>
                  </div>
                  <button className="notificationOptions">⋮</button>
                </li>
              )):(
              <p className='notificationInfo'>Não há novas notificações</p>
            )}
          </ul>
          <div className="seeAllButtonContainer">
            <button className="seeAllButton">Ver todas</button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;