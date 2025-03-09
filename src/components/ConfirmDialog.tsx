import { 
  Dialog, DialogTitle, DialogContent, DialogContentText, 
  DialogActions, Button, Typography 
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
}

const ConfirmDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  content 
}: ConfirmDialogProps) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      TransitionProps={{
        timeout: 300
      }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: 'background.paper',
          minWidth: { xs: '300px', sm: '400px' },
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
        <Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 3 }}>
        <DialogContentText color="text.secondary">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider', gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3
          }}
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog; 