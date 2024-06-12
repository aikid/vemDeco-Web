import React, { useState, useEffect } from "react";
import { Divider, FormControl, Grid, MenuItem, Select, Typography } from "@mui/material";
import NavBar from "../../utils/navbar/navbar";
import "./planos.css";
import ResumoRapidoService from "../../Service/resumo-rapido-service";
import { Plans } from "../../interfaces/plans.interfaces";
import StarsIcon from '@mui/icons-material/Stars';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Planos = () => {

    const [planos, setPlanos] = useState<Plans[]>([]);
    const [load, setLoad] = useState<boolean>(false);


    const getPlans = async () => {
        try{
            let response = await ResumoRapidoService.getStates();
            if(response && response.data){
                const estadosOrdenados = response.data.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
                setPlanos(estadosOrdenados);
            }
        }catch (e){
            console.log('Erro encontrado:', e);
        }
        
    }

    useEffect(()=>{
        getPlans();
    },[])

    return(
        <div>
            <NavBar/>
            <Grid display={"flex"} style={{paddingTop:"80px"} }>
                {/* <Typography marginRight={"20px"}marginLeft={"20px"}>Sua conta</Typography>
                <Typography marginRight={"20px"}marginLeft={"20px"}>Sua conta</Typography>
                <Typography marginRight={"20px"}marginLeft={"20px"}>Sua conta</Typography>  */}
            </Grid>
            <Grid container sx={{ mt: "15px" }}>
                <Grid className="gridPlans" item xs={12} md={3}>
                    <Grid display={"flex"} fontSize={20} fontWeight={400} margin={2}>
                        <StarsIcon color={"success"}/>Trial
                    </Grid>
                    <Divider style={{width:"100%"}}/>
                        <Grid margin={2}>
                            <Typography fontWeight={600} fontSize={22}>R$ 15,00</Typography>
                            <button className="planButton" type="submit" onClick={()=> {}}>Contratar</button>
                            <Divider style={{width:"100%", marginTop: 25,marginBottom: 25}}/>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"success"}/>Suporte técnico 24/7
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"success"}/>1GB de armazenamento
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"success"}/>50.000 disparos
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"success"}/>50 campanhas ativas
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"disabled"}/>Suporte a integrações
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"disabled"}/>Gerador de links personalizados
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"disabled"}/>Relatórios personalizados
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"disabled"}/>Métricas personalizadas
                            </Grid>
                        </Grid>
                </Grid>

                <Grid className="gridPlans" item xs={12} md={3}>
                    <Grid display={"flex"} fontSize={20} fontWeight={400} margin={2}>
                        <StarsIcon color={"success"}/>Trial
                    </Grid>
                    <Divider style={{width:"100%"}}/>
                        <Grid margin={2}>
                            <Typography fontWeight={600} fontSize={22}>R$ 15,00</Typography>
                            <button className="planButton" type="submit" onClick={()=> {}}>Contratar</button>
                            <Divider style={{width:"100%", marginTop: 25,marginBottom: 25}}/>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"success"}/>Suporte técnico 24/7
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"success"}/>1GB de armazenamento
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"success"}/>50.000 disparos
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"success"}/>50 campanhas ativas
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"disabled"}/>Suporte a integrações
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"disabled"}/>Gerador de links personalizados
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"disabled"}/>Relatórios personalizados
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"disabled"}/>Métricas personalizadas
                            </Grid>
                        </Grid>
                </Grid>

                <Grid className="gridPlans" item xs={12} md={3}>
                    <Grid display={"flex"} fontSize={20} fontWeight={400} margin={2}>
                        <StarsIcon color={"success"}/>Trial
                    </Grid>
                    <Divider style={{width:"100%"}}/>
                        <Grid margin={2}>
                            <Typography fontWeight={600} fontSize={22}>R$ 15,00</Typography>
                            <button className="planButton" type="submit" onClick={()=> {}}>Contratar</button>
                            <Divider style={{width:"100%", marginTop: 25,marginBottom: 25}}/>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"success"}/>Suporte técnico 24/7
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"success"}/>1GB de armazenamento
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"success"}/>50.000 disparos
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"success"}/>50 campanhas ativas
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"disabled"}/>Suporte a integrações
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"disabled"}/>Gerador de links personalizados
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"disabled"}/>Relatórios personalizados
                            </Grid>
                            <Grid display={"flex"} justifyContent={"flex-start"} alignItems={"center"} margin={2}> 
                                <CheckCircleIcon color={"disabled"}/>Métricas personalizadas
                            </Grid>
                        </Grid>
                </Grid>
            </Grid>
        </div>

    )

}

export default Planos;