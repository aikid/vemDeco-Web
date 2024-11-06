import React from 'react';
import { AppBar, Box, Button, CssBaseline, Divider, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import { Home, Notifications, CalendarToday, Note } from '@mui/icons-material';
import { useAuth } from "../../context/AuthContext";
import AddIcon from '@mui/icons-material/Add';
import PauseIcon from '@mui/icons-material/Pause';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import './DashboardLayout.css';

const drawerWidth = 50;

const DashboardLayout: React.FC<{ children: React.ReactNode, title?: string }> = ({ children, title }) => {
  title = title !== "" ? title : "Atendimento"
  const { signOut } = useAuth();
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
            <MonitorHeartOutlinedIcon />
          </IconButton>
          <IconButton href="/dashboard" size="large">
            <NotificationsOutlinedIcon />
          </IconButton>
          <IconButton href="/prompt" size="large">
            <EventNoteOutlinedIcon />
          </IconButton>
          <IconButton href="/planos" size="large">
            <AccountBalanceWalletOutlinedIcon />
          </IconButton>
          <div className="bottomItens">
            <IconButton href="/conta" size="large">
              <SettingsOutlinedIcon />
            </IconButton>
            <IconButton onClick={()=> signOut()} size="large">
              <LogoutOutlinedIcon />
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
            <Box>
              {/* <Button variant="contained" startIcon={<AddIcon />} color="primary" sx={{ mr: 1 }}>
                Novo atendimento
              </Button>
              <Button variant="outlined" startIcon={<PauseIcon />} color="primary" sx={{ mr: 1 }}>
                Pausar
              </Button>
              <Button variant="outlined" startIcon={<FileDownloadIcon />} color="primary" sx={{ mr: 1 }}>
                Exportar
              </Button>
              <Button variant="outlined" startIcon={<DeleteIcon />} color="primary">
                Excluir
              </Button> */}
            </Box>
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
