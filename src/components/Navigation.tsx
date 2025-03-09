import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@mui/material';
import { logout } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import { useTheme } from '../theme/ThemeProvider';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { RootState } from '../store';

export const Navigation = () => {
  const { mode, toggleColorMode } = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <AppBar position="fixed" elevation={1}>
      <Toolbar sx={{ px: 3 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          User Management
        </Typography>
        {!isAuthPage && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {user && (
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Welcome, {user.firstname}
              </Typography>
            )}
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <Button 
              onClick={handleLogout} 
              color="inherit"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                px: 2
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}; 