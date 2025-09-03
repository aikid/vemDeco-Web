import React from 'react';
import { Box, Button, Container, TextField, MenuItem, Typography, AppBar, Toolbar, IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProducScroll from '../../components/ProductScroll/ProducScroll';

function Initial() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Top AppBar */}
      <AppBar position="static" sx={{ bgcolor: '#ffab00' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* <img src="https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/6.4.0/mercadolibre/logo__large_plus.png" alt="Logo" height={40} /> */}
            <img src="vemdeco-a-sua-plataforma-para-venda-e-compra-de-servicos-logo.svg" alt="Vemdeco Logo" height={40}/>
          </Box>
          <TextField
            placeholder="Buscar produtos, marcas e muito mais..."
            size="small"
            variant="outlined"
            sx={{ width: '40%', bgcolor: 'white', borderRadius: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
          <Box>
            <Typography variant="body2">leandro</Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Banner */}
      <Box
        sx={{
          backgroundImage: 'url("/banners/vemdeco-banner-imoveis.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4" sx={{ bgcolor: '#ffe600', px: 2, py: 1, fontWeight: 'bold' }}>
          Encontre seu próximo imóvel
        </Typography>
      </Box>

      {/* Search Box */}
      <Container maxWidth="lg" sx={{ mt: -6, bgcolor: '#f0f0f0', p: 4, borderRadius: 2, boxShadow: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField select label="Venda" fullWidth sx={{ minWidth: 120 }} defaultValue="venda">
            <MenuItem value="venda">Venda</MenuItem>
            <MenuItem value="aluguel">Aluguel</MenuItem>
          </TextField>

          <TextField select label="Tipo" fullWidth sx={{ minWidth: 120 }} defaultValue="casas">
            <MenuItem value="casas">Casas</MenuItem>
            <MenuItem value="apartamentos">Apartamentos</MenuItem>
          </TextField>

          <TextField label="Informe bairro ou cidade" fullWidth />

          <Button variant="contained" sx={{ bgcolor: '#3483fa' }}>Buscar</Button>
          <Button variant="outlined">Buscar no mapa</Button>
        </Box>
      </Container>
      <ProducScroll />
    </Box>
  );
}

export default Initial;