import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Atendimento from "../main/Atendimento/atendimento";
import AtendimentoBeta from "../main/AtendimentoBeta/atendimentoBeta";
import AtendimentoPrompt from "../main/AtendimentoPrompt/atendimentoPrompt";
import Resumo from "../main/Resumo/resumo";
import Login from "../main/Login/login";
import Cadastro from "../main/Cadastro/cadastro";
import ContaPrincipal from "../main/Conta/Principal/conta-principal";
import Planos from "../main/Planos/planos";
import RecuperarSenha from "../main/RecuperarSenha/recuperarSenha";
import RedefinirSenha from "../main/RedefinirSenha/redefinirSenha";
import Configuracoes from "../main/Configuracoes/configuracoes";
import HistoricoPlanos from "../main/HistoricoPlanos/historicoPlanos";
import Checkout from "../main/Checkout/checkout";
import PlanoContratado from "../main/PlanoContratado/planoContratado";
import VincularUsuario from "../main/VincularUsuario/vincularUsuario";
import ConfParametros from "../main/Parametros/confParametros";
import Prompt from "../main/Prompt/prompt";
import Initial from "../main/Initial/initial";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    return user.authkey === "logged" ? <>{children}</> : <Navigate to="/" />;
};

const MainRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Initial />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/redefinir-senha" element={<RedefinirSenha />} />
            <Route path="/recuperar-senha" element={<RecuperarSenha />} />
            <Route path="/planos" element={<PrivateRoute><Planos /></PrivateRoute>} />
            <Route path="/atendimento" element={<PrivateRoute><Atendimento /></PrivateRoute>} />
            <Route path="/atendimento-beta" element={<PrivateRoute><AtendimentoBeta /></PrivateRoute>} />
            <Route path="/resumo" element={<PrivateRoute><Resumo /></PrivateRoute>} />
            <Route path="/conta" element={<PrivateRoute><ContaPrincipal /></PrivateRoute>} />
            <Route path="/configuracoes" element={<PrivateRoute><Configuracoes /></PrivateRoute>} />
            <Route path="/historico" element={<PrivateRoute><HistoricoPlanos /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="/plano-contratado" element={<PrivateRoute><PlanoContratado /></PrivateRoute>} />
            <Route path="/vincular-usuario" element={<PrivateRoute><VincularUsuario /></PrivateRoute>} />
            <Route path="/atendimento-prompt" element={<PrivateRoute><AtendimentoPrompt /></PrivateRoute>} />
            <Route path="/configuracao-parametro" element={<PrivateRoute><ConfParametros /></PrivateRoute>} />
            <Route path="/prompt" element={<PrivateRoute><Prompt /></PrivateRoute>} />
        </Routes>
    );
};

export default MainRoutes;
