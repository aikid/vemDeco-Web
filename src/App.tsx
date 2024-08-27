import React from 'react';
import './App.css';
import MainRoutes from './routes';
import { BrowserRouter } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Helmet>
            <meta charSet="utf-8" />
            <title>Resumo Rápido - Aperfeiçõe o seu atendimento!</title>
        </Helmet>
        <div className="App">
          <MainRoutes/>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );    
}

export default App;
