import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { PhoneInput } from 'react-international-phone';
import { ISignUpData } from "../../interfaces/signup.interfaces";
import ResumoRapidoService from "../../Service/resumo-rapido-service";
import ValidationHelper from '../../helpers/validationHelper';
import Modal from "../../components/Modal/Modal";
import 'react-international-phone/style.css';
import './cadastro.css';
import { Alert, AlertProps, Snackbar } from "@mui/material";


function Cadastro(){
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

    return(
        <>
            <div className="cadastroContainer animationContainerUp">
                <div className="cadastroAuthBox">
                    <div className="rricon">
                        <img src="resumo-rapido-atendimento-medico-logo.svg" alt="Resumo Rápido Logo" />      
                    </div>
                    <div className="textoLogin">
                        Insira seus dados para criar uma conta.
                    </div>
                    <form className="mobileCadastroForm" onSubmit={handleSubmit((data)=>{signUp(data)})}>
                        <label>
                            <p className="textBox">Selecione o tipo de pessoa para esse cadastro</p>
                            <select {...register("tipoPessoa", {required: 'Selecione um tipo de pessoa'})} className="cadastroSelectBox" id="meu-select" value={tipoPessoa} onChange={handleChange}>
                                <option value="">Selecione...</option>
                                <option value="pf">Pessoa Física</option>
                                <option value="pj">Pessoa Jurídica</option>
                            </select>
                            <p className="errorMsg">{errors.tipoPessoa?.message?.toString()}</p>
                        </label>
                        {tipoPessoa === 'pf' &&
                            <label>
                                <p className="textBox">CPF</p>
                                <input {...register("document", {required: 'O CPF é obrigatório', validate: value => ValidationHelper.validarCPF(value) || "Documento inválido"})} className="cadastroFormBox" type="text" placeholder="Digite seu CPF" />
                                <p className="errorMsg">{errors.document?.message?.toString()}</p>
                            </label>
                        }
                        {tipoPessoa === 'pj' &&
                            <label>
                                <p className="textBox">CNPJ</p>
                                <input {...register("document", {required: 'O CNPJ é obrigatório', validate: value => ValidationHelper.validarCNPJ(value) || "Documento inválido"})} className="cadastroFormBox" type="text" placeholder="Digite o seu CNPJ"/>
                                <p className="errorMsg">{errors.document?.message?.toString()}</p>
                            </label>
                        }
                        <label>
                            <p className="textBox">Nome</p>
                            <input {...register("name", {required: 'O Nome é obrigatório'})} className="cadastroFormBox" type="text" placeholder="Digite seu nome completo"/>
                            <p className="errorMsg">{errors.name?.message?.toString()}</p>
                        </label>
                        <label>
                            <p className="textBox">E-mail</p>
                            <input {...register("email", {required: 'O E-mail é obrigatório', validate: value => ValidationHelper.validarEmail(value) || "E-mail inválido"})} className="cadastroFormBox" type="text" placeholder="Digite seu e-mail"/>
                            <p className="errorMsg">{errors.email?.message?.toString()}</p>
                        </label>
                        <label>
                            <p className="textBox">Celular</p>
                            <PhoneInput {...register("phone", {required: 'O Celular é obrigatório', validate: value => ValidationHelper.validarTelephone(value) || "Telefone inválido"})} className="phonebox" defaultCountry="br" onChange={() => {}} />
                            <p className="errorMsg">{errors.phone?.message?.toString()}</p>
                        </label>
                        <label>
                            <p className="textBox">Senha</p>
                            <input {...register("password", {required: 'A Senha é obrigatória'})} className="cadastroFormBox" type="password" placeholder="••••••••"/>
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
                            <input {...register("confirmPassword", {required: 'Confirme sua senha', validate: value => value === password || "As senhas não coincidem"})} className="cadastroFormBox" type="password" placeholder="••••••••" />
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
                    {/* <div className="googleButton">
                        <GoogleLogin logo_alignment={"center"} text="signin_with" onSuccess={function (credentialResponse: CredentialResponse): void {
                            throw new Error("Function not implemented.");
                        } }></GoogleLogin>
                    </div> */}
                    <div className="noAccountText">
                        Já tem uma conta? <Link className="links" to="/">Login</Link>
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

export default Cadastro;

