import React, {useState, useEffect, useRef} from 'react';
import "./navbar.css";
import { Notifications } from '../../interfaces/notifications.interfaces';
import { useAuth } from "../../context/AuthContext";
import ResumoRapidoService from '../../Service/resumo-rapido-service';
import generalHelper from '../../helpers/generalHelper';

function NavBar() {
  const [disableMenu, setDisableMenu] = useState<boolean>(true);
  const [nameDisplayed, setNameDisplayed] = useState<string | null>("Dr. Mobile");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notifications[]>();
  const notificationsRef = useRef<HTMLDivElement>(null);
  const { user, signOut, verifySubscription } = useAuth();
  // Verifica se a rota atual é a de login
  const isLoginPage = window.location.pathname === '/login';
  const isDefaultRoute = window.location.pathname === '/atendimento';
  // Se for a página de login, não renderiza a barra de navegação
  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
      setShowNotifications(false);
    }
  };
  
  const logOut = () =>{
    signOut();
  }

  const redirect = (route: string) => {
    window.location.href = route;
  }

  useEffect(()=>{
    const checkSession = async () => {
    if (user.loginTime) {
      const loginDate = new Date(user.loginTime);
      const currentDate = new Date();
      const diffInMinutes = (currentDate.getTime() - loginDate.getTime()) / 1000 / 60;

      if (diffInMinutes > 720) {
        signOut();
      }
    }
    };

    checkSession();

    if(user){
      verifySubscription(user.token)
    }
  },[])

  useEffect(()=>{
    if(isDefaultRoute){
      setDisableMenu(false);
    } 
  },[isDefaultRoute])

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
    if(user && user.username !== ""){
      var fullName = user.username.split(' ');
      setNameDisplayed(fullName && fullName[0] ? fullName[0] : "Dr.Mobile");
      //verifySubscription(user.token)
    }
    const getNotifications = async () => {
      try{
        if(user){
          let notifications = await ResumoRapidoService.getNotifications(user.token);
          if(notifications && notifications.data){
            setNotifications(notifications.data);
          }
        }
      }catch (e){
          console.log('Erro encontrado:', e);
      }
    }
    getNotifications()
  },[user])

  if (isLoginPage) {
    return null;
  }

  // Caso contrário, renderiza a barra de navegação
  return (
    <nav className='navContainer'>
      <div className='iconDiv' onClick={()=>redirect('/configuracoes')}>
        <img src="resumo-rapido-atendimento-medico-logo-small.svg" alt="Resumo Rapido Logo Small" />
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
            <span className="notificationTitle">Notificações</span>
            <button className="markAllReadButton">Marcar como lidas</button>
          </div>
          <ul className="notificationsList">
            {notifications && notifications.length > 0 ?
              notifications.map((notification)=>(
                <li key={notification._id} className="notificationItem">
                  <img src="user-avatar.png" alt="User Avatar" className="notificationAvatar" />
                  <div className="notificationContent">
                    <p>{generalHelper.getNotificationMessage(notification)}</p>
                    <span className="notificationTime">{generalHelper.formattedDate(notification.createdAt)}</span>
                    {notification.notificationType === 'invite-subscription' &&
                      <div className="buttonContent">
                        <button className='acceptBtn'>Aceitar</button>
                        <button className='refuseBtn'>Recusar</button>
                      </div>
                    }
                  </div>
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