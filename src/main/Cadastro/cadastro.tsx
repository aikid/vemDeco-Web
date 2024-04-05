import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './cadastro.css';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';


function Cadastro(){
    const [username, setUserName] = useState<string>();
    const [password, setPassword] = useState<string>();

    let navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        // e.preventDefault();
    }

    return(
        <div className="cadastroContainer">
            <div className="authBox">
                   
                    
                    <div className="bemVindo">
                        <h2>Criar conta</h2>
                    </div>
                    <div className="textoLogin">
                        Insira seus dados para criar uma conta.
                    </div>
                <form >
                    <label>
                    <p className="textBox">Nome</p>
                    <input className="formBox" type="text" placeholder="Digite seu nome completo" onChange={e => setUserName(e.target.value)} />
                    </label>
                    <label>
                    <p className="textBox">E-mail</p>
                    <input className="formBox" type="text" placeholder="Digite seu e-mail" onChange={e => setUserName(e.target.value)} />
                    </label>
                    <label>
                    <p className="textBox">Celular</p>
                    <input className="formBox" type="text" placeholder="Digite seu número" onChange={e => setPassword(e.target.value)} />
                    </label>
                    <label>
                    <p className="textBox">Senha</p>
                    <input className="formBox" type="password" placeholder="••••••••" onChange={e => setPassword(e.target.value)} />
                    </label>

     
                    <div>
                    <button className="formButton" type="submit">Cadastrar</button>
                    </div>
                </form>
                <div className="googleButton">
                    <GoogleLogin logo_alignment={"center"} text="signin_with" onSuccess={function (credentialResponse: CredentialResponse): void {
                        throw new Error("Function not implemented.");
                    } }></GoogleLogin>
                </div>
                <div className="noAccountText">
                    Já tem uma conta? <a className="links" onClick={()=>navigate('/')} href="">Login</a>
                </div>
            </div>
        </div>
    )

}

export default Cadastro;

