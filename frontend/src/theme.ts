import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3d5afe',
      light: '#8187ff',
      dark: '#0031ca',
    },
    secondary: {
      main: '#00bcd4',
      light: '#62efff',
      dark: '#008ba3',
    },
    background: {
      default: '#080c18',
      paper: '#111827',
    },
    success: { main: '#00e676' },
    warning: { main: '#ffd740' },
    error: { main: '#ff5252' },
    text: {
      primary: '#e8eaf6',
      secondary: '#9fa8da',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#3d5afe #0d1220',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: '#0d1220' },
          '&::-webkit-scrollbar-thumb': { background: '#3d5afe', borderRadius: 3 },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#111827',
          border: '1px solid rgba(61,90,254,0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#111827',
          border: '1px solid rgba(61,90,254,0.12)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
        containedPrimary: {
          background: 'linear-gradient(135deg, #3d5afe 0%, #5c6bc0 100%)',
          boxShadow: '0 4px 20px rgba(61,90,254,0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5c6bc0 0%, #3d5afe 100%)',
            boxShadow: '0 6px 24px rgba(61,90,254,0.45)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': { borderColor: 'rgba(61,90,254,0.25)' },
            '&:hover fieldset': { borderColor: 'rgba(61,90,254,0.5)' },
            '&.Mui-focused fieldset': { borderColor: '#3d5afe' },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#0d1220',
            fontWeight: 600,
            color: '#9fa8da',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root:hover': {
            backgroundColor: 'rgba(61,90,254,0.05)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.72rem' },
      },
    },
  },
});

export default theme;