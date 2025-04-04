import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Grid } from '@mui/material';

const InitialStarSelector = ({ onSetInitialData }) => {
  const [initialStar, setInitialStar] = useState('19');
  const [equipmentPrice, setEquipmentPrice] = useState('30');
  const [init15star, setInit15Star] = useState('4');
  const [init16star, setInit16Star] = useState('8');
  const [init17star, setInit17Star] = useState('100');
  const [init18star, setInit18Star] = useState('300');
  const [init19star, setInit19Star] = useState('800');
  const [init20star, setInit20Star] = useState('2200');

  const handleSubmit = () => {
    const star = parseInt(initialStar, 10);
    const price = parseFloat(equipmentPrice);
    if (!isNaN(star) && !isNaN(price)) {
      onSetInitialData({ 
        star, 
        price,
        init15star,
        init16star,
        init17star,
        init18star,
        init19star,
        init20star
      });
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: '#333',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>

        <Typography variant="h5" gutterBottom>
          請設定初始星力與裝備價格
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <TextField
              label="初始星力"
              type="number"
              value={initialStar}
              onChange={(e) => setInitialStar(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="裝備價格"
              type="number"
              value={equipmentPrice}
              onChange={(e) => setEquipmentPrice(e.target.value)}
              fullWidth
            />
          </Grid>
       
          <Grid item xs={12} sm={4}>
            <TextField
              label="15星價格"
              type="number"
              value={init15star}
              onChange={(e) => setInit15Star(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="16星價格"
              type="number"
              value={init16star}
              onChange={(e) => setInit16Star(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="17星價格"
              type="number"
              value={init17star}
              onChange={(e) => setInit17Star(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="18星價格"
              type="number"
              value={init18star}
              onChange={(e) => setInit18Star(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="19星價格"
              type="number"
              value={init19star}
              onChange={(e) => setInit19Star(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="20星價格"
              type="number"
              value={init20star}
              onChange={(e) => setInit20Star(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 3 }}>
          開始模擬
        </Button>
      </Container>
    </Box>
  );
};

export default InitialStarSelector;
