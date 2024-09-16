import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./resumo.css";
import { useNavigate } from "react-router-dom";
import NavBar from "../../utils/navbar/navbar";
import { Box, Modal, Typography } from "@mui/material";


function Resumo() {

let location = useLocation();
const response = location.state.response;

const [transcriptionLines, setTrancriptionLines] = useState('');
const [summaryLines, setSummaryLines] = useState('');
const [prescriptionLines, setPrescriptionLines] = useState('');
const [certificateLines, setCertificateLines] = useState('');
const [completionLines, setCompletionLines] = useState('');
const [isConpletionKind, setIsCompletionKind] = useState(false);
const [info, setInfo] = useState({title: 'Teste', desc: 'Teste'})
const [open, setOpen] = useState(false);
const handleOpen = (nome:string, list:any) => {
  setInfo({title: nome , desc: list})
  setOpen(true);
}
const handleClose = () => setOpen(false);

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 768,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  height: 500,
  overflow: 'scroll'
};


let navigate = useNavigate(); 

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




const handleCopy = (text:string) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Texto copiado com sucesso!');
    })
    .catch(err => {
      console.error('Erro ao copiar o texto:', err);
    });
};

const handleOpenGoogleDocs = (text:string) => {
  const googleDocsUrl = `https://docs.google.com/document/u/0/create?usp=docs_home&ths=true&copyFrom=${encodeURIComponent(text)}&body=${encodeURIComponent(text)}`;
  window.open(googleDocsUrl, '_blank');
};


const renderResponseArea = (nome:string, list:any, setFunc:React.Dispatch<React.SetStateAction<string>>)=> {
    return (
        <div className="responseContainer">
            <div className="responseArea">
                <h3 className="textResponse" onClick={()=>handleOpen(nome, list)} >{nome}</h3>
                
                <div className="responseDataArea">
                 <textarea defaultValue={list} onChange={(e)=>setFunc(e.target.value)}></textarea>
                </div>
            </div>
          <div className="buttonsDiv">
            <button className="buttonAct" onClick={()=>handleCopy(list)}>Copiar</button>
            <button className="buttonAct" onClick={()=>handleOpenGoogleDocs(list)}>Word</button>
            <button className="buttonAct" >PDF</button>
          </div>
        </div>
    );
}

const renderResponseAreaCompletion = (nome:string, list:any, setFunc:React.Dispatch<React.SetStateAction<string>>)=> {
  return (
      <div className="responseContainerCompletion">
          <div className="responseArea">
              <h3 className="textResponse">{nome}</h3>
             
              <div className="responseDataArea">
               <textarea defaultValue={list} onChange={(e)=>setFunc(e.target.value)}></textarea>
              </div>
          </div>
        <div className="buttonsDiv">
          <button className="buttonAct" onClick={()=>handleCopy(list)}>Copiar</button>
          <button className="buttonAct" onClick={()=>handleOpenGoogleDocs(list)}>Word</button>
          <button className="buttonAct" >PDF</button>
        </div>
      </div>
  );
}
const renderResponses = () => {
    
    if (response !== undefined) {
      if (response.data.completion.summary !== undefined) {
        return (
            <div className="responseGlobalContainer">
             
                 {renderResponseArea('Transcrição', transcriptionLines, setTrancriptionLines)}
                 {renderResponseArea('Resumo', summaryLines, setSummaryLines)}
  
         
                 {renderResponseArea('Prescrição', prescriptionLines, setPrescriptionLines)}
                 {renderResponseArea('Atestado', certificateLines, setCertificateLines)}

                    
            </div>
        );
      }
      else{
        return(
  
          <div className="responseGlobalContainerCompletion">
              {renderResponseAreaCompletion('Trancrição', transcriptionLines, setTrancriptionLines)}
              {renderResponseAreaCompletion('Resumo', completionLines, setCompletionLines)}
          </div>
        );
      }
    }
  };

  return(
    <div>
      <NavBar></NavBar>
      <div className="maincontainer">
        <div className="mainBox">
          {renderResponses()}
            {isConpletionKind? 
              <div className="saveAllButtonsCompletionDiv">
                <button className="saveAllButtonCompletion">Salvar todos os cards em um único word</button>
                <button className="saveAllButtonCompletion">Salvar todos os cards em um único PDF</button>
              </div>
            : 
            <div className="saveAllButtonsDiv">
                <button className="saveAllButton">Salvar todos os cards em um único word</button>
                <button className="saveAllButton">Salvar todos os cards em um único PDF</button>
            </div>
            }
            <div className="footDiv">
              <p>Ao clicar em “encerrar atendimento” todas as informações do atendimento serão excluídas.</p>
              <button className="leaveButton" onClick={()=>navigate('/atendimento')}>Encerrar atendimento</button>
            </div>
          
        </div>  
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {info.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <textarea className="descriptionModal" defaultValue={info.desc}></textarea>
          </Typography>
        </Box>
      </Modal>
    </div>
  );

}

export default Resumo;