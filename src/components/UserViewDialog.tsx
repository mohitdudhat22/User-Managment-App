import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Grid, Divider, Box
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface UserViewDialogProps {
  open: boolean;
  onClose: () => void;
}

const UserViewDialog = ({ open, onClose }: UserViewDialogProps) => {
  const { selectedUser } = useSelector((state: RootState) => state.users);

  if (!selectedUser) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      TransitionProps={{
        timeout: 300
      }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.shadows[5],
          '& .MuiDialogTitle-root': {
            borderBottom: 1,
            borderColor: 'divider',
            pb: 2,
            px: 3
          }
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>User Details</Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              {`${selectedUser.firstname} ${selectedUser.lastname}`}
            </Typography>
            <Typography color="text.secondary">
              {selectedUser.email}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">Role</Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedUser.role}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">Contact</Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedUser.contact || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">Gender</Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedUser.gender || 'N/A'}</Typography>
          </Grid>
          {selectedUser?.hobbies && Array.isArray(selectedUser.hobbies) && selectedUser.hobbies.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">Hobbies</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {selectedUser.hobbies.map((hobby: string, index: number) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'primary.contrastText', 
                      px: 2, 
                      py: 0.75, 
                      borderRadius: 2,
                      fontSize: '0.875rem',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    {hobby}
                  </Box>
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} variant="outlined">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserViewDialog; 