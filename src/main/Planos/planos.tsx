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
    type OperationType = "subscribe" | "cancel";
    const [planos, setPlanos] = useState<Plans[]>([]);
    const [load, setLoad] = useState<boolean>(false);
    const [showButton, setShowButton] = useState<boolean>(false);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [typeUpdate, setTypeUpdate] = useState<OperationType>("subscribe");
    const [title, setTitle] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [plano, setPlano] = useState<Plans>();
    let navigate = useNavigate();
    const { user, updateSubscription } = useAuth();
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

    const prepareCheckoutPlan = (plano: any) => {
        setTypeUpdate("subscribe");
        setShowButton(true);
        setPlano(plano);
        setTitle("Contratação de plano");
        setMessage(`Você confirma a contratação do plano ${plano.name}?`);
        setModalOpen(true);
    }

    const prepareCancelPlan = (plano: any) => {
        setTypeUpdate("cancel");
        setShowButton(true)
        setPlano(plano);
        setTitle("Cancelamento de plano");
        setMessage(`Você confirma o cancelamento do plano ${plano.name}?`);
        setModalOpen(true);
    }

    const prepareBindSubscription = (typeUpdate: OperationType) => {
        const operacoes: Record<OperationType, () => Promise<void>> = {
            "subscribe": newPlan,
            "cancel": cancelPlan
        };
        operacoes[typeUpdate]();
    }

    const newPlan = async() =>{
        try{
            setShowButton(false)
            setTitle("Processando Pedido");
            setMessage(`Aguarde...`);
           const response = await ResumoRapidoService.updateUserSubscription(plano?._id,user.token);
           if(response && response.data.gatewaySubscripitionId){
            updateSubscription({
                subscriptionId: response?.data?._id,
                isTrial: false,
                planId: plano?._id,
                limit: plano?.limit,
                status: response?.data?.paymentData?.paymentStatus,
                paymentPending: response?.data?.paymentData?.paymentPending
            });
            const paymentLink = await ResumoRapidoService.getPaymentLink(user.token, response.data.gatewaySubscripitionId);
            if(paymentLink && paymentLink.data.invoiceUrl){
                setMessage(`Aguarde...você será redirecionado para finalizar o pagamento`);
                setTimeout(() => {
                    window.location.href = paymentLink.data.invoiceUrl;
                }, 5000);
            }
           }
        } catch(e){
            setTitle("Erro ao processar Pedido");
            setMessage(`Tente novamente, caso persista contate o suporte`);
        }
    }

    const cancelPlan = async() =>{
        try{
            setShowButton(false)
            setTitle("Processando Cancelamento");
            setMessage(`Aguarde...`);
            // const response = await ResumoRapidoService.deleteUserSubscription(user.token);
            // if(response && response.data){
            // updateSubscription({
            //     subscriptionId: response?.data?._id,
            //     isTrial: false,
            //     planId: plano?._id,
            //     limit: plano?.limit,
            //     status: response?.data?.paymentData?.paymentStatus,
            //     paymentPending: response?.data?.paymentData?.paymentPending
            // });
            setMessage(`Plano cancelado com sucesso, para voltar a usar os resumos é necessário contratar um plano novamente`);
           //}
        } catch(e){
            setTitle("Erro ao processar cancelamento");
            setMessage(`Tente novamente, caso persista contate o suporte`);
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
                                {plano.name !== "Trial" &&
                                    <>
                                    {plano._id !== user.userPlan.planId ? (
                                        <button className="planButton" type="submit" onClick={()=> prepareCheckoutPlan(plano)}>Contratar</button>
                                    ):(
                                        <>
                                            <button disabled className="planActual" type="submit">Seu plano atual</button>
                                            <button className="planCancel" onClick={()=> prepareCancelPlan(plano)} type="submit">Cancelar plano</button>
                                        </>
                                    )}
                                    </>
                                }
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
                    showButton && (
                        <div className="actions">
                        <button className="confirmModal" onClick={()=>prepareBindSubscription(typeUpdate)}>Sim</button>
                        <button className="confirmModal" onClick={()=>setModalOpen(false)}>Não</button>
                        </div>
                    )
                }
            />
        </div>
    )

}

export default Planos;