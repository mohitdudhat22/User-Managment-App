import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Paper, FormControl, Select, MenuItem, InputLabel, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    contact: '',
    postcode: '',
    gender: '',
    role: 'admin',
    hobbies: [] as string[]
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register(formData);
      toast.success('Registration successful!');
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHobbyChange = (hobby: string) => {
    const updatedHobbies = formData.hobbies.includes(hobby)
      ? formData.hobbies.filter(h => h !== hobby)
      : [...formData.hobbies, hobby];
    setFormData({ ...formData, hobbies: updatedHobbies });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ 
        mt: 8, 
        mb: 4,
        animation: 'fadeIn 0.3s ease-in-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
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
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="firstname"
              label="First Name"
              onChange={handleChange}
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
              name="lastname"
              label="Last Name"
              onChange={handleChange}
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
              name="email"
              label="Email"
              type="email"
              onChange={handleChange}
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
              onChange={handleChange}
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
              name="contact"
              label="Contact"
              onChange={handleChange}
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
              name="postcode"
              label="Postcode"
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            <FormControl 
              fullWidth 
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            >
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <FormGroup sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Hobbies
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.hobbies.includes('reading')}
                    onChange={() => handleHobbyChange('reading')}
                  />
                }
                label="Reading"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.hobbies.includes('gaming')}
                    onChange={() => handleHobbyChange('gaming')}
                  />
                }
                label="Gaming"
              />
            </FormGroup>

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
              {loading ? 'Registering...' : 'Register'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <MuiLink component={RouterLink} to="/login" sx={{ textDecoration: 'none' }}>
                  Sign in here
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};