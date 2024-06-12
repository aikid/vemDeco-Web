import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { IPasswordReset } from "../../interfaces/passwordReset.interfaces";
import Modal from "../../components/Modal/Modal";
import ResumoRapidoService from "../../Service/resumo-rapido-service";
import ValidationHelper from '../../helpers/validationHelper';
import './redefinirSenha.css';

function RedefinirSenha(){
    const [load, setLoad] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<'success' | 'confirm'>('success');

    const { register, handleSubmit, formState:{errors} } = useForm({
        defaultValues: {
            email:"",
        },      
    });
    

    let navigate = useNavigate();

    const signIn = async (data: IPasswordReset) => {
        try{
            setLoad(true);
            let response = await ResumoRapidoService.resetPassword(data);
            if(response && response.email){
                setLoad(false);
                setTitle("Pedido de Alteração de Senha Registrado")
                setMessage("Você recebeu um e-mail para recuperar seu acesso, verique sua caixa de e-mail para os próximos passos");
                setModalOpen(true);
            }
            else{
                setLoad(false);
                localStorage.setItem("authkey","unlogged");
                setTitle("Erro Encontrado")
                setMessage("Usuário ou senha incorretos");
                setModalOpen(true);
            }
        }catch (e){
            setLoad(false);
            setTitle("Pedido de Alteração de Senha Registrado")
            setMessage("Você recebeu um e-mail para recuperar seu acesso, verique sua caixa de e-mail para os próximos passos");
            setModalOpen(true);
        }
    }

    return(
        <>
            <div className="loginContainer">
                <div className="authBox">
                    <div className="rricon">
                        <img width={"120px"} height={"120px"} src="resumorapido.svg" alt="Icone do Resumo Rápido" />      
                    </div>
                    
                    <div className="bemVindo">
                        <h2>Recuperação de Senha</h2>
                    </div>
                    <div className="textoLogin">
                        Insira seu e-mail abaixo para recuperar a senha.
                    </div>
                    <form onSubmit={handleSubmit((data)=>{signIn(data)})}>
                        <label>
                            <p className="textBox">E-mail</p>
                            <input {...register("email", {required: 'O E-mail é obrigatório', validate: value => ValidationHelper.validarEmail(value) || "E-mail inválido"})} className="formBox" type="text" placeholder="Digite seu e-mail" />
                            <p className="errorMsg">{errors.email?.message?.toString()}</p>
                        </label>
                        <div>
                        {!load ? (
                            <button className="formButton" type="submit" onClick={()=> handleSubmit}>Enviar</button>
                        ):(
                            <button className="formButton formButtonLoad" type="submit" disabled>Aguarde...</button>
                        )}
                        </div>
                    </form>
                    <div className="noAccountText">
                        Se lembrou do acesso? <a className="links" onClick={()=>navigate('/')} href="">Faça o Login Aqui!</a>
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

export default RedefinirSenha;