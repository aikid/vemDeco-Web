import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { ISignInData } from "../../interfaces/signin.interfaces";
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/Modal/Modal";
import ValidationHelper from '../../helpers/validationHelper';
import generalHelper from "../../helpers/generalHelper";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import './login.css';

function Login(){
    const [load, setLoad] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<'success' | 'confirm'>('success');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

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

    return(
        <>
            <div className="loginContainer animationContainerDown">
                <div className="authBox">
                    <div className="rricon">
                        <img src="resumo-rapido-atendimento-medico-logo.svg" alt="Resumo Rápido Logo" />      
                    </div>
                    <div>
                        <h3 className="tituloLogin">Bem vindo (a)!</h3> 
                        <p className="subTituloLogin">Insira seus dados para continuar</p>
                    </div>
                    <form className="mobileLoginForm" onSubmit={handleSubmit((data)=>{handleSignIn(data)})}>
                        <label>
                            <div className="inputIcon">
                                <input {...register("email", {required: 'O E-mail é obrigatório', validate: value => ValidationHelper.validarEmail(value) || "E-mail inválido"})} className="loginformBox" type="text" placeholder="Digite seu e-mail" />
                                <MailOutlineIcon className="iconStyle"/>
                            </div>
                            <p className="errorMsg">{errors.email?.message?.toString()}</p>
                        </label>
                        <label>
                            <div className="inputIcon">
                                <input
                                    {...register("password", { required: "A Senha é obrigatória" })}
                                    className="loginformBox"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Digite sua senha"
                                />
                                {showPassword ? (
                                    <VisibilityOffOutlinedIcon
                                        className="iconStyle"
                                        onClick={togglePasswordVisibility}
                                        style={{ cursor: "pointer" }}
                                    />
                                ) : (
                                    <VisibilityOutlinedIcon
                                        className="iconStyle"
                                        onClick={togglePasswordVisibility}
                                        style={{ cursor: "pointer" }}
                                    />
                                )}
                            </div>
                            <p className="errorMsg">{errors.password?.message?.toString()}</p>
                        </label>
                        <div className="trustDeviceForgottenPwd">
                            <div className="checkBoxContainer">
                                <label>
                                    <input type="checkbox"/>
                                </label>
                                <p>Confio nesse Dispositivo</p>
                            </div>
                            <Link className="linkCreatAccount"  to="/redefinir-senha">Esqueci a senha</Link>

                        </div>
        
                        <div>
                        {!load ? (
                            <button className="signButton" type="submit" onClick={()=> handleSubmit}>Entrar</button>
                        ):(
                            <button className="formButton formButtonLoad" type="submit" disabled>Aguarde...</button>
                        )}
                        </div>
                    </form>
                    {/* <div className="googleButton">
                        <GoogleLogin logo_alignment={"center"} text="signin_with" onSuccess={function (credentialResponse: CredentialResponse): void {
                            throw new Error("Function not implemented.");
                        } }></GoogleLogin>
                    </div> */}
                    <div className="noAccountText">
                        Não tem uma conta? <Link className="linkCreatAccount" to="/registro">Criar conta</Link>
                    </div>
                </div>
            </div>
            <Modal
                show={isModalOpen}
                onClose={()=>setModalOpen(false)}
                title={title}
                content={<p>{message}</p>}
                actions={
                    <button className="confirmModal" onClick={()=>setModalOpen(false)}>OK</button>
                }
            />
        </>
    )

}

export default Login;

