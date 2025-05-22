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
import { Alert, AlertProps, Snackbar } from "@mui/material";

function Login(){
    const [load, setLoad] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const [severity, setSeverity] = useState<AlertProps["severity"]>('error');
    const [message, setMessage] = useState<string>('Ocorreu um erro ao executar a operação, contate o suporte');
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
            setMessage("Usuário ou senha inválidos");
            setOpen(true);
        }
        setLoad(false);
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
        if(severity === 'success'){
            navigate("/login");
        }
    };

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
                        <img src="vemdeco-a-sua-plataforma-para-venda-e-compra-de-servicos-logo.svg" alt="Vemdeco Logo" />      
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
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </>
    )

}

export default Login;

