import { useNavigate } from "react-router-dom";
import { Grid, Box, Button } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import './initial.css'

function Initial(){
    let navigate = useNavigate();

    const data = [
      {id: 1, image: './banners/resumo-rapido-inteligencia-medica-banner-1.png'},
      {id: 2, image: './banners/resumo-rapido-inteligencia-medica-banner-1.png'},
      {id: 3, image: './banners/resumo-rapido-inteligencia-medica-banner-1.png'},
      {id: 4, image: './banners/resumo-rapido-inteligencia-medica-banner-1.png'},
    ]

    return (
        <Grid container style={{ height: '100vh' }}>
          {/* Coluna da Esquerda */}
          <Grid item xs={12} md={5} className="contentButton">
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
              {/* Logo ou Icone */}
              <Box mb={3}>
                <img src="resumo-rapido-atendimento-medico-logo.svg" alt="Logo" style={{ width: '80px' }} />
              </Box>
              <div className="welcomeSection">
                <h3 className="welcomeText">
                  Bem vindo(a)!
                </h3>
                <p className="welcomeSubText">
                  Como você deseja continuar?
                </p>
                <Button className="signInButton" onClick={() => navigate('/login')}>
                  Já sou cliente
                </Button>
                <Button className="signUpButton" onClick={() => navigate('/registro')}>
                  Criar uma conta
                </Button>
              </div>
            </Box>
          </Grid>
    
          {/* Coluna da Direita */}
          <Grid item xs={12} md={7} className="contentSlide">
              <Swiper
                slidesPerView={1}
                pagination={{clickable: true}}
              >
                {data.map((item)=> (
                  <SwiperSlide key={item.id}><img src={item.image} className="slide-item" alt="Dr Mobile Banner" /></SwiperSlide>
                ))}
              </Swiper>
          </Grid>
        </Grid>
      );

}

export default Initial;

