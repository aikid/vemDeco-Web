import React, { useState, useEffect } from "react";
import { Divider, FormControl, Grid, MenuItem, Select, Typography } from "@mui/material";
import NavBar from "../../utils/navbar/navbar";
import "./planos.css";
import ResumoRapidoService from "../../Service/resumo-rapido-service";
import { Plans } from "../../interfaces/plans.interfaces";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import StarsIcon from '@mui/icons-material/Stars';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Loader from "../../utils/loader/loader";

const Planos = () => {

    const [planos, setPlanos] = useState<Plans[]>([]);
    const [load, setLoad] = useState<boolean>(false);
    let navigate = useNavigate();
    const { user } = useAuth();
    const planosAtribuites = [
        {
            qtdResumo:"1 Resumo de teste",
            recordTime:"Máximo 5 minutos de gravação para um único atendimento",
        },
        {
            qtdResumo:"100 resumos mês",
            recordTime:"Máximo 60 minutos de gravação por atendimento",
        },
        {
            qtdResumo:"200 resumos mês",
            recordTime:"Máximo 60 minutos de gravação por atendimento",
        },
        {
            qtdResumo:"500 resumos mês",
            recordTime:"Máximo 60 minutos de gravação por atendimento",
        },
        {
            qtdResumo:"Resumos ilimitados",
            recordTime:"Máximo 60 minutos de gravação por atendimento",
        },
        {
            qtdResumo:"Resumos ilimitados",
            recordTime:"Sem limite de tempo",
        }
    ]


    const getPlans = async () => {
        try{
            setLoad(true);
            const token = user.token;
            if(token){
                let response = await ResumoRapidoService.getPlansAvaliable(token);
                if(response && response.data){
                    setPlanos(response.data);
                }
            }
            setLoad(false);
        }catch (e){
            setLoad(false);
            console.log('Erro encontrado:', e);
        }
        
    }

    useEffect(()=>{
        getPlans();
    },[])

    return(
        load?<Loader/>:
        <div>
            <NavBar/>
            <Grid style={{paddingTop:"80px"} }>
                <h2 className="planTitle">Planos disponíveis</h2>
                <p className="subTitle">Para melhor aproveitamento de recursos da plataforma é necessário adquirir um dos planos acima do trial abaixo:</p>
            </Grid>
            <Grid container sx={{ mt: "15px" }}>
                {planos.length > 0 &&
                    planos.map((plano, index) => (
                        <Grid className="gridPlans" item xs={12} md={3}>
                            <Grid display={"flex"} fontSize={20} fontWeight={400} margin={2}>
                                <StarsIcon color={"success"}/>{plano.name}
                            </Grid>
                                <Divider style={{width:"100%"}}/>
                                <Grid margin={2}>
                                    <Typography fontWeight={600} fontSize={22}>R$ {plano.value}</Typography>
                                    <button className="planButton" type="submit" onClick={()=> {navigate('/checkout', {state: plano})}}>Contratar</button>
                                    <Divider style={{width:"100%", marginTop: 25,marginBottom: 25}}/>
                                    <Grid margin={2}> 
                                        <h4 style={{textAlign: "left", fontWeight: 500}}><CheckCircleIcon color={"success"} style={{position: "relative", top: 6}}/>{planosAtribuites[index].qtdResumo ?? 'null'}</h4>
                                    </Grid>
                                    <Grid margin={2}> 
                                        <h4 style={{textAlign: "left", fontWeight: 500}}><CheckCircleIcon color={"success"} style={{position: "relative", top: 6}}/>{planosAtribuites[index].recordTime ?? 'null'}</h4>
                                    </Grid>
                                </Grid>
                        </Grid>
                    ))
                }
            </Grid>
        </div>
    )

}

export default Planos;