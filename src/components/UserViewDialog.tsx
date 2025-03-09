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
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: 'background.paper'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        pb: 2 
      }}>
        <Typography variant="h6">User Details</Typography>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" color="primary">
              {`${selectedUser.firstname} ${selectedUser.lastname}`}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
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
                      px: 1.5, 
                      py: 0.5, 
                      borderRadius: 1,
                      fontSize: '0.875rem'
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