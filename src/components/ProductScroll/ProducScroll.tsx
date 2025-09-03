import React, { useRef } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Grid, Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const produtos = [
  { imagem: '/mesa1.jpg', titulo: 'Mesa Para Computador Notebook Com Rodinhas', preco: 'R$ 212', parcelas: 'em 12x R$ 20,88', entrega: 'Chegará grátis amanhã' },
  { imagem: '/mesa2.jpg', titulo: 'Mesa Para Estudo Multiuso Ajustável Branca...', preco: 'R$ 237', parcelas: 'em 9x R$ 26,33 sem juros', entrega: 'Chegará grátis amanhã' },
  { imagem: '/mesa3.jpg', titulo: 'Mesa Para Notebook Computador Com Altura...', preco: 'R$ 257,50', parcelas: 'em 12x R$ 25,19', entrega: 'Frete grátis' },
  { imagem: '/mesa4.jpg', titulo: 'Escrivaninha Ajustável Café e Sofá...', preco: 'R$ 194', parcelas: 'em 9x R$ 21,56 sem juros', entrega: 'Chegará grátis amanhã' },
  { imagem: '/mesa5.jpg', titulo: 'Mesa Multifuncional Altura Regulável...', precoAntigo: 'R$ 254,90', preco: 'R$ 239,60', desconto: '6% OFF', parcelas: 'em 12x R$ 23,60', entrega: 'Chegará grátis amanhã' },
  { imagem: '/mesa6.jpg', titulo: 'Escrivaninha Industrial Office Aço...', precoAntigo: 'R$ 170,53', preco: 'R$ 158,59', desconto: '7% OFF', parcelas: 'em 12x R$ 15,59', entrega: 'Frete grátis' },
];

function ProducScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);


  const handleScroll = () => {
    scrollRef.current?.scrollBy({ left: 250, behavior: 'smooth' });
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: 2, mt: 4, position: 'relative' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Inspirado no último visto
      </Typography>

      <Grid container spacing={2} wrap="nowrap" sx={{ overflowX: 'auto' }} ref={scrollRef}>
        {produtos.map((produto, i) => (
          <Grid item key={i} sx={{ minWidth: 200 }}>
            <Card sx={{ maxWidth: 200 }}>
              <CardMedia component="img" height="140" image={produto.imagem} alt={produto.titulo} />
              <CardContent>
                <Typography variant="body2" noWrap>{produto.titulo}</Typography>
                {produto.precoAntigo && (
                  <Typography sx={{ textDecoration: 'line-through', color: 'gray' }}>{produto.precoAntigo}</Typography>
                )}
                <Typography variant="h6">{produto.preco}</Typography>
                <Typography variant="body2">{produto.parcelas}</Typography>
                {produto.desconto && (
                  <Typography color="green">{produto.desconto}</Typography>
                )}
                <Typography sx={{ color: 'green', fontWeight: 500 }}>{produto.entrega}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        onClick={handleScroll}
        sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', borderRadius: '50%', minWidth: 40, width: 40, height: 40 }}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </Button>
    </Box>
  );
}

export default ProducScroll;
