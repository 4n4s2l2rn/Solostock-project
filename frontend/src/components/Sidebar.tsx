import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, Divider, Avatar, Chip, Badge,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const DRAWER_WIDTH = 260;

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  ACHETEUR: [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardOutlinedIcon /> },
    { path: '/catalog', label: 'Catalog', icon: <InventoryOutlinedIcon /> },
    { path: '/my-offers', label: 'My Offers', icon: <HandshakeOutlinedIcon /> },
    { path: '/payments', label: 'Payments', icon: <PaymentOutlinedIcon /> },
  ],
  FOURNISSEUR: [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardOutlinedIcon /> },
    { path: '/my-products', label: 'My Products', icon: <InventoryOutlinedIcon /> },
    { path: '/received-offers', label: 'Received Offers', icon: <HandshakeOutlinedIcon /> },
    { path: '/payments', label: 'Earnings', icon: <TrendingUpOutlinedIcon /> },
  ],
  ADMIN: [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardOutlinedIcon /> },
    { path: '/catalog', label: 'All Products', icon: <InventoryOutlinedIcon /> },
    { path: '/admin', label: 'Admin Panel', icon: <AdminPanelSettingsOutlinedIcon /> },
  ],
};

const ROLE_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  ACHETEUR:   { bg: 'rgba(0,188,212,0.12)',  text: '#00bcd4', border: 'rgba(0,188,212,0.3)'  },
  FOURNISSEUR:{ bg: 'rgba(0,230,118,0.12)',  text: '#00e676', border: 'rgba(0,230,118,0.3)'  },
  ADMIN:      { bg: 'rgba(255,82,82,0.12)',   text: '#ff5252', border: 'rgba(255,82,82,0.3)'  },
};

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const role: string = user?.role || 'ACHETEUR';
  const userId = user?.id || 0;

  const [balance, setBalance] = useState<number | null>(null);
  const [pendingOffers, setPendingOffers] = useState(0);

  useEffect(() => {
    if (!userId) return;

    // Fetch balance from transactions
    if (role === 'ACHETEUR') {
      api.get(`/api/payment/transactions/payer/${userId}`)
        .then(res => {
          const total = (res.data as any[]).reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
          setBalance(total);
        })
        .catch(() => {});
    } else if (role === 'FOURNISSEUR') {
      api.get('/api/payment/transactions')
        .then(res => {
          const total = (res.data as any[])
            .filter((t: any) => t.receiverId === userId)
            .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
          setBalance(total);
        })
        .catch(() => {});

      // Fetch pending offers count for badge
      api.get(`/api/negotiation/offers/supplier/${userId}`)
        .then(res => {
          const count = (res.data as any[]).filter((o: any) => o.status === 'PENDING').length;
          setPendingOffers(count);
        })
        .catch(() => {});
    }
  }, [userId, role]);

  const navItems: NavItem[] = (NAV_BY_ROLE[role] || NAV_BY_ROLE['ACHETEUR']).map(item => {
    if (item.path === '/received-offers' && pendingOffers > 0) {
      return { ...item, badge: pendingOffers };
    }
    return item;
  });

  const handleLogout = () => { logout(); navigate('/login'); };

  const roleColors = ROLE_COLOR[role] || ROLE_COLOR['ACHETEUR'];
  const balanceLabel = role === 'FOURNISSEUR' ? 'Total Earned' : 'Total Spent';

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#0d1220',
          borderRight: '1px solid rgba(61,90,254,0.15)',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 38, height: 38, borderRadius: 2, background: 'linear-gradient(135deg, #3d5afe, #00bcd4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <StorefrontOutlinedIcon sx={{ color: '#fff', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ color: '#e8eaf6', lineHeight: 1.1, fontSize: '1rem' }}>Solostock</Typography>
          <Typography variant="caption" sx={{ color: '#9fa8da', fontSize: '0.68rem' }}>B2B Marketplace</Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(61,90,254,0.15)', mx: 2 }} />

      {/* User card */}
      <Box sx={{ p: 1.5, mx: 1.5, my: 1.5, borderRadius: 2, bgcolor: 'rgba(61,90,254,0.08)', border: '1px solid rgba(61,90,254,0.15)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: '#3d5afe', width: 34, height: 34, fontSize: 13, fontWeight: 700 }}>
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography variant="body2" sx={{ color: '#e8eaf6', fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.fullName || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#9fa8da', fontSize: '0.7rem' }}>
              {user?.email || ''}
            </Typography>
          </Box>
        </Box>

        {/* Role badge */}
        <Chip
          label={role}
          size="small"
          sx={{ mt: 1, bgcolor: roleColors.bg, color: roleColors.text, border: `1px solid ${roleColors.border}`, fontSize: '0.62rem', height: 18 }}
        />

        {/* Balance */}
        {balance !== null && (
          <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 0.8, px: 1, py: 0.75, borderRadius: 1.5, bgcolor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 14, color: role === 'FOURNISSEUR' ? '#34d399' : '#60a5fa' }} />
            <Box>
              <Typography sx={{ fontSize: '0.6rem', color: '#64748b', lineHeight: 1 }}>{balanceLabel}</Typography>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: role === 'FOURNISSEUR' ? '#34d399' : '#60a5fa', lineHeight: 1.2 }}>
                {balance.toFixed(2)} MAD
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Typography variant="caption" sx={{ px: 3, py: 0.5, color: 'rgba(159,168,218,0.5)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Navigation
      </Typography>

      {/* Nav items */}
      <List sx={{ px: 1, flex: 1, mt: 0.5 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2, py: 1.1, px: 2,
                  bgcolor: isActive ? 'rgba(61,90,254,0.18)' : 'transparent',
                  borderLeft: `3px solid ${isActive ? '#3d5afe' : 'transparent'}`,
                  '&:hover': { bgcolor: isActive ? 'rgba(61,90,254,0.22)' : 'rgba(61,90,254,0.07)' },
                  '& .MuiListItemIcon-root': { color: isActive ? '#3d5afe' : '#6b7db3' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, fontSize: 20 }}>
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="warning" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}>
                      {item.icon}
                    </Badge>
                  ) : item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: isActive ? 600 : 400, color: isActive ? '#e8eaf6' : '#9fa8da' }}
                />
                {isActive && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#3d5afe' }} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(61,90,254,0.15)', mx: 2 }} />

      <List sx={{ px: 1, pb: 1.5 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{ borderRadius: 2, py: 1.1, px: 2, '&:hover': { bgcolor: 'rgba(255,82,82,0.08)' } }}
          >
            <ListItemIcon sx={{ minWidth: 38, color: '#ff5252' }}><LogoutOutlinedIcon /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 500, color: '#ff5252' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;