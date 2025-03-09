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
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: 'background.paper',
          minWidth: { xs: '300px', sm: '400px' }
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        pb: 2 
      }}>
        <Typography variant="h6">{title}</Typography>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <DialogContentText color="text.secondary">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error" 
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog; 