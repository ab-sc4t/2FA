import React, { useState, useEffect } from "react";
import { Box, Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import axios from 'axios';

const LoginPage = () => {
    const [user, setUser] = useState("")
    useEffect(() => {
        const checkUser = async () => {
            try {
                const sessionResponse = await axios.get('http://localhost:8080/profile/check-session', { withCredentials: true });
                if (sessionResponse.data.loggedIn) {
                    const userResponse = await axios.get('http://localhost:8080/profile/user', { withCredentials: true });
                    setUser(userResponse.data);
                    console.log(userResponse);
                    
                    sessionStorage.setItem('userEmail', userResponse.data.email);
                    console.log(user);
                }
            } catch (error) {
                console.log("Error")
                console.error('Error checking session:', error);
            }
        };
        checkUser();
    }, []);

    const googleAuthFunc = () => {
        window.location.href = "http://localhost:8080/profile/auth/google"
    }

    const logoutFunc = async () => {
        try {
            await axios.get('http://localhost:8080/profile/logout', { withCredentials: true });
            setUser(null);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: "20rem 0 0 0" }}>
            {user ? (
                <>
                    <Button variant="contained" sx={{
                        my: 3, background: "rgb(212, 231, 249)",
                        color: "black"
                    }}>
                        Hi {user.firstname}  {user.lastname}!
                    </Button>
                    <Button onClick={logoutFunc} variant="contained" sx={{
                        my: 3, ml: 2, background: "rgb(212, 231, 249)",
                        color: "black"
                    }}>
                        Logout
                    </Button>
                </>
            ) : (
                <>
                    <Button onClick={googleAuthFunc}>
                        <GoogleIcon />
                    </Button>
                </>
            )}
        </Box>
    )
}

export default LoginPage;