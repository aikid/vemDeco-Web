import { useState } from "react";
import { useNavigate } from "react-router-dom";
//import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { PhoneInput } from 'react-international-phone';
import { ISignUpData } from "../../interfaces/signup.interfaces";
import ResumoRapidoService from "../../Service/resumo-rapido-service";
import ValidationHelper from '../../helpers/validationHelper';
import Modal from "../../components/Modal/Modal";
import 'react-international-phone/style.css';
import './cadastro.css';


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
            <div className="cadastroContainer">
                <div className="authBox">
                    <div className="bemVindo">
                        <h2>Criar conta</h2>
                    </div>
                    <div className="textoLogin">
                        Insira seus dados para criar uma conta.
                    </div>
                    <form onSubmit={handleSubmit((data)=>{signUp(data)})}>
                        <label>
                            <p className="textBox">Selecione o tipo de pessoa para esse cadastro</p>
                            <select {...register("tipoPessoa", {required: 'Selecione um tipo de pessoa'})} className="selectBox" id="meu-select" value={tipoPessoa} onChange={handleChange}>
                                <option value="">Selecione...</option>
                                <option value="pf">Pessoa Física</option>
                                <option value="pj">Pessoa Jurídica</option>
                            </select>
                            <p className="errorMsg">{errors.tipoPessoa?.message?.toString()}</p>
                        </label>
                        {tipoPessoa === 'pf' &&
                            <label>
                                <p className="textBox">CPF</p>
                                <input {...register("document", {required: 'O CPF é obrigatório', validate: value => ValidationHelper.validarCPF(value) || "Documento inválido"})} className="formBox" type="text" placeholder="Digite seu CPF" />
                                <p className="errorMsg">{errors.document?.message?.toString()}</p>
                            </label>
                        }
                        {tipoPessoa === 'pj' &&
                            <label>
                                <p className="textBox">CNPJ</p>
                                <input {...register("document", {required: 'O CNPJ é obrigatório', validate: value => ValidationHelper.validarCNPJ(value) || "Documento inválido"})} className="formBox" type="text" placeholder="Digite o seu CNPJ"/>
                                <p className="errorMsg">{errors.document?.message?.toString()}</p>
                            </label>
                        }
                        <label>
                            <p className="textBox">Nome</p>
                            <input {...register("name", {required: 'O Nome é obrigatório'})} className="formBox" type="text" placeholder="Digite seu nome completo"/>
                            <p className="errorMsg">{errors.name?.message?.toString()}</p>
                        </label>
                        <label>
                            <p className="textBox">E-mail</p>
                            <input {...register("email", {required: 'O E-mail é obrigatório', validate: value => ValidationHelper.validarEmail(value) || "E-mail inválido"})} className="formBox" type="text" placeholder="Digite seu e-mail"/>
                            <p className="errorMsg">{errors.email?.message?.toString()}</p>
                        </label>
                        <label>
                            <p className="textBox">Celular</p>
                            <PhoneInput {...register("phone", {required: 'O Celular é obrigatório', validate: value => ValidationHelper.validarTelephone(value) || "Telefone inválido"})} className="phonebox" defaultCountry="br" onChange={() => {}} />
                            <p className="errorMsg">{errors.phone?.message?.toString()}</p>
                        </label>
                        <label>
                            <p className="textBox">Senha</p>
                            <input {...register("password", {required: 'A Senha é obrigatória'})} className="formBox" type="password" placeholder="••••••••"/>
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
                            <input {...register("confirmPassword", {required: 'Confirme sua senha', validate: value => value === password || "As senhas não coincidem"})} className="formBox" type="password" placeholder="••••••••" />
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
                        Já tem uma conta? <a className="links" onClick={()=>navigate('/')} href="">Login</a>
                    </div>
                </div>
            </div>
            <Modal
                show={isModalOpen}
                onClose={()=>navigate('/')}
                title="Cadastro realizado com sucesso!"
                content={<p>Você sera redirecionado para a página de login.</p>}
                actions={
                <button className="confirmModal" onClick={()=>navigate('/')}>OK</button>
                }
            />
        </>
    )

}

export default Cadastro;

