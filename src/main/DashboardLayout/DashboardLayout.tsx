import React, { useEffect } from 'react';
import { AppBar, Box, CssBaseline, Drawer, IconButton, Toolbar } from '@mui/material';
import { useAuth } from "../../context/AuthContext";
import { Activity, Bell, LogOut, NotepadText, Settings, Wallet } from 'lucide-react';
import './DashboardLayout.css';

const DashboardLayout: React.FC<{ children: React.ReactNode, title?: string }> = ({ children, title }) => {
  title = title !== "" ? title : "Atendimento"
  const { user, signOut, verifySubscription } = useAuth();

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
  );
}

export default DashboardLayout;
