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
import Modal from "../../components/Modal/Modal";

const Planos = () => {

    const [planos, setPlanos] = useState<Plans[]>([]);
    const [load, setLoad] = useState<boolean>(false);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<'success' | 'confirm'>('success');
    const [title, setTitle] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [planoID, setPlanoID] = useState<string>("");
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

    const prepareCheckoutPlan = (_id: string, name: string) =>{
        setPlanoID(_id);
        setTitle("Contratação de plano");
        setMessage(`Você confirma a contratação do plano ${name}?`);
        setModalOpen(true);
    }

    const prepareBindSubscription = async() => {
        try{
           const response = await ResumoRapidoService.updateUserSubscription(planoID,user.token);
           if(response && response.data.gatewaySubscripitionId){
            console.log(response);
            const paymentLink = ResumoRapidoService.getPaymentLink(user.token, response.data.gatewaySubscripitionId);
            if()
           }
        } catch(e){
            
        }
    }

    useEffect(()=>{
        getPlans();
    },[])

    return(
        load?<Loader/>:
        <div className="planosContainer">
            <NavBar/>
            <Grid style={{paddingTop:"80px"} }>
                <h2 className="planTitle">Planos disponíveis</h2>
                <p className="subTitle">Para melhor aproveitamento de recursos da plataforma é necessário adquirir um dos planos acima do trial abaixo:</p>
            </Grid>
            <Grid container sx={{ mt: "15px" }}>
                {planos.length > 0 &&
                    planos.map((plano, index) => (
                        <Grid className="gridPlans" item xs={12} md={3} key={plano._id}>
                            <Grid display={"flex"} fontSize={20} fontWeight={400} margin={2}>
                                <StarsIcon color={"success"}/><span className="planBoxTitle">{plano.name}</span>
                            </Grid>
                            <Divider style={{width:"100%"}}/>
                            <Grid margin={2}>
                                <Typography fontWeight={600} fontSize={22}>R$ {plano.value}</Typography>
                                <button className="planButton" type="submit" onClick={()=> prepareCheckoutPlan(plano._id, plano.name)}>Contratar</button>
                                <Divider style={{width:"100%", marginTop: 25,marginBottom: 25}}/>
                                <Grid margin={2}> 
                                    <h4 className="planBoxInfo"><CheckCircleIcon color={"success"} style={{position: "relative", top: 6}}/>{planosAtribuites[index].qtdResumo ?? 'null'}</h4>
                                </Grid>
                                <Grid margin={2}> 
                                    <h4 className="planBoxInfo"><CheckCircleIcon color={"success"} style={{position: "relative", top: 6}}/>{planosAtribuites[index].recordTime ?? 'null'}</h4>
                                </Grid>
                            </Grid>
                        </Grid>
                    ))
                }
            </Grid>
            <Modal
                show={isModalOpen}
                onClose={()=>setModalOpen(false)}
                title={title}
                content={<p>{message}</p>}
                actions={
                    <div className="actions">
                       <button className="confirmModal" onClick={()=>prepareBindSubscription()}>Contratar</button>
                       <button className="confirmModal" onClick={()=>setModalOpen(false)}>Calcelar</button>
                    </div>
                }
            />
        </div>
    )

}

export default Planos;