import React, { useState } from 'react';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid,
} from '@mui/material';
import InitialStarSelector from './InitialStarSelector';
import enhancementTable from './enhancementTable'; 

function StarforceSimulator() {
 
  const [isInitialDataSet, setIsInitialDataSet] = useState(false);
  const [starLevel, setStarLevel] = useState(0);
  const [equipmentPrice, setEquipmentPrice] = useState(0);
  const [scrollPrices, setScrollPrices] = useState({
    init15star: 0,
    init16star: 0,
    init17star: 0,
    init18star: 0,
    init19star: 0,
    init20star: 0,
  });

  // state of enhancement process
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [openResultDialog, setOpenResultDialog] = useState(false);
  const [resultMessage, setResultMessage] = useState('');


  const [protectionOption, setProtectionOption] = useState("50");

  // count consecutive failures
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);


  const [totalCost, setTotalCost] = useState(0);


  const [showRestartDialog, setShowRestartDialog] = useState(false);

  // get initial data from InitialStarSelector
  const handleSetInitialData = ({ star, price, init15star, init16star, init17star, init18star, init19star, init20star }) => {
    setStarLevel(star);
    setEquipmentPrice(price);
    setScrollPrices({ 
      init15star: parseFloat(init15star) || 0,
      init16star: parseFloat(init16star) || 0,
      init17star: parseFloat(init17star) || 0,
      init18star: parseFloat(init18star) || 0,
      init19star: parseFloat(init19star) || 0,
      init20star: parseFloat(init20star) || 0,
    });
    setIsInitialDataSet(true);
  };

  // enhancement business logic
  const handleEnhance = () => {
    if (starLevel >= enhancementTable.length) {
      setResultMessage("已達最高強化等級！");
      setOpenResultDialog(true);
      return;
    }
    setIsEnhancing(true);

    // normal:50 9 for 9元大法
    const protectionCost = parseInt(protectionOption, 10) || 0;
    setTotalCost(prev => prev + protectionCost);

    // if consecutive failures >= 2, absolutely success next time
    if (consecutiveFailures >= 2) {
      const newStar = starLevel + 1;
      setStarLevel(newStar);
      setResultMessage(`保底成功！星數從 ${starLevel} 提升到 ${newStar} 星`);
      setConsecutiveFailures(0);
      setIsEnhancing(false);
      setOpenResultDialog(true);
      return;
    }

    const { success, destroy, downgrade, maintain } = enhancementTable[starLevel];
    const rand = Math.random();
    let message = '';

    if (rand < success) {
      // success logic
      const newStar = starLevel + 1;
      setStarLevel(newStar);
      message = `強化成功！星數從 ${starLevel} 提升到 ${newStar} 星`;
      setConsecutiveFailures(0);
    } else if (rand < success + destroy) {
      // destroy logic
      if (protectionOption === "50") {
        // 50 for protection
        if (enhancementTable[starLevel].downgrade > 0) {
          const newStar = Math.max(starLevel - 1, 0);
          setStarLevel(newStar);
          message = `強化失敗，使用 50 點保護後星數下降至 ${newStar} 星`;
        } else {
          message = `強化失敗，使用 50 點保護後星數維持在 ${starLevel} 星`;
        }
        setConsecutiveFailures(prev => prev + 1);
      } else {
        // 9 is for 9元大法
        setShowRestartDialog(true);
        setIsEnhancing(false);
        return;
      }
    } else if (rand < success + destroy + downgrade) {
      // downgrade logic
      const newStar = Math.max(starLevel - 1, 0);
      setStarLevel(newStar);
      message = `強化失敗，星數下降至 ${newStar} 星`;
      setConsecutiveFailures(prev => prev + 1);
    } else {
      // maintain logic
      message = `強化失敗，星數維持在 ${starLevel} 星`;
      setConsecutiveFailures(prev => prev + 1);
    }

    setResultMessage(message);
    setIsEnhancing(false);
    setOpenResultDialog(true);
  };

  // handle restart logic
  const handleRestart = (resetTo) => {
    // find the scroll price
    const scrollCost = parseFloat(scrollPrices[`init${resetTo}star`]) || 0;
    // reset star level and total cost
    setTotalCost(prev => prev + equipmentPrice + scrollCost);
    setStarLevel(resetTo);
    setConsecutiveFailures(0);
    setShowRestartDialog(false);
    setResultMessage(`已重置裝備至 ${resetTo} 星，並扣除裝備價格與星捲成本。`);
    setOpenResultDialog(true);
  };

  const renderStarForceContent = () => (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: 320 }}>
        <CardContent>
        
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <TagFacesIcon sx={{ fontSize: 40 }} />
              <Typography variant="body2">{starLevel} Star</Typography>
            </Box>
            <Typography variant="h6" sx={{ mx: 1 }}>→</Typography>
            <Box sx={{ textAlign: 'center' }}>
              <TagFacesIcon sx={{ fontSize: 40 }} />
              <Typography variant="body2">{starLevel + 1} Star</Typography>
            </Box>
          </Box>

          {/* current state */}
          <Typography variant="body2">
            成功機率: {(consecutiveFailures >= 2 ? 1 : enhancementTable[starLevel]?.success) * 100}%
          </Typography>
          <Typography variant="body2">
            破壞機率: {(enhancementTable[starLevel]?.destroy * 100).toFixed(2) || 0}%
          </Typography>
          <Typography variant="body2">
            下滑機率: {(enhancementTable[starLevel]?.downgrade * 100).toFixed(2) || 0}%
          </Typography>
          <Typography variant="body2">
            維持機率: {(enhancementTable[starLevel]?.maintain * 100).toFixed(2) || 0}%
          </Typography>

          {/* show $$ */}
          <Typography variant="body2" sx={{ mt: 1 }}>
            總成本: {totalCost}
          </Typography>

          {/* protect or not */}
          <FormControl sx={{ mt: 2 }}>
            <FormLabel>保護選項</FormLabel>
            <RadioGroup
              row
              value={protectionOption}
              onChange={(e) => setProtectionOption(e.target.value)}
            >
              <FormControlLabel value="50" control={<Radio />} label="50 點" />
              <FormControlLabel value="9" control={<Radio />} label="9元大法" />
            </RadioGroup>
          </FormControl>

          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            裝備強化失敗時可能會破壞或下滑！
          </Typography>

         
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button variant="contained" onClick={handleEnhance} disabled={isEnhancing} sx={{ width: '100%' }}>
              {isEnhancing ? 'ENHANCING...' : 'ENHANCE'}
            </Button>
            {isEnhancing && (
              <Box sx={{ mt: 1 }}>
                <CircularProgress size={24} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  強化處理中，請稍候...
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  // set up initial data
  if (!isInitialDataSet) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#333',
        }}
      >
        <InitialStarSelector onSetInitialData={handleSetInitialData} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
     
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333',
        p: 2,
      }}
    >
      {renderStarForceContent()}
      <Dialog open={openResultDialog} onClose={() => setOpenResultDialog(false)}>
        <DialogTitle>強化結果</DialogTitle>
        <DialogContent>
          <Typography>{resultMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResultDialog(false)}>確定</Button>
        </DialogActions>
      </Dialog>
      {/*if destory provide scroll*/}
      <Dialog open={showRestartDialog} onClose={() => setShowRestartDialog(false)}>
        <DialogTitle>裝備已破壞！</DialogTitle>
        <DialogContent>
          <Typography>
            請選擇重新設定星數（成本會加上 裝備價格 + 對應星捲價格）：
          </Typography>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {[15, 16, 17, 18, 19, 20].map((starOption) => (
              <Grid item xs={4} key={starOption}>
                <Button variant="outlined" fullWidth onClick={() => handleRestart(starOption)}>
                  {starOption}星 ({scrollPrices[`init${starOption}star`]})
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRestartDialog(false)}>取消</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StarforceSimulator;
