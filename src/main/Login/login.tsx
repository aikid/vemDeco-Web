import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { ISignInData } from "../../interfaces/signin.interfaces";
import ResumoRapidoService from "../../Service/resumo-rapido-service";
import ValidationHelper from '../../helpers/validationHelper';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import './login.css';

function Login(){
    const [load, setLoad] = useState<boolean>(false);    
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'success' | 'confirm'>('success');

    const { register, handleSubmit, formState:{errors} } = useForm({
        defaultValues: {
            email:"",
            password:"",
        },      
    });
    

    let navigate = useNavigate();

    const signIn = async (data: ISignInData) => {
        try{
            setLoad(true);
            let response = await ResumoRapidoService.signIn(data);
            if(response && response.data.token){
                localStorage.setItem("authkey","logged");
                localStorage.setItem("userLogger",response.data.username);
                localStorage.setItem("userToken",response.data.token);
                navigate('/atendimento');
            }
            else{
                setLoad(false);
                localStorage.setItem("authkey","unlogged");
                alert("Usuário ou senha incorretos");
            }
        }catch (e){
            setLoad(false);
            console.log('Erro encontrado:', e);
        }
    }

    return(
        <div className="loginContainer">
            <div className="authBox">
                <div className="rricon">
                    <img width={"120px"} height={"120px"} src="resumorapido.svg" alt="Icone do Resumo Rápido" />      
                </div>
                
                <div className="bemVindo">
                    <h2>Bem vindo!</h2>
                </div>
                <div className="textoLogin">
                    Insira seus dados para entrar na sua conta.
                </div>
                <form onSubmit={handleSubmit((data)=>{signIn(data)})}>
                    <label>
                        <p className="textBox">E-mail</p>
                        <input {...register("email", {required: 'O E-mail é obrigatório', validate: value => ValidationHelper.validarEmail(value) || "E-mail inválido"})} className="formBox" type="text" placeholder="Digite seu e-mail" />
                        <p className="errorMsg">{errors.email?.message?.toString()}</p>
                    </label>
                    <label>
                        <p className="textBox">Senha</p>
                        <input {...register("password", {required: 'A Senha é obrigatória'})} className="formBox" type="password" placeholder="••••••••" />
                        <p className="errorMsg">{errors.password?.message?.toString()}</p>
                    </label>
                    <div className="trustDeviceForgottenPwd">
                        {/* <div className="checkBoxContainer">
                            <label>
                                <input type="checkbox"/>
                            </label>
                            <p>Confio nesse Dispositivo</p>
                        </div> */}
                        <a className="links"  href="">Esqueci a senha</a>
                    </div>
     
                    <div>
                    {!load ? (
                        <button className="formButton" type="submit" onClick={()=> handleSubmit}>Entrar</button>
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
                    Não tem uma conta? <a className="links" onClick={()=>navigate('/cadastro')} href="">Criar conta</a>
                </div>
            </div>
        </div>
    )

}

export default Login;

