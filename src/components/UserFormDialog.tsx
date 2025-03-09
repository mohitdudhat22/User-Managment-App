import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, FormControl, InputLabel, Select, MenuItem, 
  FormHelperText, CircularProgress, Typography, Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { createUser, updateUser, fetchUsers } from '../store/slices/userSlice';
import { RootState, AppDispatch } from '../store';

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
}

const UserFormDialog = ({ open, onClose }: UserFormDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedUser, loading } = useSelector((state: RootState) => state.users);
  
  const isEditMode = !!selectedUser;

  const validationSchema = Yup.object({
    firstname: Yup.string().required('First name is required'),
    lastname: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    role: Yup.string().required('Role is required'),
    password: isEditMode 
      ? Yup.string() 
      : Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    contact: Yup.string().required('Contact is required'),
    gender: Yup.string().required('Gender is required'),
    postcode: Yup.string().required('Postcode is required'),
  });

  const formik = useFormik({
    initialValues: {
      firstname: selectedUser?.firstname || '',
      lastname: selectedUser?.lastname || '',
      email: selectedUser?.email || '',
      password: '',
      role: selectedUser?.role || 'user',
      contact: selectedUser?.contact || '',
      gender: selectedUser?.gender || '',
      postcode: selectedUser?.postcode || '',
      hobbies: selectedUser?.hobbies || [],
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isEditMode) {
          // Remove password if it's empty in edit mode
          const userData = values.password ? values : { ...values, password: undefined };
          await dispatch(updateUser({ id: selectedUser.id, userData })).unwrap();
          toast.success('User updated successfully');
        } else {
          await dispatch(createUser(values)).unwrap();
          toast.success('User created successfully');
        }
        dispatch(fetchUsers());
        onClose();
      } catch (error) {
        toast.error(isEditMode ? 'Failed to update user' : 'Failed to create user');
      }
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

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
          },
          '& .MuiDialogContent-root': {
            px: 3
          },
          '& .MuiDialogActions-root': {
            borderTop: 1,
            borderColor: 'divider',
            px: 3,
            py: 2
          },
          '& .MuiTextField-root, & .MuiFormControl-root': {
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          {isEditMode ? 'Edit User' : 'Add User'}
        </Typography>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ py: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="firstname"
                name="firstname"
                label="First Name"
                value={formik.values.firstname}
                onChange={formik.handleChange}
                error={formik.touched.firstname && Boolean(formik.errors.firstname)}
                helperText={formik.touched.firstname && formik.errors.firstname}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="lastname"
                name="lastname"
                label="Last Name"
                value={formik.values.lastname}
                onChange={formik.handleChange}
                error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                helperText={formik.touched.lastname && formik.errors.lastname}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            {!isEditMode && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="contact"
                name="contact"
                label="Contact"
                value={formik.values.contact}
                onChange={formik.handleChange}
                error={formik.touched.contact && Boolean(formik.errors.contact)}
                helperText={formik.touched.contact && formik.errors.contact}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="postcode"
                name="postcode"
                label="Postcode"
                value={formik.values.postcode}
                onChange={formik.handleChange}
                error={formik.touched.postcode && Boolean(formik.errors.postcode)}
                helperText={formik.touched.postcode && formik.errors.postcode}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="hobbies"
                name="hobbies"
                label="Hobbies (comma separated)"
                value={Array.isArray(formik.values.hobbies) ? formik.values.hobbies.join(', ') : ''}
                onChange={(e) => {
                  const hobbiesArray = e.target.value
                    .split(',')
                    .map(hobby => hobby.trim())
                    .filter(hobby => hobby !== '');
                  formik.setFieldValue('hobbies', hobbiesArray);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                error={formik.touched.gender && Boolean(formik.errors.gender)}
              >
                <InputLabel>Gender</InputLabel>
                <Select
                  id="gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                {formik.touched.gender && formik.errors.gender && (
                  <FormHelperText>{formik.errors.gender}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                error={formik.touched.role && Boolean(formik.errors.role)}
              >
                <InputLabel>Role</InputLabel>
                <Select
                  id="role"
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  label="Role"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
                {formik.touched.role && formik.errors.role && (
                  <FormHelperText>{formik.errors.role}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={onClose} variant="outlined">Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading || !formik.isValid || !formik.dirty}
          >
            {loading ? <CircularProgress size={24} /> : isEditMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserFormDialog; 