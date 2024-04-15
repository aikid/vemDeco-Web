import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";

import Atendimento from "./main/Atendimento/atendimento";
import Resumo from "./main/Resumo/resumo";
import Login from "./main/Login/login";
import Cadastro from "./main/Cadastro/cadastro";
import ContaPrincipal from "./main/Conta/Principal/conta-principal";

const MainRoutes = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route Component = { Login } path="/" />
                <Route Component = { Cadastro }  path="/cadastro" />
                <Route Component = { Atendimento }  path="/atendimento" />
                <Route Component = { Resumo }  path="/resumo" />
                <Route Component= {ContaPrincipal} path="/conta"/>

            </Routes>
        </BrowserRouter>
    )
 }
 
 export default MainRoutes;

 