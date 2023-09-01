'use client'
import './globals.css'
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import ChecklistIcon from '@mui/icons-material/Checklist';
import SettingsIcon from '@mui/icons-material/Settings';
import SupportIcon from '@mui/icons-material/Support';
import LogoutIcon from '@mui/icons-material/Logout';
import {
    AppBar, Box,
    Toolbar
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {createContext, useEffect, useState} from "react";
import Link from "next/link";
import {ToastProvider} from "@/components/ToastContext";

const FooterBar = () => {
    return (
        <footer>
            <div style={
                {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                    flexDirection: 'column',
                    padding: '20px 0',
                    fontSize: '12px',
                }
            }>
                CopyRight © 2023 tieba818 Inc. All Rights Reserved. 所有数据均来自于公开互联网资料，如有侵权请联系。
            </div>
        </footer>
    )
}

export const XTContext = createContext();
export default function RootLayout({children}) {
    const [token, setToken] = useState(null);
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            XTContext.token = token;
            setToken(storedToken);
        }
    }, []);
    return (
        <html lang="en">
        <body className='818body'>
        <ThemeRegistry>
            <XTContext.Provider value={{token, setToken}}>
                <ToastProvider>
                    <AppBar position="fixed" sx={{zIndex: 2000}}>
                        <Toolbar
                            sx={{
                                backgroundColor: 'background.paper',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                            {/* DashboardIcon 和 Typography 居左 */}
                            {/*添加点击事件，跳转首页*/}
                            <Link href="/">
                                <Box display="flex" alignItems="center">
                                    <DashboardIcon sx={{color: '#444', mr: 2, transform: 'translateY(-2px)'}}/>
                                    <Typography variant="h6" noWrap component="div" color="black">
                                        818 Inc.
                                    </Typography>
                                </Box>
                            </Link>
                            {/* 根据token的值来决定显示内容 */}
                            <Box display="flex" alignItems="center">
                                {token ? (
                                    <Typography noWrap component="div" color="black">
                                        {token}
                                    </Typography>
                                ) : (
                                    <Link href="/login">
                                        <Button color="primary">Login</Button>
                                    </Link>
                                )}
                                <Button color="primary">Home</Button>
                                <Button color="primary">Back</Button>
                            </Box>
                        </Toolbar>
                    </AppBar>
                    <Box sx={{
                        paddingTop: '64px',
                        minHeight: 'calc(100vh - 64px)',
                    }}>
                        {children}
                    </Box>
                    <FooterBar/>
                </ToastProvider>
            </XTContext.Provider>
        </ThemeRegistry>
        </body>
        </html>
    )
}
