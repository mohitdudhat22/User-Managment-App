import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Paper, Link as MuiLink } from '@mui/material';
import { authService } from '../services/authService';
import { setCredentials } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
interface AuthResponse {
    token: string;
    user: any;
}
export const Login = () => {
  const [email, setEmail] = useState('john1@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authService.login({email, password});
      const { token, user }:AuthResponse = response;
      
      dispatch(setCredentials({ user, token }));
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeIn 0.3s ease-in-out',
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(10px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' }
          }
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'grey.300',
            boxShadow: (theme) => theme.shadows[3],
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: (theme) => theme.shadows[6]
            }
          }}
        >
          <Typography component="h1" variant="h5" align="center" sx={{ mb: 3, fontWeight: 600 }}>
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                borderRadius: 2,
                textTransform: 'none',
                py: 1.5
              }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <MuiLink component={RouterLink} to="/register" sx={{ textDecoration: 'none' }}>
                  Sign up here
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}; 