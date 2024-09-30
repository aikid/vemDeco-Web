import React, {useState, useEffect} from "react";
import "./configuracoes.css";
import { useNavigate } from "react-router-dom";
import NavBar from "../../utils/navbar/navbar";
import Loader from "../../utils/loader/loader";
import { Button, Grid } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import Divider from '@mui/material/Divider';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

  const Configuracoes = () => {
    const [logged, setLogged] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    let navigate = useNavigate();
    let authkey:string | null = "unlogged";


  
    useEffect(()=>{
        authkey = localStorage.getItem("authkey");
        setLogged(authkey == 'logged');
        setLoading(false);
    },[])
  
  
    return (
      loading?<Loader/>:
      <div>
        <NavBar></NavBar>
        <div className="atendimentoContainer">
            <div className="buttons-container">
                <h2 className="title">Configurações do sistema</h2>
                <Divider style={{marginBottom: 20}} aria-hidden="true" />
                <div className="menuBtnItem">
                    <Button className="menuConfBtn" onClick={()=>navigate('/conta')} variant="contained" startIcon={<AccountCircleIcon />}>
                        Minha Conta
                    </Button>
                </div>
                <div className="menuBtnItem">
                    <Button className="menuConfBtn" onClick={()=>navigate('/vincular-usuario')} variant="contained" startIcon={<GroupAddIcon />}>
                        Vincular Usuário
                    </Button>
                </div>
                <div className="menuBtnItem">
                    <Button className="menuConfBtn" onClick={()=>navigate('/configuracao-parametro')} variant="contained" startIcon={<SettingsIcon />}>
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
            </div>
        </div>
      </div>
    );
  };
  
  export default Configuracoes;