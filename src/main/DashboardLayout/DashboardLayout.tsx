import React, { useEffect, useState } from 'react';
import { AppBar, Backdrop, Box, CssBaseline, Drawer, IconButton, SpeedDial, SpeedDialAction, SpeedDialIcon, Toolbar } from '@mui/material';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { Activity, Bell, LogOut, NotepadText, Settings, Wallet } from 'lucide-react';
import './DashboardLayout.css';


const DashboardLayout: React.FC<{ children: React.ReactNode, title?: string }> = ({ children, title }) => {
  title = title !== "" ? title : "Atendimento";
  const navigate = useNavigate();
  const { user, signOut, verifySubscription } = useAuth();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const actions = [
    { icon: <LogOut />, name: 'Sair', action: () => handleLogout() },
    { icon: <Settings />, name: 'Configurações', route: '/conta'},
    { icon: <Wallet />, name: 'Planos', route: '/planos'},
    { icon: <NotepadText />, name: 'Prompt', route: '/prompt' },
    { icon: <Bell />, name: 'Notificações', route: '/notifications'},
    { icon: <Activity />, name: 'Atendimento', route: '/atendimento' },
  ];

  const handleLogout = () => {
    signOut();
  };

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
  
  return (
    <div className="dashLayout">
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        {/* Menu Lateral */}
        <Drawer
          variant="permanent"
          className="mainMenu"
        >
          <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <a href="/atendimento"><img src='dr-mobile-inteligencia-medica-logo.png' alt='Dr.Mobile Logo' title='Dr.Mobile Logo' className="menuLogo" /></a>
            <IconButton href="/atendimento" size="large">
              <Activity />
            </IconButton>
            <IconButton href="/notifications" size="large">
              <Bell />
            </IconButton>
            <IconButton href="/prompt" size="large">
              <NotepadText />
            </IconButton>
            <IconButton href="/planos" size="large">
              <Wallet />
            </IconButton>
            <div className="bottomItens">
              <IconButton href="/conta" size="large">
                <Settings />
              </IconButton>
              <IconButton onClick={()=> signOut()} size="large">
                <LogOut />
              </IconButton>
            </div>
          </Box>
        </Drawer>

        {/* Conteúdo Principal */}
        <Box className="mainContainer" component="main">
          {/* Cabeçalho */}
          <AppBar position="static" color="transparent" elevation={0} className="headerBar">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <h5 className="menuTitle">{title}</h5>
            </Toolbar>
          </AppBar>

          {/* Conteúdo Dinâmico */}
          <Box>
            {children}
          </Box>
        </Box>
      </Box>

      {/* Menu Mobile */}
      {/* <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          action.route ? (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => navigate(action.route)}
            />
          ) : (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.action}
            />
          )
        ))}
      </SpeedDial> */}
    </div>
  );
}

export default DashboardLayout;
