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
  const { selectedUser }:any = useSelector((state: RootState) => state.users);

  if (!selectedUser) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>User Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">
              {`${selectedUser.firstname} ${selectedUser.lastname}`}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {selectedUser.email}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Role</Typography>
            <Typography variant="body1">{selectedUser.role}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Contact</Typography>
            <Typography variant="body1">{selectedUser.contact || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Gender</Typography>
            <Typography variant="body1">{selectedUser.gender || 'N/A'}</Typography>
          </Grid>
          {selectedUser?.hobbies && Array.isArray(selectedUser.hobbies) && selectedUser.hobbies.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2">Hobbies</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {selectedUser.hobbies.map((hobby: string, index: number) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      bgcolor: 'primary.light', 
                      color: 'white', 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1 
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
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserViewDialog; 