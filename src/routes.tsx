import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";

import Atendimento from "./main/Atendimento/atendimento";
import Resumo from "./main/Resumo/resumo";

const MainRoutes = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route Component = { Atendimento }  path="/" />
                <Route Component = { Resumo }  path="/resumo" />
            </Routes>
        </BrowserRouter>
    )
 }
 
 export default MainRoutes;