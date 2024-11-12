import React, { useEffect, useState } from 'react';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import { Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Notifications } from '../../interfaces/notifications.interfaces';
import ResumoRapidoService from '../../Service/resumo-rapido-service';
import "./notification.css";
import generalHelper from '../../helpers/generalHelper';

function Notification() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notifications[]>();
  
  useEffect(()=>{
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

  return (
    <DashboardLayout title="Notificações">
      {/* Conteúdo específico do Dashboard aqui */}
      <div className="notificationContainer">
        {notifications && notifications?.length > 0 ? (
          notifications.map((notification)=>(
            <div className="noNotificationBox">
              <p>{generalHelper.getNotificationMessage(notification)}</p>
              <span className="notificationTime">{generalHelper.formattedDate(notification.createdAt)}</span>
              {/* {notification.notificationType === 'invite-subscription' &&
                <div className="buttonContent">
                  <button className='acceptBtn'>Aceitar</button>
                  <button className='refuseBtn'>Recusar</button>
                </div>
              } */}
            </div>
          ))
        ):(
          <div className="noNotificationBox">
            <p>Ainda não há notificações</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Notification;
