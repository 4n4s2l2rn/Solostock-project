import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Typography, Alert,
  InputAdornment, MenuItem, Grid, CircularProgress, IconButton,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AuthResponse, User } from '../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: '', password: '', fullName: '', company: '', phone: '',
    role: 'ACHETEUR' as 'FOURNISSEUR' | 'ACHETEUR',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>('/api/auth/register', form);
      const { token, email, fullName, role } = res.data;
      const userData: User = res.data.user || {
        id: 0,
        email: email || form.email,
        fullName: fullName || form.fullName,
        company: form.company,
        phone: form.phone,
        role: (role || form.role) as 'FOURNISSEUR' | 'ACHETEUR',
      };
      login(token, userData);
      navigate('/dashboard');
    } catch (err: any) {
      if (!err.response) {
        setError(`Network error — cannot reach server at ${api.defaults.baseURL}. Is the backend running?`);
      } else {
        const data = err.response.data;
        const msg =
          data?.message ||
          data?.error ||
          (typeof data === 'string' ? data : null) ||
          `Server error ${err.response.status}`;
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', py: 4,
        background: 'radial-gradient(ellipse at 20% 50%, rgba(61,90,254,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,188,212,0.06) 0%, transparent 50%), #080c18',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 5, width: '100%', maxWidth: 520,
          border: '1px solid rgba(61,90,254,0.2)',
          borderRadius: 3,
          background: 'rgba(17,24,39,0.95)',
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
            Create your account
          </Typography>
          <Typography variant="body2" sx={{ color: '#9fa8da', mt: 0.5 }}>
            Join the Solostock B2B Marketplace
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Full Name" value={form.fullName}
                onChange={handleChange('fullName')} required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlinedIcon sx={{ color: '#9fa8da', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Email address" type="email" value={form.email}
                onChange={handleChange('email')} required autoComplete="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: '#9fa8da', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange('password')} required
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Company" value={form.company}
                onChange={handleChange('company')} required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessOutlinedIcon sx={{ color: '#9fa8da', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Phone" value={form.phone}
                onChange={handleChange('phone')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneOutlinedIcon sx={{ color: '#9fa8da', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth select label="Role" value={form.role}
                onChange={handleChange('role')} required
              >
                <MenuItem value="ACHETEUR">
                  <Box>
                    <Typography variant="body2" fontWeight={600}>Acheteur (Buyer)</Typography>
                    <Typography variant="caption" color="text.secondary">Browse and purchase products</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="FOURNISSEUR">
                  <Box>
                    <Typography variant="body2" fontWeight={600}>Fournisseur (Supplier)</Typography>
                    <Typography variant="caption" color="text.secondary">List and sell products</Typography>
                  </Box>
                </MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Button
            type="submit" fullWidth variant="contained" size="large"
            disabled={loading}
            sx={{ mt: 3, py: 1.4, fontSize: '0.95rem' }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: '#9fa8da' }}>
          Already have an account?{' '}
          <RouterLink to="/login" style={{ color: '#3d5afe', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </RouterLink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;