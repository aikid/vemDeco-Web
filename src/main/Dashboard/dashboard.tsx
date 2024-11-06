import React from 'react';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import { Typography } from '@mui/material';

function Dashboard() {
  return (
    <DashboardLayout title="Notificações">
      {/* Conteúdo específico do Dashboard aqui */}
      <Typography variant="body1">Teste de conteúdo</Typography>
    </DashboardLayout>
  );
}

export default Dashboard;
