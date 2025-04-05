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
        init20star,
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#333',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Main form area */}
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

            {[15, 16, 17, 18, 19, 20].map((level) => (
              <Grid item xs={12} sm={4} key={level}>
                <TextField
                  label={`${level}星價格`}
                  type="number"
                  value={eval(`init${level}star`)}
                  onChange={(e) => eval(`setInit${level}Star`)(e.target.value)}
                  fullWidth
                />
              </Grid>
            ))}
          </Grid>
          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 3 }}>
            開始模擬
          </Button>
        </Container>
      </Box>

      {/* Footer area */}
      <Box sx={{ py: 2, textAlign: 'center', fontSize: '0.75rem', color: '#ccc' }}>
        <Typography variant="body2" component="div" sx={{ mb: 1 }}>
          本網站為《楓之谷》星力強化模擬器，僅供個人學術與非商業用途。<br />
          楓之谷為 NEXON Korea 開發，台灣地區由遊戲橘子代理發行，本網站與上述公司無關亦未獲授權。<br />
          如有侵權疑慮，請聯絡：ocar8951@gmail.com
        </Typography>
        <Typography variant="body2" component="div">
          This site is a fan-made Starforce simulator for MapleStory, for academic and non-commercial use only. <br />
          MapleStory is developed by NEXON Korea and published in Taiwan by Gamania. This site is not affiliated with or authorized by them. <br />
          Contact for takedown requests: ocar8951@gmail.com
        </Typography>
      </Box>
    </Box>
  );
};

export default InitialStarSelector;
