import React from 'react';
import './App.css';
import MainRoutes from './routes';
import { BrowserRouter } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { AuthProvider } from './context/AuthContext';
import { register } from 'swiper/element/bundle';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

register();

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
