import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { ISignInData } from "../../interfaces/signin.interfaces";
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/Modal/Modal";
import ValidationHelper from '../../helpers/validationHelper';
import generalHelper from "../../helpers/generalHelper";
import { Grid, Box, Typography, Button, Paper } from '@mui/material';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './initial.css';

function Initial(){
    const [load, setLoad] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<'success' | 'confirm'>('success');
    let navigate = useNavigate();
    const { register, handleSubmit, formState:{errors} } = useForm({
        defaultValues: {
            email:"",
            password:"",
        },      
    });
    

    const { user, signIn } = useAuth();

    const handleSignIn = async (data: ISignInData) => {
        setLoad(true);
        const loginAction = await signIn(data);
        console.log('Esse foi o retorno: ', loginAction);
        if(!loginAction){
            setLoad(false);
            setTitle("Erro ao realizar o login");
            setMessage("Ocorreu um erro ao fazer a autenticação, caso persista tente redefinir sua senha ou contate o suporte.");
            setModalOpen(true);
        }
        setLoad(false);
    }

    useEffect(()=>{
        const dataPlan = generalHelper.getUserPlan(user.userPlan);
        if(user.authkey && !dataPlan){
            navigate('/planos');
        }else if(user.authkey && dataPlan){
            navigate('/atendimento');
        }
    },[user, navigate]);

    return (
        <Grid container style={{ height: '100vh' }}>
          {/* Coluna da Esquerda */}
          <Grid item xs={12} md={5} style={{ backgroundColor: '#f9f9f9', padding: '2rem' }}>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
              {/* Logo ou Icone */}
              <Box mb={3}>
                <img src="resumo-rapido-atendimento-medico-logo.svg" alt="Logo" style={{ width: '80px' }} />
              </Box>
              <div className="welcomeSection">
                <h3 className="welcomeText">
                  Bem vindo(a)!
                </h3>
                <p className="welcomeSubText">
                  Como você deseja continuar?
                </p>
                <Button className="signInButton">
                  Já sou cliente
                </Button>
                <Button className="signUpButton">
                  Criar uma conta
                </Button>
              </div>
            </Box>
          </Grid>
    
          {/* Coluna da Direita */}
          <Grid item xs={12} md={7} style={{ backgroundColor: '#f0f4ff', padding: '2rem' }}>
            <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
              {/* Texto do Banner */}
              <Typography variant="h3" gutterBottom>
                Uma nova forma de atender seus pacientes
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Com o Resumo Rápido sua consulta fica mais dinâmica e eficiente. Crie sua conta grátis!
              </Typography>
              {/* Paginação para navegação */}
              <Box mt={4}>
                <Pagination count={3} color="primary" />
              </Box>
            </Box>
          </Grid>
        </Grid>
      );

}

export default Initial;

