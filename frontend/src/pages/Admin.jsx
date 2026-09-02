import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import server from "../environment";
import { 
    Container, Paper, Typography, Table, TableBody, 
    TableCell, TableHead, TableRow, Button, Grid, Card, CardContent, CircularProgress 
} from "@mui/material";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalUsers: 0, totalMeetings: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Authorization Guard: Check if token exists & user role is admin
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");

        if (!token || userRole !== "admin") {
            alert("Access Denied: Sirf Admin hi is page ko access kar sakte hain!");
            navigate("/"); // Redirect to landing/home page
            return;
        }

        fetchStats();
        fetchUsers();
    }, [navigate]);

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
        if (!window.confirm("Kya aap is user ko delete karna chahte hain?")) return;
        try {
            await axios.delete(`${server}/api/v1/users/admin/users/${id}`);
            fetchUsers(); // Refresh list after delete
        } catch (err) {
            console.error("Error deleting user", err);
        }
    };

    if (loading) {
        return (
            <Container style={{ textAlign: "center", marginTop: "5rem" }}>
                <CircularProgress />
                <Typography variant="h6" style={{ marginTop: "1rem" }}>
                    Verifying Admin Access...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
            <Typography variant="h4" gutterBottom align="center">
                Admin Dashboard
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
                            <TableCell><b>Role</b></TableCell>
                            <TableCell><b>Action</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u._id}>
                                <TableCell>{u.name}</TableCell>
                                <TableCell>{u.username}</TableCell>
                                <TableCell>{u.role || "user"}</TableCell>
                                <TableCell>
                                    {u.role !== "admin" && (
                                        <Button 
                                            variant="contained" 
                                            color="error" 
                                            onClick={() => handleDeleteUser(u._id)}
                                        >
                                            Delete User
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
}