import { useNavigate } from "react-router-dom";
import NavBar from "../../utils/navbar/navbar";
import EditNoteIcon from '@mui/icons-material/EditNote';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import 'react-international-phone/style.css';
import './confParametros.css';
import { Button, Divider } from "@mui/material";
import { useAuth } from "../../context/AuthContext";


function ConfParametros(){
    let navigate = useNavigate();
    const { user } = useAuth();

    return(
        <>
            <NavBar></NavBar>
            <div className="confParametrosContainer">
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
        </>
    )

}

export default ConfParametros;

