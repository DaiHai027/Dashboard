'use client';

import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Switch,
  FormControlLabel,
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
  Button
} from '@mui/material';
import { People, FilterList, Refresh } from '@mui/icons-material';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
}

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showActive, setShowActive] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:4000/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowActive(event.target.checked);
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    axios.get('http://localhost:4000/users')
      .then((response) => setUsers(response.data))
      .catch(() => setError('Failed to load user data.'))
      .finally(() => setLoading(false));
  };

  const handleToggleStatus = (userId: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      )
    );
  };

  const filteredUsers = showActive
    ? users.filter((user) => user.status === 'active')
    : users;

  return (
    <>
      {/* AppBar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <People fontSize="large" sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <IconButton color="inherit" onClick={handleRefresh}>
            <Refresh />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>

        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item>
            {/* Filter Switch */}
            <FormControlLabel
              control={
                <Switch
                  checked={showActive}
                  onChange={handleFilterChange}
                  color="primary"
                />
              }
              label="Show Active Users Only"
            />
          </Grid>

          {/* Remove the unnecessary IconButton onClick handler */}
          <Grid item>
            <IconButton color="primary">
              <FilterList />
            </IconButton>
          </Grid>
        </Grid>

        {/* Loading State */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <CircularProgress />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            {error}
          </Alert>
        )}

        {/* User Table in a Card */}
        {!loading && !error && (
          <Card sx={{ marginTop: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                User List
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color={user.status === 'active' ? 'success' : 'error'}
                            sx={{ width: '120px' }}
                            onClick={() => handleToggleStatus(user.id)}
                          >
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
}
