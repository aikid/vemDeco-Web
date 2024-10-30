import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ValidationHelper from '../../helpers/validationHelper';
import { ISignUpData } from '../../interfaces/signup.interfaces';
import ResumoRapidoService from '../../Service/resumo-rapido-service';
import { Box, Grid, Typography, TextField, Button, Divider, IconButton, AlertProps } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import './registro.css';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';

function Registro() {
  const { register, handleSubmit, watch, formState:{errors} } = useForm({
    defaultValues: {
        name:"",
        email:"",
        phone:"",
        tipoPessoa:"",
        document:"",
        password:"",
        confirmPassword:""
    },      
  });
    
  const [step, setStep] = useState(1);
  const [tipoPessoa, setTipoPessoa] = useState<string>();
  const [load, setLoad] = useState<boolean>(false);    const password = watch("password");
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'confirm'>('success');
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<AlertProps["severity"]>('error');
  const [message, setMessage] = useState<string>('Ocorreu um erro ao executar a operação, contate o suporte');
  const verificarSenha = ValidationHelper.verificarSenhaForte(password);
  
  let navigate = useNavigate();

  const handleChange = (event: any) => {
    setTipoPessoa(event.target.value);
  };

  const signUp = async  (data: ISignUpData) => {
      try{
          setLoad(true);
          let response = await ResumoRapidoService.signUp(data);
          if(response && response.data){
              setSeverity("success");
              setMessage("Cadastro realizado, você já pode se logar!");
              setOpen(true);
              setLoad(false);
          }
      }catch (e){
          setLoad(false);
          setOpen(true);
          console.log('Erro encontrado:', e);
      }
      
  }

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
      if(severity === 'success'){
          navigate("/");
      }
  };

  return (
    <Grid container className='registerContainer'>
      {/* Barra de progresso no topo */}
      <Grid item xs={12} style={{ padding: '2rem', position: 'relative' }}>
        
        {/* Barra de etapas */}
        <Box display="flex" justifyContent="center" alignItems="center" width="100%">
          <Box width="25%" height="4px" bgcolor={step >= 1 ? 'primary.main' : '#E0E0E0'} mr={1}></Box>
          <Box width="25%" height="4px" bgcolor={step >= 2 ? 'primary.main' : '#E0E0E0'} mr={1}></Box>
          <Box width="25%" height="4px" bgcolor={step >= 3 ? 'primary.main' : '#E0E0E0'} mr={1}></Box>
          <Box width="25%" height="4px" bgcolor={step >= 4 ? 'primary.main' : '#E0E0E0'}></Box>
        </Box>

        {/* Indicação da Etapa */}
        <Typography align="left" mt={1}>
          Etapa {step}:4
        </Typography>

         {/* Botão de Voltar */}
         <IconButton className="backButtonArrow" onClick={()=> navigate("/")}>
          <ArrowBackIcon />
         </IconButton>
      </Grid>

      {/* Conteúdo do Formulário */}
      <Grid item xs={12} container direction="column" alignItems="center" justifyContent="center" className='registerContainer animationContainerDown'>
        <Box width="100%" maxWidth="400px" textAlign="center">
          <div className="rricon">
            <img src="resumo-rapido-atendimento-medico-logo.svg" alt="Resumo Rápido Logo" />      
          </div>
          <Typography variant="h4" gutterBottom>
            Criar conta
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Insira seus dados para criar sua conta.
          </Typography>

            <form className="mobileCadastroForm" onSubmit={handleSubmit((data)=>{signUp(data)})}>
                <label>
                    <div className="inputIcon">
                        <input {...register("email", {required: 'O E-mail é obrigatório', validate: value => ValidationHelper.validarEmail(value) || "E-mail inválido"})} className="cadastroFormBox" type="text" placeholder="Digite seu e-mail"/>
                        <p className="errorMsg">{errors.email?.message?.toString()}</p>
                        <MailOutlineIcon className="iconStyle"/>
                    </div>
                </label>

                  {/* Botão de Continuar */}
                  <button className="signUpButton" type="submit" onClick={()=> handleSubmit}>Continuar com email</button>
            </form>
          
          {/* Divisor */}
          <Divider style={{ margin: '2rem 0' }}>Ou continue com</Divider>

          {/* Botão de Cadastro com Google */}
          <div className="googleButton">
            <GoogleLogin logo_alignment={"center"} text="signin_with" onSuccess={function (credentialResponse: CredentialResponse): void {
                throw new Error("Function not implemented.");
            } }></GoogleLogin>
          </div>

          {/* Link para Entrar */}
          <Typography variant="body2" className="loginOptionText">
            Já tem uma conta? <a className="linkCreatAccount" href="/login">Entrar na conta</a>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Registro;
