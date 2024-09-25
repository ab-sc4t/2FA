import React, { useState } from "react";
import { Box, Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const LoginPage = () =>{
    // const [user, setUser] = useState("")

    // const GoogleAuthFunc = ()=>{
    // }

    return (
        <Box sx={{display: "flex", flexDirection: "row", alignItems:"center", justifyContent: "center"}}>
            <Button>
                <GoogleIcon/>
            </Button>
        </Box>
    )
}

export default LoginPage;