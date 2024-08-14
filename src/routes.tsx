import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";

import Atendimento from "./main/Atendimento/atendimento";
import AtendimentoBeta from "./main/AtendimentoBeta/atendimentoBeta";
import AtendimentoPrompt from "./main/AtendimentoPrompt/atendimentoPrompt";
import Resumo from "./main/Resumo/resumo";
import Login from "./main/Login/login";
import Cadastro from "./main/Cadastro/cadastro";
import ContaPrincipal from "./main/Conta/Principal/conta-principal";
import Planos from "./main/Planos/planos";
import RecuperarSenha from "./main/RecuperarSenha/recuperarSenha";
import RedefinirSenha from "./main/RedefinirSenha/redefinirSenha";
import Configuracoes from "./main/Configuracoes/configuracoes";
import HistoricoPlanos from "./main/HistoricoPlanos/historicoPlanos";
import Checkout from "./main/Checkout/checkout";
import PlanoContratado from "./main/PlanoContratado/planoContratado";
import VincularUsuario from "./main/VincularUsuario/vincularUsuario";
import ConfParametros from "./main/Parametros/confParametros";
import Prompt from "./main/Prompt/prompt";

const MainRoutes = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route Component = { Login } path="/" />
                <Route Component = { Cadastro }  path="/cadastro" />
                <Route Component = { RedefinirSenha } path="/redefinir-senha"/>
                <Route Component = { RecuperarSenha }  path="/recuperar-senha" />
                <Route Component = { Planos }  path="/planos" />
                <Route Component = { Atendimento }  path="/atendimento" />
                <Route Component = { AtendimentoBeta }  path="/atendimento-beta" />
                <Route Component = { Resumo }  path="/resumo" />
                <Route Component = { ContaPrincipal } path="/conta"/>
                <Route Component = { Configuracoes } path="/configuracoes"/>
                <Route Component = { HistoricoPlanos } path="/historico"/>
                <Route Component = { Checkout } path="/checkout"/>
                <Route Component = { PlanoContratado } path="/plano-contratado"/>
                <Route Component = { VincularUsuario } path="/vincular-usuario"/>
                <Route Component = { AtendimentoPrompt } path="/atendimento-prompt"/>
                <Route Component = { ConfParametros } path="/configuracao-parametro"/>
                <Route Component = { Prompt } path="/prompt"/>
            </Routes>
        </BrowserRouter>
    )
 }
 
 export default MainRoutes;

 