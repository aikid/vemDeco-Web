import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../utils/navbar/navbar";
import EditNoteIcon from '@mui/icons-material/EditNote';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import 'react-international-phone/style.css';
import './confParametros.css';
import { Alert, Button, Divider, Snackbar } from "@mui/material";


function ConfParametros(){
    const [open, setOpen] = useState<boolean>(false);
    let navigate = useNavigate();
    const token = localStorage.getItem("userToken");

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
        window.location.reload();      
    };


    return(
        <>
            <NavBar></NavBar>
            <div className="atendimentoContainer">
                <div className="buttons-container">
                    <h2 style={{marginBottom: 10}}>Configuração de Parâmetros</h2>
                    <Divider style={{marginBottom: 20}} aria-hidden="true" />
                    <div className="menuBtnItem">
                        <Button className="menuConfBtn" onClick={()=> navigate('/prompt')} variant="contained" startIcon={<EditNoteIcon />}>
                            Gerenciar Prompt
                        </Button>
                    </div>
                    <div className="menuBtnItem">
                        <Button className="menuConfBtn" onClick={()=> navigate('/configuracoes')} variant="contained" startIcon={<ArrowBackIcon />}>
                            Voltar
                        </Button>
                    </div>
                </div>
            </div>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                    Convite de plano enviado ao usuário
                </Alert>
            </Snackbar>
        </>
    )

}

export default ConfParametros;

