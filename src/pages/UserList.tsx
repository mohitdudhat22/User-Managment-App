import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, TablePagination, TableSortLabel, Checkbox, IconButton, 
  TextField, Button, FormControl, InputLabel, Select, MenuItem, Toolbar,
  Typography, CircularProgress, Menu
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as VisibilityIcon,
  FileDownload as FileDownloadIcon,
  Search as SearchIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { 
  fetchUsers, 
  setFilters, 
  toggleUserSelection, 
  clearSelectedUsers,
  deleteUser,
  deleteMultipleUsers,
  setSelectedUser
} from '../store/slices/userSlice';
import { RootState, AppDispatch } from '../store';
import UserFormDialog from '../components/UserFormDialog';
import UserViewDialog from '../components/UserViewDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { userService } from '../services/userService';

export const UserList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    users, 
    loading, 
    totalItems, 
    filters, 
    selectedUserIds 
  } = useSelector((state: RootState) => state.users);

  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState(filters.search);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      dispatch(setFilters({ 
        search: value,
        page: 1
      }));
    }, 500),
    []
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch, filters]);

  const handleChangePage = (_: unknown, newPage: number) => {
    dispatch(setFilters({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ 
      limit: parseInt(event.target.value, 10),
      page: 1 
    }));
  };

  const handleSort = (column: string) => {
    const sortField = column === 'name' ? 'firstname' : column;
    const isAsc = filters.sortBy === sortField && filters.sortOrder === 'asc';
    
    dispatch(setFilters({ 
      sortBy: sortField,
      sortOrder: isAsc ? 'desc' : 'asc'
    }));
  };

  const handleRoleFilter = (event: any) => {
    dispatch(setFilters({ 
      role: event.target.value,
      page: 1
    }));
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      users?.forEach(user => {
        if (!selectedUserIds.includes(user.id)) {
          dispatch(toggleUserSelection(user.id));
        }
      });
    } else {
      dispatch(clearSelectedUsers());
    }
  };

  const handleSelectUser = (id: number) => {
    dispatch(toggleUserSelection(id));
  };

  const handleAddUser = () => {
    dispatch(setSelectedUser(null));
    setOpenForm(true);
  };

  const handleEditUser = (user: any) => {
    dispatch(setSelectedUser(user));
    setOpenForm(true);
  };

  const handleViewUser = (user: any) => {
    dispatch(setSelectedUser(user));
    setOpenView(true);
  };

  const handleDeleteUser = (id: number) => {
    setUserToDelete(id);
    setOpenConfirm(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await dispatch(deleteUser(userToDelete)).unwrap();
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    } else if (selectedUserIds.length > 0) {
      try {
        await dispatch(deleteMultipleUsers(selectedUserIds)).unwrap();
        toast.success('Users deleted successfully');
      } catch (error) {
        toast.error('Failed to delete users');
      }
    }
    setOpenConfirm(false);
    setUserToDelete(null);
  };

  const handleBulkDelete = () => {
    if (selectedUserIds.length === 0) {
      toast.warning('Please select users to delete');
      return;
    }
    setOpenConfirm(true);
  };

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleExportCSV = async () => {
    try {
      const blob = await userService.exportUsersCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('CSV export successful');
    } catch (error) {
      toast.error('CSV export failed');
    }
    handleExportClose();
  };

  const handleExportExcel = async () => {
    try {
      const blob = await userService.exportUsersExcel();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Excel export successful');
    } catch (error) {
      toast.error('Excel export failed');
    }
    handleExportClose();
  };

  const handleExportPDF = async () => {
    try {
      const blob = await userService.exportUsersPDF();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('PDF export successful');
    } catch (error) {
      toast.error('PDF export failed');
    }
    handleExportClose();
  };
  
  return (
    <Box sx={{ 
      width: '100%', 
      p: { xs: 2, sm: 3, md: 4 },
      mt: 8,
      animation: 'fadeIn 0.3s ease-in-out',
      '@keyframes fadeIn': {
        '0%': { opacity: 0, transform: 'translateY(10px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' }
      }
    }}>
      <Paper sx={{ 
        width: '100%', 
        mb: 2,
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: (theme) => theme.shadows[3],
        border: '1px solid',
        borderColor: 'grey.500'
      }}>
        <Box sx={{ 
          p: { xs: 1.5, sm: 2 },
          bgcolor: 'background.default',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Users List
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 2 },
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <TextField
              placeholder="Search users..."
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              sx={{
                width: { xs: '100%', sm: 220 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.paper'
                }
              }}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
              }}
            />
            <FormControl 
              size="small" 
              sx={{ 
                width: { xs: '100%', sm: 150 }
              }}
            >
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={filters.role}
                onChange={handleRoleFilter}
                label="Filter by Role"
                sx={{ 
                  borderRadius: 2,
                  bgcolor: 'background.paper'
                }}
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '100%', sm: 'auto' },
              gap: 1,
              mt: { xs: 1, sm: 0 },
              ml: { sm: 'auto' }
            }}>
              {selectedUserIds.length > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleBulkDelete}
                  startIcon={<DeleteIcon />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    width: { xs: '100%', sm: 'auto' }
                  }}
                >
                  Delete ({selectedUserIds.length})
                </Button>
              )}
              <Button
                variant="outlined"
                color="primary"
                onClick={handleExportClick}
                startIcon={<FileDownloadIcon />}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Export
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleAddUser}
                startIcon={<AddIcon />}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Add User
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ 
        width: '100%', 
        mb: 2,
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: (theme) => theme.shadows[3],
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[6]
        }
      }}>
        <TableContainer sx={{ 
          border: 1, 
          borderColor: 'divider',
          borderRadius: 1,
          '& .MuiTable-root': {
            borderCollapse: 'separate',
            borderSpacing: 0,
          },
          '& .MuiTableCell-root': {
            borderBottom: 1,
            borderColor: 'divider',
          },
          overflowX: 'auto',
          '& .MuiTable-root': {
            minWidth: 650
          }
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedUserIds.length > 0 && selectedUserIds.length < users.length}
                      checked={users?.length > 0 && selectedUserIds.length === users.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={filters.sortBy === 'firstname'}
                      direction={filters.sortBy === 'firstname' ? filters.sortOrder : 'asc'}
                      onClick={() => handleSort('name')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={filters.sortBy === 'email'}
                      direction={filters.sortBy === 'email' ? filters.sortOrder : 'asc'}
                      onClick={() => handleSort('email')}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                      />
                    </TableCell>
                    <TableCell>{`${user.firstname} ${user.lastname}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewUser(user)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleEditUser(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteUser(user.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalItems}
          rowsPerPage={filters.limit}
          page={filters.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <UserFormDialog 
        open={openForm} 
        onClose={() => setOpenForm(false)} 
      />

      <UserViewDialog 
        open={openView} 
        onClose={() => setOpenView(false)} 
      />

      <ConfirmDialog
        open={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Confirmation"
        content={userToDelete 
          ? "Are you sure you want to delete this user?" 
          : "Are you sure you want to delete the selected users?"
        }
      />

      <Menu
        anchorEl={exportAnchorEl}
        open={Boolean(exportAnchorEl)}
        onClose={handleExportClose}
      >
        <MenuItem onClick={handleExportCSV}>Export as CSV</MenuItem>
        <MenuItem onClick={handleExportExcel}>Export as Excel</MenuItem>
        <MenuItem onClick={handleExportPDF}>Export as PDF</MenuItem>
      </Menu>
    </Box>
  );
}; 