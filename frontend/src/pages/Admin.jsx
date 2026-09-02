import React, { useEffect, useState } from "react";
import axios from "axios";
import server from "../environment";
import { 
    Container, Paper, Typography, Table, TableBody, 
    TableCell, TableHead, TableRow, Button, Grid, Card, CardContent, CircularProgress 
} from "@mui/material";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalUsers: 0, totalMeetings: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Redirection logic completely removed
        fetchStats();
        fetchUsers();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${server}/api/v1/users/admin/stats`);
            setStats(res.data);
        } catch (err) {
            console.error("Error fetching stats", err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${server}/api/v1/users/admin/users`);
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`${server}/api/v1/users/admin/users/${id}`);
            fetchUsers();
        } catch (err) {
            console.error("Error deleting user", err);
        }
    };

    if (loading) {
        return (
            <Container style={{ textAlign: "center", marginTop: "5rem" }}>
                <CircularProgress />
                <Typography variant="h6" style={{ marginTop: "1rem" }}>
                    Loading Dashboard...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
            <Typography variant="h4" gutterBottom align="center">
                Dashboard Overview
            </Typography>
            
            {/* Stats Overview Cards */}
            <Grid container spacing={3} style={{ marginBottom: "2rem" }}>
                <Grid item xs={12} sm={6}>
                    <Card style={{ backgroundColor: "#f5f5f5" }}>
                        <CardContent>
                            <Typography color="textSecondary">Total Registered Users</Typography>
                            <Typography variant="h3">{stats.totalUsers}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card style={{ backgroundColor: "#f5f5f5" }}>
                        <CardContent>
                            <Typography color="textSecondary">Total Meetings Created</Typography>
                            <Typography variant="h3">{stats.totalMeetings}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Registered Users Table */}
            <Paper style={{ padding: "1rem" }}>
                <Typography variant="h6" gutterBottom>
                    User Management
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Name</b></TableCell>
                            <TableCell><b>Username</b></TableCell>
                            <TableCell><b>Action</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u._id}>
                                <TableCell>{u.name}</TableCell>
                                <TableCell>{u.username}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="error" 
                                        onClick={() => handleDeleteUser(u._id)}
                                    >
                                        Delete User
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
}