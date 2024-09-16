import React from "react";
import { Routes, Route } from "react-router-dom";

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

const MainRoutes = () => {
    return(
        <Routes>
            <Route Component = { Login } path="/" />
            <Route Component = { Cadastro }  path="/cadastro" />
            <Route Component = { RedefinirSenha } path="/redefinir-senha"/>
            <Route Component = { RecuperarSenha }  path="/recuperar-senha" />
            <Route Component = { Planos }  path="/planos" isPrivate />
            <Route Component = { Atendimento }  path="/atendimento" isPrivate/>
            <Route Component = { AtendimentoBeta }  path="/atendimento-beta" isPrivate/>
            <Route Component = { Resumo }  path="/resumo" isPrivate/>
            <Route Component = { ContaPrincipal } path="/conta" isPrivate/>
            <Route Component = { Configuracoes } path="/configuracoes" isPrivate/>
            <Route Component = { HistoricoPlanos } path="/historico" isPrivate/>
            <Route Component = { Checkout } path="/checkout" isPrivate/>
            <Route Component = { PlanoContratado } path="/plano-contratado" isPrivate/>
            <Route Component = { VincularUsuario } path="/vincular-usuario" isPrivate/>
            <Route Component = { AtendimentoPrompt } path="/atendimento-prompt" isPrivate/>
            <Route Component = { ConfParametros } path="/configuracao-parametro" isPrivate/>
            <Route Component = { Prompt } path="/prompt" isPrivate/>
        </Routes>
    )
 }
 
 export default MainRoutes;

 