import React from "react";
import "./configuracoes.css";
import { useNavigate } from "react-router-dom";
import { Box, Button, Divider, IconButton, Paper, Tab, Tabs, TextField, Typography } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from 'react';
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

  const Configuracoes = () => {
    let navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [activeDetailTab, setActiveDetailTab] = useState(0);

    const handleTabChange = (event: any, newValue: any) => {
      setActiveTab(newValue);
    };
  
    const handleDetailTabChange = (event: any, newValue: any) => {
      setActiveDetailTab(newValue);
    };

    const renderAtestadoTab = () => (
      <div className="tabContent">
        <TextField
          fullWidth
          label="Nome do paciente: 1"
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Box 
          component="textarea" 
          rows={8} 
          placeholder="Insira um texto aqui..." 
          style={{ 
            width: '100%', 
            height: '365px', 
            padding: '10px', 
            border: '1px solid #ccc', 
            borderRadius: 4 
          }} />
      </div>
    );
  
    const renderReceitaTab = () => (
      <div className="tabContent">
        <Box 
          component="textarea" 
          rows={8} 
          placeholder="Insira um texto aqui..." 
          style={{ 
            width: '100%', 
            height: '365px', 
            padding: '10px', 
            border: '1px solid #ccc', 
            borderRadius: 4 
          }} />
      </div>
    );
  
    const renderAnotacaoTab = () => (
      <div className="tabContent">
        <Box 
          component="textarea" 
          rows={8} 
          placeholder="Insira um texto aqui..." 
          style={{ 
            width: '100%', 
            height: '365px', 
            padding: '10px', 
            border: '1px solid #ccc', 
            borderRadius: 4 
          }} />
      </div>
    );

    const renderResumoTab = () => (
      <div className="tabContent">
        <Typography className="textContent">
          Anamnese e História Clínica: <br />
          - Queixa Principal e Duração: Paciente apresenta quadro de febre há três dias...
          <br /><br />
          Exames Realizados: <br />
          - Exames Laboratoriais: Hemograma completo revelou leucocitose...
          Anamnese e História Clínica: <br />
          - Queixa Principal e Duração: Paciente apresenta quadro de febre há três dias...
          <br /><br />
          Exames Realizados: <br />
          - Exames Laboratoriais: Hemograma completo revelou leucocitose...
          Anamnese e História Clínica: <br />
          - Queixa Principal e Duração: Paciente apresenta quadro de febre há três dias...
          <br /><br />
          Exames Realizados: <br />
          - Exames Laboratoriais: Hemograma completo revelou leucocitose...
          Anamnese e História Clínica: <br />
          - Queixa Principal e Duração: Paciente apresenta quadro de febre há três dias...
          <br /><br />
          Exames Realizados: <br />
          - Exames Laboratoriais: Hemograma completo revelou leucocitose...
          Anamnese e História Clínica: <br />
          - Queixa Principal e Duração: Paciente apresenta quadro de febre há três dias...
          <br /><br />
          Exames Realizados: <br />
          - Exames Laboratoriais: Hemograma completo revelou leucocitose...
        </Typography>
      </div>
    );

    const renderTranscricaoTab = () => (
      <div className="tabContent">
        <Typography className="textContent">
          Anamnese e História Clínica: <br />
          - Queixa Principal e Duração: Paciente apresenta quadro de febre há três dias...
          <br /><br />
          Exames Realizados: <br />
          - Exames Laboratoriais: Hemograma completo revelou leucocitose...
          Anamnese e História Clínica: <br />
          - Queixa Principal e Duração: Paciente apresenta quadro de febre há três dias...
        </Typography>
      </div>
    );

    return (
        <DashboardLayout title="Resumo">
          <div className="buttonRecordingArea">
            <Button onClick={() => navigate('/atendimento')} className="notRecordingButton" startIcon={<AutoAwesomeOutlinedIcon />}>
              Novo atendimento
            </Button>
            <Button onClick={() => navigate('/atendimento')} className="trashButton" startIcon={<DeleteIcon />}></Button>
          </div>
          <Box sx={{ display: 'flex', gap: 2 }} className="boxContainer">
              <Box flex={1} className="atestadoContainer">
                <Paper elevation={2} className="boxAtestado">
                  <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" className="tabsSummary">
                    <Tab label="Atestado" />
                    <Tab label="Receita" />
                    <Tab label="Anotação" />
                  </Tabs>

                  <Box sx={{ mt: 2 }}>
                  {activeTab === 0 && renderAtestadoTab()}
                  {activeTab === 1 && renderReceitaTab()}
                  {activeTab === 2 && renderAnotacaoTab()}
                  </Box>
                  <Button className="btnPreview" startIcon={<ContentCopyIcon />} sx={{ mt: 2 }} disabled>
                    Preview
                  </Button>
                </Paper>
              </Box>

              <Box flex={1} className="resumoContainer">
                <Paper elevation={2} sx={{ p: 2 }} className="boxResumo">
                  <div className="titleSwitch">
                    <h4>Detalhes da consulta</h4>
                    <Tabs value={activeDetailTab} onChange={handleDetailTabChange} indicatorColor="primary">
                      <Tab label="Resumo" />
                      <Tab label="Transcrição" />
                    </Tabs>
                  </div>
                  <Divider style={{width:"100%"}}/>
                  <Box sx={{ mt: 2, overflowY: 'auto', maxHeight: '400px', backgroundColor: '#f5faff', p: 2, borderRadius: 2 }}>
                    {activeDetailTab === 0 && renderResumoTab()}
                    {activeDetailTab === 1 && renderTranscricaoTab()}
                  </Box>
                  <Divider style={{width:"100%"}}/>
                  <Button className="btnCopy" startIcon={<ContentCopyIcon />} sx={{ mt: 2 }}>
                    Copiar
                  </Button>
                </Paper>
              </Box>
          </Box>
        </DashboardLayout>
    );
  };
  
  export default Configuracoes;