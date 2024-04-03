import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";

import Atendimento from "./main/Atendimento/atendimento";
import Resumo from "./main/Resumo/resumo";
import Login from "./main/Login/login";

const MainRoutes = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route Component= { Login } path="/" />
                <Route Component = { Atendimento }  path="/atendimento" />
                <Route Component = { Resumo }  path="/resumo" />

            </Routes>
        </BrowserRouter>
    )
 }
 
 export default MainRoutes;

 