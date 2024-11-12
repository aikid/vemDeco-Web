import { useState } from "react";
import { Link } from "react-router-dom";
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
            <div className="redefinirSenhaContainer animationContainerUp">
                <div className="authBox">
                    <div className="rricon">
                        <img src="resumo-rapido-atendimento-medico-logo.svg" alt="Resumo Rápido Logo" />        
                    </div>
                    <div className="textoLogin">
                        Insira seu e-mail abaixo para recuperar a senha.
                    </div>
                    <form className="mobileRedefinirForm" onSubmit={handleSubmit((data)=>{signIn(data)})}>
                        <label>
                            <p className="textBox">E-mail</p>
                            <input {...register("email", {required: 'O E-mail é obrigatório', validate: value => ValidationHelper.validarEmail(value) || "E-mail inválido"})} className="redefinirSenhaformBox" type="text" placeholder="Digite seu e-mail" />
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
                        Se lembrou do acesso? <Link className="links" to="/login">Faça o Login Aqui!</Link>
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