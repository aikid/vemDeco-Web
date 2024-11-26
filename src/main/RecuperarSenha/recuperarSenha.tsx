import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from 'react-hook-form';
import ResumoRapidoService from "../../Service/resumo-rapido-service";
import ValidationHelper from '../../helpers/validationHelper';
import Modal from "../../components/Modal/Modal";
import 'react-international-phone/style.css';
import './recuperarSenha.css';
import { IPasswordRequestReset } from "../../interfaces/passwordReset.interfaces";
import { CheckIcon } from "lucide-react";
import { List, Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";


function RecuperarSenha(){
    let [searchParams] = useSearchParams();
    let token = searchParams.get('token');
    const { register, handleSubmit, watch, formState:{errors} } = useForm({
        defaultValues: {
            password:"",
            confirmPassword:"",
        },      
    });
    const [load, setLoad] = useState<boolean>(false);    const password = watch("password");
    const [isModalOpen, setModalOpen] = useState(false);

    const verificarSenha = ValidationHelper.verificarSenhaForte(password);
    let navigate = useNavigate();

    const resetPassword = async  (data: IPasswordRequestReset) => {
        try{
            setLoad(true);
            let response = await ResumoRapidoService.requestResetPassword(data, token);
            if(response && response.data){
                setModalOpen(true);
                setLoad(false);
            }
        }catch (e){
            setLoad(false);
            console.log('Erro encontrado:', e);
        }
    }
    
    return(
        <>
        {token ? (
            <>
                <div className="recuperarSenhaContainer">
                    <div className="recuperarAuthBox">
                        <div className="rricon">
                            <img src="resumo-rapido-atendimento-medico-logo.svg" alt="Resumo Rápido Logo" />      
                        </div>
                        <p className="info">
                            Insira sua nova senha abaixo.
                        </p>
                        <form className="mobileRecuperarForm" onSubmit={handleSubmit((data)=>{resetPassword(data)})}>
                            <label>
                                <p className="textBox">Senha</p>
                                <input {...register("password", {required: 'A Senha é obrigatória'})} className="recuperarformBox" type="password" placeholder="••••••••"/>
                                <p className="errorMsg">{errors.password?.message?.toString()}</p>
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
                            <label>
                                <p className="textBox">Confirmar Senha</p>
                                <input {...register("confirmPassword", {required: 'Confirme sua senha', validate: value => value === password || "As senhas não coincidem"})} className="recuperarformBox" type="password" placeholder="••••••••" />
                                <p className="errorMsg">{errors.confirmPassword?.message?.toString()}</p>
                            </label>
                            <div>
                            {!load ? (
                                <button className="formButton" type="submit" onClick={()=> handleSubmit}>Cadastrar</button>
                            ):(
                                <button className="formButton formButtonLoad" type="submit" disabled>Aguarde...</button>
                            )}
                        
                            </div>
                        </form>
                        <div className="hasAccountText">
                            Se lembrou do acesso? <a className="links" onClick={()=>navigate('/')} href="">Faça o Login Aqui!</a>
                        </div>
                    </div>
                </div>
                <Modal
                    show={isModalOpen}
                    onClose={()=>navigate('/')}
                    title="Senha alterada com sucesso!"
                    content={<p>Clique em ok para ser redirecionado para a página de login.</p>}
                    actions={
                    <button className="confirmModal" onClick={()=>navigate('/')}>OK</button>
                    }
                />
             </>
        ):(
            <div>
                Acesso não autorizado
            </div>
        )}
        </>
    )

}

export default RecuperarSenha;

