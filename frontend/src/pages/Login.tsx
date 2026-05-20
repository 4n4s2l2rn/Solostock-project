import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Typography, Alert,
  InputAdornment, IconButton, CircularProgress,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AuthResponse, User } from '../types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>('/api/auth/login', { email, password });
      const { token, user, role, fullName } = res.data;
      const userData: User = user || {
        id: 0, email, fullName: fullName || email, company: '', phone: '', role: (role as User['role']) || 'ACHETEUR',
      };
      login(token, userData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        background: 'radial-gradient(ellipse at 20% 50%, rgba(61,90,254,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,188,212,0.06) 0%, transparent 50%), #080c18',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 5, width: '100%', maxWidth: 420,
          border: '1px solid rgba(61,90,254,0.2)',
          borderRadius: 3,
          background: 'rgba(17,24,39,0.95)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 56, height: 56, borderRadius: 2.5, mx: 'auto', mb: 2,
              background: 'linear-gradient(135deg, #3d5afe, #00bcd4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <StorefrontOutlinedIcon sx={{ color: '#fff', fontSize: 28 }} />
          </Box>
          <Typography variant="h5" sx={{ color: '#e8eaf6', fontWeight: 700 }}>
            Welcome back
          </Typography>
          <Typography variant="body2" sx={{ color: '#9fa8da', mt: 0.5 }}>
            Sign in to Solostock B2B Marketplace
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth label="Email address" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            required autoComplete="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon sx={{ color: '#9fa8da', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required autoComplete="current-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: '#9fa8da', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                    {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit" fullWidth variant="contained" size="large"
            disabled={loading}
            sx={{ py: 1.4, fontSize: '0.95rem' }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: '#9fa8da' }}>
          Don't have an account?{' '}
          <RouterLink to="/register" style={{ color: '#3d5afe', fontWeight: 600, textDecoration: 'none' }}>
            Create account
          </RouterLink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
