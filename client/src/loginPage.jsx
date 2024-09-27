import React, { useState } from "react";
import { Box, Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const LoginPage = () =>{
    // const [user, setUser] = useState("")

    const googleAuthFunc = ()=>{
        window.location.href="http://localhost:8080/profile/auth/google"
    }

    return (
        <Box sx={{display: "flex", flexDirection: "row", alignItems:"center", justifyContent: "center"}}>
            <Button onClick={googleAuthFunc}>
                <GoogleIcon/>
            </Button>
        </Box>
    )
}

export default LoginPage;