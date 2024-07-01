import React, {useState, useEffect} from "react";
import "./configuracoes.css";
import ResumoRapidoService from "../../Service/resumo-rapido-service";
import { useNavigate } from "react-router-dom";
import NavBar from "../../utils/navbar/navbar";
import Loader from "../../utils/loader/loader";
import { Button, Grid } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LogoutIcon from '@mui/icons-material/Logout';
import Divider from '@mui/material/Divider';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

  const Configuracoes = () => {
    const [logged, setLogged] = useState<boolean>(false);
    const [isRecord, setIsRecord] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<any>();
    let navigate = useNavigate();
    let authkey:string | null = "unlogged";


    const logOut = () =>{
        localStorage.setItem("authkey","unlogged");
        localStorage.setItem("userLogger","");
        localStorage.setItem("userToken","");
        localStorage.setItem("loginTime","");
        localStorage.setItem("userPlan","");
        navigate('/');
    }
  
   
  
    useEffect(()=>{
        authkey = localStorage.getItem("authkey");
        setLogged(authkey == 'logged');
        setLoading(false);
    },[])
  
  
    return (
      loading?<Loader/>:
      logged?
      <div>
        <NavBar></NavBar>
        <div className="atendimentoContainer">
            <div className="buttons-container">
                <h2 style={{marginBottom: 10}}>Configurações do sistema</h2>
                <Divider style={{marginBottom: 20}} aria-hidden="true" />
                <div className="menuBtnItem">
                    <Button className="menuConfBtn" onClick={()=>navigate('/conta')} variant="contained" startIcon={<AccountCircleIcon />}>
                        Minha Conta
                    </Button>
                </div>
                <div className="menuBtnItem">
                    <Button className="menuConfBtn" variant="contained" startIcon={<SettingsIcon />}>
                        Configuração de Parâmetros
                    </Button>
                </div>
                <div className="menuBtnItem">
                    <Button className="menuConfBtn"  onClick={()=>navigate('/planos')} variant="contained" startIcon={<AssignmentIndIcon />}>
                        Planos
                    </Button>
                </div>
                <div className="menuBtnItem">
                    <Button className="menuConfBtn"  onClick={()=>navigate('/historico')} variant="contained" startIcon={<MonetizationOnIcon />}>
                        Consumo
                    </Button>
                </div>
                <div className="menuBtnItem">
                    <Button className="menuConfBtn" onClick={()=>logOut()} variant="contained" startIcon={<LogoutIcon />}>
                        Sair
                    </Button>
                </div>
            </div>
        </div>
      </div>
       :
      <div>
        Acesso não autorizado
      </div>
    );
  };
  
  export default Configuracoes;