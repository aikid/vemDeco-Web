import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './login.css';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';

const users = [
    {username: "DMRR", password: "Sampeless"},
    {username: "Saocristovao", password: "Sao@2024*"},
    {username: "Sabara", password: "S@b@r@24"},
    {username: "Unicoclinica", password: "Unico@2024"},
];


function Login(){
    const [username, setUserName] = useState<string>();
    const [password, setPassword] = useState<string>();

    let navigate = useNavigate();

    // async function loginUser(credentials: { username: string; password: string; }) {
    //     return fetch('http://localhost:8080/login', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify(credentials)
    //     })
    //       .then(data => data.json())
    // }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        let user = users.find(item => item.username === username && item.password === password);
        
        if(user){
            localStorage.setItem("authkey","logged");
            localStorage.setItem("userLogger",user.username);
            navigate('/atendimento');
        }
        else{
            localStorage.setItem("authkey","unlogged");
            alert("Usuário ou senha incorretos");
        }

        // const token = await loginUser({
        //     username,
        //     password
        // });
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
                <form onSubmit={handleSubmit}>
                    <label>
                    <p className="textBox">E-mail</p>
                    <input className="formBox" type="text" placeholder="Digite seu e-mail" onChange={e => setUserName(e.target.value)} />
                    </label>
                    <label>
                    <p className="textBox">Senha</p>
                    <input className="formBox" type="password" placeholder="••••••••" onChange={e => setPassword(e.target.value)} />
                    </label>
                    <div className="trustDeviceForgottenPwd">
                        <div className="checkBoxContainer">
                            <label>
                                <input type="checkbox"/>
                            </label>
                            <p>Confio nesse Dispositivo</p>
                        </div>
                        <a className="links"  href="">Esqueci a senha</a>
                    </div>
     
                    <div>
                    <button className="formButton" type="submit">Entrar</button>
                    </div>
                </form>
                <div className="googleButton">
                    <GoogleLogin logo_alignment={"center"} text="signin_with" onSuccess={function (credentialResponse: CredentialResponse): void {
                        throw new Error("Function not implemented.");
                    } }></GoogleLogin>
                </div>
                <div className="noAccountText">
                    Não tem uma conta? <a className="links" onClick={()=>navigate('/cadastro')} href="">Criar conta</a>
                </div>
            </div>
        </div>
    )

}

export default Login;

