import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ValidationHelper from '../../helpers/validationHelper';
import { ISignUpData } from '../../interfaces/signup.interfaces';
import ResumoRapidoService from '../../Service/resumo-rapido-service';
import { Box, Grid, Typography, Divider, IconButton, AlertProps, List, Avatar, ListItemAvatar, ListItemText, ListItem, Snackbar, Alert } from '@mui/material';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { PhoneInput } from 'react-international-phone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CheckIcon from '@mui/icons-material/Check';
import './registro.css';

function Registro() {
  const { register, handleSubmit, watch, trigger, formState:{errors} } = useForm({
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
  const [load, setLoad] = useState<boolean>(false);    
  const password = watch("password");
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<AlertProps["severity"]>('error');
  const [message, setMessage] = useState<string>('Ocorreu um erro ao executar a operação, contate o suporte');
  const verificarSenha = ValidationHelper.verificarSenhaForte(password);
  
  let navigate = useNavigate();

  const handleChange = (event: any) => {
    setTipoPessoa(event.target.value);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    if(severity === 'success'){
        navigate("/login");
    }
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

  const goToNextStep = async () => {
    let valid = false;

    // Verifica campos específicos de acordo com a etapa atual
    if (step === 1) {
      valid = await trigger(['email']);
    } else if (step === 2) {
      valid = await trigger(['name', 'phone', 'tipoPessoa', 'document']);
    } else if (step === 3) {
      valid = await trigger(['password']);
    } else if (step === 3) {
      valid = await trigger(['confirmPassword']);
    }

    // Avança para a próxima etapa se os campos estiverem válidos
    if (valid) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const goToPreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };


  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <label>
              <div className="inputIcon">
                  <input {...register("email", {required: 'O E-mail é obrigatório', validate: value => ValidationHelper.validarEmail(value) || "E-mail inválido"})} className="cadastroFormBox" type="text" placeholder="Digite seu e-mail"/>
                  <p className="errorMsg">{errors.email?.message?.toString()}</p>
                  <MailOutlineIcon className="iconStyle"/>
              </div>
            </label>
            <button className="formsignUpButton" type="button" onClick={()=> goToNextStep()}>Continuar com email</button>
          </>
        );
      case 2:
        return (
          <>
            <label>
              <div className="inputIcon">
                  <input {...register("name", {required: 'O Nome é obrigatório'})} className="cadastroFormBox" type="text" placeholder="Digite seu nome completo"/>
                  <p className="errorMsg">{errors.name?.message?.toString()}</p>
                  <PersonOutlineIcon className="iconStyle"/>
              </div>
              <label>
                  <select {...register("tipoPessoa", {required: 'Selecione um tipo de pessoa'})} className="cadastroSelectBox" id="meu-select" value={tipoPessoa} onChange={handleChange}>
                      <option value="">Selecione o tipo de pessoa</option>
                      <option value="pf">Pessoa Física</option>
                      <option value="pj">Pessoa Jurídica</option>
                  </select>
                  <p className="errorMsg">{errors.tipoPessoa?.message?.toString()}</p>
              </label>
              <div className="inputIcon">
                  <PhoneInput {...register("phone", {required: 'O Celular é obrigatório', validate: value => ValidationHelper.validarTelephone(value) || "Telefone inválido"})} className="phonebox" defaultCountry="br" onChange={() => {}} />
                  <p className="errorMsg">{errors.phone?.message?.toString()}</p>
                  <AnnouncementOutlinedIcon className="iconStyle"/>
              </div>
            </label>
            {tipoPessoa === 'pf' &&
              <div className="inputIcon">
                <input {...register("document", {required: 'O CPF é obrigatório', validate: value => ValidationHelper.validarCPF(value) || "Documento inválido"})} className="cadastroFormBox" type="text" placeholder="Digite seu CPF" />
                <p className="errorMsg">{errors.document?.message?.toString()}</p>
                <BadgeOutlinedIcon className="iconStyle"/>
              </div>
            }
            {tipoPessoa === 'pj' &&
              <div className="inputIcon">
                <input {...register("document", {required: 'O CNPJ é obrigatório', validate: value => ValidationHelper.validarCNPJ(value) || "Documento inválido"})} className="cadastroFormBox" type="text" placeholder="Digite o seu CNPJ"/>
                <p className="errorMsg">{errors.document?.message?.toString()}</p>
                <BadgeOutlinedIcon className="iconStyle"/>
              </div>
            }
            <button className="formsignUpButton" type="button" onClick={()=> goToNextStep()}>Continuar</button>
            <button className="formsignUpButton" type="button" onClick={()=> goToPreviousStep()}>Voltar</button>
          </>
        );
      case 3:
        return (
          <>
            <label>
                <input {...register("password", {required: 'A Senha é obrigatória'})} className="cadastroFormBox" type="password" placeholder="Digite sua senha"/>
                <p className="errorMsg">{errors.password?.message?.toString()}</p>
                <h4 className="errorsTitle">A sua senha deve conter:</h4>
                {/* <ul className="listErrors">
                    {verificarSenha.resultados.map((resultado, index) => (
                        <li key={index} style={{ color: resultado.valido ? 'green' : 'red' }}>
                            {resultado.mensagem}
                        </li>
                    ))}
                </ul> */}
                <List dense={false}>
                  {verificarSenha.resultados.map((resultado, index) => (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar className={resultado.valido ? 'errorListAvatarGreen' : 'errorListAvatarRed' }>
                          <CheckIcon className="errorIcon"/>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={resultado.mensagem} className="errorListItem"/>
                    </ListItem>
                  ))}
                </List>
            </label>
            <button className="formsignUpButton" type="button" onClick={()=> goToNextStep()}>Continuar</button>
            <button className="formsignUpButton" type="button" onClick={()=> goToPreviousStep()}>Voltar</button>
          </>
        );
      default:
        return (
          <>
            <label>
                  <input {...register("confirmPassword", {required: 'Confirme sua senha', validate: value => value === password || "As senhas não coincidem"})} className="cadastroFormBox" type="password" placeholder="Confirme sua senha" />
                  <p className="errorMsg">{errors.confirmPassword?.message?.toString()}</p>
            </label>
            <button className="formsignUpButton" type="submit" onClick={()=> handleSubmit} disabled={load}>{load ? 'Aguarde' : 'Criar Conta'}</button>
            <button className="formsignUpButton" type="button" onClick={()=> goToPreviousStep()} disabled={load}>Voltar</button>
          </>
        );
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
                {renderStepContent()}
            </form>
          
          {step <= 1 &&
            <>
              {/* <Divider style={{ margin: '2rem 0' }}>Ou continue com</Divider>
              <div className="googleButton">
                <GoogleLogin logo_alignment={"center"} text="signin_with" onSuccess={function (credentialResponse: CredentialResponse): void {
                    throw new Error("Function not implemented.");
                } }></GoogleLogin>
              </div> */}
              <Typography variant="body2" className="loginOptionText">
                Já tem uma conta? <a className="linkCreatAccount" href="/login">Entrar na conta</a>
              </Typography>
            </>
          }
        </Box>
      </Grid>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
          <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
              {message}
          </Alert>
      </Snackbar>
    </Grid>
  );
}

export default Registro;
