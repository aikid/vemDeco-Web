import React, { useEffect } from "react";
import "./resumo.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Divider, IconButton, Paper, Tab, Tabs, TextField, Typography } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from 'react';
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { Sparkles, Trash2 } from "lucide-react";

  const Resumo = () => {
    let navigate = useNavigate();
    let location = useLocation();
    const response = location.state.response;

    const [activeTab, setActiveTab] = useState(0);
    const [activeDetailTab, setActiveDetailTab] = useState(0);
    const [transcriptionLines, setTrancriptionLines] = useState('');
    const [summaryLines, setSummaryLines] = useState('');
    const [prescriptionLines, setPrescriptionLines] = useState('');
    const [certificateLines, setCertificateLines] = useState('');
    const [completionLines, setCompletionLines] = useState('');
    const [isConpletionKind, setIsCompletionKind] = useState(false);

    const handleTabChange = (event: any, newValue: any) => {
      setActiveTab(newValue);
    };
  
    const handleDetailTabChange = (event: any, newValue: any) => {
      setActiveDetailTab(newValue);
    };

    const handleCopy = (tabNumber:number) => {
      let text = tabNumber === 0 ? summaryLines : transcriptionLines;
      navigator.clipboard.writeText(text)
        .then(() => {
          console.log('Texto copiado com sucesso!');
        })
        .catch(err => {
          console.error('Erro ao copiar o texto:', err);
        });
    };

    const renderAtestadoTab = (certificateLines: string) => (
      <div className="tabContent">
        {/* <TextField
          fullWidth
          label="Nome do paciente: "
          variant="outlined"
          sx={{ mb: 2 }}
        /> */}
        <textarea className="textareaContentEdit" defaultValue={certificateLines}></textarea>
      </div>
    );
  
    const renderReceitaTab = (prescriptionLines: string) => (
      <div className="tabContent">
        <textarea className="textareaContentEdit" defaultValue={prescriptionLines}></textarea>
      </div>
    );
  
    const renderAnotacaoTab = () => (
      <div className="tabContent">
        <textarea className="textareaContentEdit"></textarea>
      </div>
    );

    const renderResumoTab = (summaryLines:string) => (
      <div className="tabContent">
        <textarea className="textareaContent" defaultValue={summaryLines}></textarea>
      </div>
    );

    const renderTranscricaoTab = (transcriptionLines: string) => (
      <div className="tabContent">
        <textarea className="textareaContent" defaultValue={transcriptionLines}></textarea>
      </div>
    );

    useEffect(() => {
      if (response !== undefined) {
        if (response.data.completion.summary !== undefined) {
          console.log(response.data.completion.prescription)
          setTrancriptionLines(response.data.transcription.replace(/\. /g , ".\n").replace(/\? /g , "?\n").replace(/\!/g , "!\n"));
          setSummaryLines(response.data.completion.summary.replace(".\n", ".\n\n"));
          setPrescriptionLines(response.data.completion.prescription.replace(".\n", ".\n\n"));
          setCertificateLines(response.data.completion.certificate.replace(".\n", ".\n\n"));
        } else {
          setTrancriptionLines(response.data.transcription.replace('.', ".\n\n"));
          setCompletionLines(response.data.completion.replace('.', ".\n\n"));
          setIsCompletionKind(true);
        }
      }
    }, [response]);
    

    return (
        <DashboardLayout title="Resumo">
          <div className="buttonRecordingArea">
            <Button onClick={() => navigate('/atendimento')} className="notRecordingButton" startIcon={<Sparkles />}>
              Novo atendimento
            </Button>
            <Button onClick={() => navigate('/atendimento')} className="trashButton" startIcon={<Trash2 />}></Button>
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
                  {activeTab === 0 && renderAtestadoTab(certificateLines)}
                  {activeTab === 1 && renderReceitaTab(prescriptionLines)}
                  {activeTab === 2 && renderAnotacaoTab()}
                  </Box>
                  {/* <Button className="btnPreview" startIcon={<ContentCopyIcon />} sx={{ mt: 2 }} disabled>
                    Preview
                  </Button> */}
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
                  <Box sx={{ mt: 2 }}>
                    {activeDetailTab === 0 && renderResumoTab(summaryLines)}
                    {activeDetailTab === 1 && renderTranscricaoTab(transcriptionLines)}
                  </Box>
                  <Divider style={{width:"100%"}}/>
                  <Button className="btnCopy" onClick={()=> handleCopy(activeDetailTab)} startIcon={<ContentCopyIcon />} sx={{ mt: 2 }}>
                    Copiar
                  </Button>
                </Paper>
              </Box>
          </Box>
        </DashboardLayout>
    );
  };
  
  export default Resumo;