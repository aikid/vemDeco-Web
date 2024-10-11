import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { PhoneInput } from 'react-international-phone';
import { ISignUpData } from "../../interfaces/signup.interfaces";
import NavBar from "../../utils/navbar/navbar";
import ResumoRapidoService from "../../Service/resumo-rapido-service";
import ValidationHelper from '../../helpers/validationHelper';
import Modal from "../../components/Modal/Modal";
import EmailIcon from '@mui/icons-material/Email';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import 'react-international-phone/style.css';
import './vincularUsuario.css';
import { Alert, Button, Divider, Snackbar } from "@mui/material";
import { UserData } from "../../interfaces/userEdit.interfaces";
import { IBindUserSubscriptionRequest } from "../../model/user/update-user-subscription-request";
import { useAuth } from "../../context/AuthContext";


function VincularUsuario(){
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
    const [tipoPessoa, setTipoPessoa] = useState<string>();
    const [load, setLoad] = useState<boolean>(false);    
    const password = watch("password");
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'success' | 'confirm'>('success');
    const [bindSub,setBindSub] = useState<boolean>(false);
    const [bindInvite,setBindInvite] = useState<boolean>(false);
    const [userData, setUserData] = useState<IBindUserSubscriptionRequest>();
    const [open, setOpen] = useState<boolean>(false);
    const verificarSenha = ValidationHelper.verificarSenhaForte(password);
    let navigate = useNavigate();
    const { user } = useAuth();
    const handleChange = (event: any) => {
        setTipoPessoa(event.target.value);
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
        window.location.reload();      
    };

    const signUp = async  (data: ISignUpData) => {
        try{
            setLoad(true);
            setOpen(true);
            let response = await ResumoRapidoService.signUp(data);
            if(response && response.data){
                setModalOpen(true);
                setLoad(false);
            }
        }catch (e){
            setLoad(false);
            console.log('Erro encontrado:', e);
        }
        
    }

    const handleSub = () => {
        setBindSub(true);
        setBindInvite(false);
    };

    const handleInvite = () => {
        setBindSub(false);
        setBindInvite(true);
    };

    const backOption = () => {
        setBindSub(false);
        setBindInvite(false);
    };

    const finUser = async(data:any) =>{
        try{
            setLoad(true);
            let userFind = await ResumoRapidoService.getUserByEmail(user.token,data.email);
            if(user && userFind.data){
                setUserData(userFind.data);
                setLoad(false);
            }
        }catch (e){
            setLoad(false);
            console.log('Erro encontrado:', e);
        }
    }

    const bindUserSubscription = async() => {
        try{
            if(!user.token || !userData) return;
            setLoad(true);
            console.log('Usuario: ', user);
            let subscriptionResponse = await ResumoRapidoService.createUserNotification(user.token,userData.userId,user.username,"invite-subscription");
            if(subscriptionResponse && subscriptionResponse.data){
                setOpen(true);
            }
        }catch(e){
            setLoad(false);
            console.log('Erro encontrado:', e);
        }
    }
    return(
        <>
            <NavBar></NavBar>
            <div className="atendimentoContainer">
                {!bindSub && !bindInvite ? (
                    <div className="buttons-container">
                        <h2 style={{marginBottom: 10}}>Vincular Usuário ao Plano</h2>
                        <Divider style={{marginBottom: 20}} aria-hidden="true" />
                        <div className="menuBtnItem">
                            <Button className="menuConfBtn" onClick={()=>handleSub()} variant="contained" startIcon={<PersonAddIcon />}>
                                Por Cadastro
                            </Button>
                        </div>
                        <div className="menuBtnItem">
                            <Button className="menuConfBtn" onClick={()=>handleInvite()} variant="contained" startIcon={<EmailIcon />}>
                                Por convite
                            </Button>
                        </div>
                        <div className="menuBtnItem">
                            <Button className="menuConfBtn" onClick={()=>navigate("/configuracoes")} variant="contained" startIcon={<ArrowBackIcon />}>
                                Voltar
                            </Button>
                        </div>
                    </div>
                ): null}
                {bindSub && (
                    <div className="vinculoOptionContainer">
                        <div className="vinculoAuthBox">
                            <div className="textoVinculo">
                                Insira os dados para criar<br/> uma usuario e vincula-lo ao plano.
                            </div>
                            <form className="mobilevinculoForm" onSubmit={handleSubmit((data)=>{signUp(data)})}>
                                <label>
                                    <p className="textBox">Selecione o tipo de pessoa para esse vinculo</p>
                                    <select {...register("tipoPessoa", {required: 'Selecione um tipo de pessoa'})} className="vinculoSelectBox" id="meu-select" value={tipoPessoa} onChange={handleChange}>
                                        <option value="">Selecione...</option>
                                        <option value="pf">Pessoa Física</option>
                                        <option value="pj">Pessoa Jurídica</option>
                                    </select>
                                    <p className="errorMsg">{errors.tipoPessoa?.message?.toString()}</p>
                                </label>
                                {tipoPessoa === 'pf' &&
                                    <label>
                                        <p className="textBox">CPF</p>
                                        <input {...register("document", {required: 'O CPF é obrigatório', validate: value => ValidationHelper.validarCPF(value) || "Documento inválido"})} className="vinculoFormBox" type="text" placeholder="Digite seu CPF" />
                                        <p className="errorMsg">{errors.document?.message?.toString()}</p>
                                    </label>
                                }
                                {tipoPessoa === 'pj' &&
                                    <label>
                                        <p className="textBox">CNPJ</p>
                                        <input {...register("document", {required: 'O CNPJ é obrigatório', validate: value => ValidationHelper.validarCNPJ(value) || "Documento inválido"})} className="vinculoFormBox" type="text" placeholder="Digite o seu CNPJ"/>
                                        <p className="errorMsg">{errors.document?.message?.toString()}</p>
                                    </label>
                                }
                                <label>
                                    <p className="textBox">Nome</p>
                                    <input {...register("name", {required: 'O Nome é obrigatório'})} className="vinculoFormBox" type="text" placeholder="Digite seu nome completo"/>
                                    <p className="errorMsg">{errors.name?.message?.toString()}</p>
                                </label>
                                <label>
                                    <p className="textBox">E-mail</p>
                                    <input {...register("email", {required: 'O E-mail é obrigatório', validate: value => ValidationHelper.validarEmail(value) || "E-mail inválido"})} className="vinculoFormBox" type="text" placeholder="Digite seu e-mail"/>
                                    <p className="errorMsg">{errors.email?.message?.toString()}</p>
                                </label>
                                <label>
                                    <p className="textBox">Celular</p>
                                    <PhoneInput {...register("phone", {required: 'O Celular é obrigatório', validate: value => ValidationHelper.validarTelephone(value) || "Telefone inválido"})} className="phonebox" defaultCountry="br" onChange={() => {}} />
                                    <p className="errorMsg">{errors.phone?.message?.toString()}</p>
                                </label>
                                <label>
                                    <p className="textBox">Senha</p>
                                    <input {...register("password", {required: 'A Senha é obrigatória'})} className="vinculoFormBox" type="password" placeholder="••••••••"/>
                                    <p className="errorMsg">{errors.password?.message?.toString()}</p>
                                    <ul className="listErrors">
                                        {verificarSenha.resultados.map((resultado, index) => (
                                            <li key={index} style={{ color: resultado.valido ? 'green' : 'red' }}>
                                                {resultado.mensagem}
                                            </li>
                                        ))}
                                    </ul>
                                </label>
                                <label>
                                    <p className="textBox">Confirmar Senha</p>
                                    <input {...register("confirmPassword", {required: 'Confirme sua senha', validate: value => value === password || "As senhas não coincidem"})} className="vinculoFormBox" type="password" placeholder="••••••••" />
                                    <p className="errorMsg">{errors.confirmPassword?.message?.toString()}</p>
                                </label>
                                <div>
                                {!load ? (
                                    <>
                                        <button className="formButton" type="submit" onClick={()=> handleSubmit}>Cadastrar</button>
                                        <button className="formButton backButton" onClick={()=> backOption()}>Voltar</button>
                                    </>
                                ):(
                                    <button className="formButton formButtonLoad" type="submit" disabled>Aguarde...</button>
                                )}
                            
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {bindInvite && (
                    <div className="vinculoContainer">
                        <div className="vinculoAuthBox">
                            <div className="textoVinculo">
                                Digite o e-mail do usuário para envio do convite
                            </div>
                            {userData &&
                                <div className="userFindedContent">
                                    <div className="cardUser">
                                        <div className="avatarContent">
                                            <img src="user-avatar.png" alt="User Avatar" className="notificationAvatar" />
                                        </div>
                                        <div className="avatarContent">
                                            <p className="cardInfo">Nome: {userData?.name}</p>
                                            <p className="cardInfo">E-mail: {userData?.email}</p>
                                        </div>
                                    </div>
                                </div>
                            }
                            <form className="mobilevinculoForm" onSubmit={handleSubmit((data)=>{finUser(data)})}>
                                <label>
                                    <p className="textBox">E-mail</p>
                                    <input {...register("email", {required: 'O E-mail é obrigatório', validate: value => ValidationHelper.validarEmail(value) || "E-mail inválido"})} className="vinculoFormBox" type="text" placeholder="Digite seu e-mail"/>
                                    <p className="errorMsg">{errors.email?.message?.toString()}</p>
                                </label>
                                
                                <div>
                                    {!load ? (
                                        <>
                                            {userData && <button className="formButton" onClick={()=> bindUserSubscription()}>Enviar Convite</button>}
                                            <button className="formButton" type="submit" onClick={()=> handleSubmit}>Procurar usuário</button>
                                            <button className="formButton backButton" onClick={()=> backOption()}>Voltar</button>
                                        </>
                                    ):(
                                        <button className="formButton formButtonLoad" type="submit" disabled>Aguarde...</button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <Modal
                show={isModalOpen}
                onClose={()=>navigate('/')}
                title="Cadastro e vinculo realizado com sucesso!"
                content={<p>O usuário ja esta incluso na sua carteira de planos.</p>}
                actions={
                <button className="confirmModal" onClick={()=>navigate('/')}>OK</button>
                }
            />
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                    Convite de plano enviado ao usuário
                </Alert>
            </Snackbar>
        </>
    )

}

export default VincularUsuario;

