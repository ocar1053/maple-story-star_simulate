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
import enhancementTable from './enhancementTable'; // Enhancement chance table

function StarforceSimulator() {
  // Initial settings: star level, equipment price, and scroll prices (for 15~20 stars)
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

  // Enhancement process state
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [openResultDialog, setOpenResultDialog] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  // Protection option state (radio group): "50" or "9"
  const [protectionOption, setProtectionOption] = useState("50");

  // Count of consecutive downgrade failures (only count failures that result in a star downgrade)
  const [consecutiveDowngradeFailures, setConsecutiveDowngradeFailures] = useState(0);

  // Total cost accumulator
  const [totalCost, setTotalCost] = useState(0);

  // State to show the restart dialog when equipment is destroyed (using 9元大法)
  const [showRestartDialog, setShowRestartDialog] = useState(false);

  // New state to show the direct scroll selection dialog (equipment is not destroyed)
  const [showScrollDialog, setShowScrollDialog] = useState(false);

  // Set initial data from InitialStarSelector
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

  // Enhancement business logic
  const handleEnhance = () => {
    // Check if maximum enhancement level is reached
    if (starLevel >= enhancementTable.length) {
      setResultMessage("已達最高強化等級！");
      setOpenResultDialog(true);
      return;
    }
    setIsEnhancing(true);

    // Add protection cost based on the selected option ("50" or "9")
    const protectionCost = parseInt(protectionOption, 10) || 0;
    setTotalCost(prev => prev + protectionCost);

    // Guarantee success only if there are two consecutive downgrade failures (i.e., definite failures that lower the star level)
    if (consecutiveDowngradeFailures >= 2) {
      const newStar = starLevel + 1;
      setStarLevel(newStar);
      setResultMessage(`保底成功！星數從 ${starLevel} 提升到 ${newStar} 星`);
      setConsecutiveDowngradeFailures(0);
      setIsEnhancing(false);
      setOpenResultDialog(true);
      return;
    }

    // Retrieve the current probabilities from enhancementTable for the current star level
    const { success, destroy, downgrade, maintain } = enhancementTable[starLevel];
    const rand = Math.random();
    let message = '';

    if (rand < success) {
      // Success branch: upgrade star level and reset downgrade failure counter
      const newStar = starLevel + 1;
      setStarLevel(newStar);
      message = `強化成功！星數從 ${starLevel} 提升到 ${newStar} 星`;
      setConsecutiveDowngradeFailures(0);
    } else if (rand < success + destroy) {
      // Destruction branch
      if (protectionOption === "50") {
        // When using "50 點" protection, equipment is protected from destruction.
        // If there is a downgrade chance, downgrade the star level.
        if (enhancementTable[starLevel].downgrade > 0) {
          const newStar = Math.max(starLevel - 1, 0);
          setStarLevel(newStar);
          message = `強化失敗，使用 50 點保護後星數下降至 ${newStar} 星`;
          setConsecutiveDowngradeFailures(prev => prev + 1);
        } else {
          // If no downgrade chance exists, star level remains unchanged.
          message = `強化失敗，使用 50 點保護後星數維持在 ${starLevel} 星`;
          setConsecutiveDowngradeFailures(0);
        }
      } else {
        // When using "9元大法", equipment is not protected.
        // Trigger the restart dialog to let the user choose a reset via scroll.
        setShowRestartDialog(true);
        setIsEnhancing(false);
        return;
      }
    } else if (rand < success + destroy + downgrade) {
      // Downgrade branch: failure results in star level decrease.
      const newStar = Math.max(starLevel - 1, 0);
      setStarLevel(newStar);
      message = `強化失敗，星數下降至 ${newStar} 星`;
      setConsecutiveDowngradeFailures(prev => prev + 1);
    } else {
      // Maintain branch: failure but star level remains unchanged.
      message = `強化失敗，星數維持在 ${starLevel} 星`;
      setConsecutiveDowngradeFailures(0);
    }

    setResultMessage(message);
    setIsEnhancing(false);
    setOpenResultDialog(true);
  };

  // Handle reset when equipment is destroyed (triggered by "9元大法")
  const handleRestart = (resetTo) => {
    // Retrieve the scroll cost for the selected star level reset
    const scrollCost = parseFloat(scrollPrices[`init${resetTo}star`]) || 0;
    // Add equipment price and scroll cost to the total cost
    setTotalCost(prev => prev + equipmentPrice + scrollCost);
    setStarLevel(resetTo);
    setConsecutiveDowngradeFailures(0);
    setShowRestartDialog(false);
    setResultMessage(`已重置裝備至 ${resetTo} 星，並加上裝備價格與星捲成本。`);
    setOpenResultDialog(true);
  };

  // New function: Handle reset by directly choosing a star scroll (equipment is not destroyed)
  const handleResetByScroll = (resetTo) => {
    // Retrieve only the scroll cost for the selected reset star level
    const scrollCost = parseFloat(scrollPrices[`init${resetTo}star`]) || 0;
    // Only add the scroll cost (equipment is not destroyed, so no equipment price is added)
    setTotalCost(prev => prev + scrollCost);
    setStarLevel(resetTo);
    setConsecutiveDowngradeFailures(0);
    setShowScrollDialog(false);
    setResultMessage(`已使用星捲重置裝備至 ${resetTo} 星 (裝備未爆掉)，成本增加 ${scrollCost}`);
    setOpenResultDialog(true);
  };

  // Render the main enhancement content
  const renderStarForceContent = () => (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: 320 }}>
        <CardContent>
          {/* Display current star level and next star level */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <TagFacesIcon sx={{ fontSize: 40 }} />
              <Typography variant="body2">{starLevel} 星</Typography>
            </Box>
            <Typography variant="h6" sx={{ mx: 1 }}>→</Typography>
            <Box sx={{ textAlign: 'center' }}>
              <TagFacesIcon sx={{ fontSize: 40 }} />
              <Typography variant="body2">{starLevel + 1} 星</Typography>
            </Box>
          </Box>

          {/* Display current probabilities */}
          <Typography variant="body2">
            成功機率: {(consecutiveDowngradeFailures >= 2 ? 1 : enhancementTable[starLevel]?.success) * 100}%
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

          {/* Display total cost */}
          <Typography variant="body2" sx={{ mt: 1 }}>
            總成本: {totalCost}
          </Typography>

          {/* Protection option: radio group */}
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

          {/* Enhance button */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button variant="contained" onClick={handleEnhance} disabled={isEnhancing} sx={{ width: '100%' }}>
              {isEnhancing ? '強化中...' : '強化'}
            </Button>
          </Box>
          {/* New button to directly choose a star scroll without equipment destruction */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setShowScrollDialog(true)}
              sx={{ width: '100%' }}
              disabled={starLevel >= 20}  // Disable if current star level is 20 or above
            >
              直接選擇星捲 (裝備不會爆掉，20星以上無法使用)
            </Button>
          </Box>
          {isEnhancing && (
            <Box sx={{ mt: 1 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                強化處理中，請稍候...
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );

  // Render InitialStarSelector if initial data is not set
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
        minHeight: '100vh',
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
      {/* Dialog for equipment destruction reset options (triggered by 9元大法) */}
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
                  {starOption} 星 ({scrollPrices[`init${starOption}star`]})
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRestartDialog(false)}>取消</Button>
        </DialogActions>
      </Dialog>
      {/* Dialog for direct scroll selection (equipment is not destroyed) */}
      <Dialog open={showScrollDialog && starLevel < 20} onClose={() => setShowScrollDialog(false)}>
        <DialogTitle>直接選擇星捲</DialogTitle>
        <DialogContent>
          <Typography>
            請選擇重置星數（僅使用星捲，裝備不會爆掉），僅顯示高於目前星數的選項：
          </Typography>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {
              // Only show star options greater than current starLevel
              [15, 16, 17, 18, 19, 20]
                .filter(option => option > starLevel)
                .map((starOption) => (
                  <Grid item xs={4} key={starOption}>
                    <Button variant="outlined" fullWidth onClick={() => handleResetByScroll(starOption)}>
                      {starOption} 星 ({scrollPrices[`init${starOption}star`]})
                    </Button>
                  </Grid>
                ))
            }
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowScrollDialog(false)}>取消</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StarforceSimulator;
