import React from 'react';
import { Box } from '@mui/material';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => (
  <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
    <Sidebar />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        ml: `${DRAWER_WIDTH}px`,
        p: 3,
        minHeight: '100vh',
        bgcolor: 'background.default',
        overflow: 'auto',
      }}
    >
      {children}
    </Box>
  </Box>
);

export default Layout;