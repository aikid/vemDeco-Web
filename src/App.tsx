import React from 'react';
import './App.css';
import MainRoutes from './routes';
import {Helmet} from "react-helmet";

function App() {
  return (
    <>
      <Helmet>
          <meta charSet="utf-8" />
          <title>Resumo Rápido - Aperfeiçõe o seu atendimento!</title>
      </Helmet>
      <div className="App">
        <MainRoutes/>
      </div>
    </>
  );    
}

export default App;
