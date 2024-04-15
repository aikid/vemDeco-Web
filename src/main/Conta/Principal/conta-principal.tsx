import { Box, Divider, Grid, TextField, Typography } from "@mui/material";
import NavBar from "../../../utils/navbar/navbar";
import ContaGeral from "../Geral/conta-geral";
import "./conta-principal.css";

function ContaPrincipal(){

    return(
        <div>
            <NavBar/>
            <Grid 
                display={"flex"} 
                style={{paddingTop:"80px"} }
            >

            <Typography                 
                marginRight={"120px"}
                marginLeft={"120px"}>
            Sua conta
            </Typography> 
                
            </Grid>
            <Grid 
                className="gridPersonal"
            >
                <Grid display={"flex"} fontSize={20} fontWeight={400} margin={2}> 
                    Informações pessoais
                </Grid>
                <Divider style={{width:"100%"}}/>
            <Grid margin={2}>
                <ContaGeral/>
            </Grid>

            </Grid>
            
        </div>

    )

}

export default ContaPrincipal;