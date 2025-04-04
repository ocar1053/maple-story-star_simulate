import StarforceSimulator from './StarforceSimulator'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
function App() {

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9',
      },
      secondary: {
        main: '#f48fb1',
      },
      background: {
        default: '#333', 
        paper: '#424242', 
      },
    },
  });
  
  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <StarforceSimulator />
      </ThemeProvider>
    </div>
  )
}

export default App
