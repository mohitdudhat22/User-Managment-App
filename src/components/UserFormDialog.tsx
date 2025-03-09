import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, FormControl, InputLabel, Select, MenuItem, 
  FormHelperText, CircularProgress
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditMode ? 'Edit User' : 'Add User'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            id="firstname"
            name="firstname"
            label="First Name"
            value={formik.values.firstname}
            onChange={formik.handleChange}
            error={formik.touched.firstname && Boolean(formik.errors.firstname)}
            helperText={formik.touched.firstname && formik.errors.firstname}
          />
          <TextField
            fullWidth
            margin="normal"
            id="lastname"
            name="lastname"
            label="Last Name"
            value={formik.values.lastname}
            onChange={formik.handleChange}
            error={formik.touched.lastname && Boolean(formik.errors.lastname)}
            helperText={formik.touched.lastname && formik.errors.lastname}
          />
          <TextField
            fullWidth
            margin="normal"
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          {!isEditMode && (
            <TextField
              fullWidth
              margin="normal"
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          )}
          <TextField
            fullWidth
            margin="normal"
            id="contact"
            name="contact"
            label="Contact"
            value={formik.values.contact}
            onChange={formik.handleChange}
            error={formik.touched.contact && Boolean(formik.errors.contact)}
            helperText={formik.touched.contact && formik.errors.contact}
          />
          <TextField
            fullWidth
            margin="normal"
            id="postcode"
            name="postcode"
            label="Postcode"
            value={formik.values.postcode}
            onChange={formik.handleChange}
            error={formik.touched.postcode && Boolean(formik.errors.postcode)}
            helperText={formik.touched.postcode && formik.errors.postcode}
          />
          <TextField
            fullWidth
            margin="normal"
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
          
          <FormControl 
            fullWidth 
            margin="normal"
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
          <FormControl 
            fullWidth 
            margin="normal"
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
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