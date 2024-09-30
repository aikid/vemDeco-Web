import React, {useState, useEffect} from "react";
import ResumoRapidoService from "../../Service/resumo-rapido-service";
import { useNavigate } from "react-router-dom";
import NavBar from "../../utils/navbar/navbar";
import Loader from "../../utils/loader/loader";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import "./planoContratado.css";
import { Button, Typography } from "@mui/material";

  const PlanoContratado = () => {
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
      <div>
        <NavBar></NavBar>
        <div className="atendimentoContainer">
            <div className="buttons-container">
            <Card variant="outlined">
                <CardContent>
                    <CheckCircleIcon color={"success"} style={{fontSize: 80}}/>
                    <Typography sx={{ fontSize: 24, textAlign: 'center' }} gutterBottom>
                        Plano contratado com sucesso!
                    </Typography>
                    <Typography sx={{ mb: 1.5, textAlign: 'center' }} color="text.secondary">
                        Agora você ja pode usufruir dos recursos do resumo rápido por completo!
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center' }}>
                        Você inclusive pode iniciar um atendimento agora mesmo!
                    </Typography>
                    <Button size="small" color="success" onClick={()=> {navigate('/atendimento')}} sx={{ textAlign: 'center', marginTop: 3 }}>Iniciar atendimento</Button>
                </CardContent>
            </Card>
            </div>
        </div>
      </div>
    );
  };
  
  export default PlanoContratado;