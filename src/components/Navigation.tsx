import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { logout } from '../store/slices/authSlice';
import { authService } from '../services/authService';

export const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Button onClick={handleLogout} color="inherit">
      Logout
    </Button>
  );
}; 