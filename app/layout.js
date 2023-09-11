'use client'
import './globals.css'
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import DashboardIcon from '@mui/icons-material/Dashboard';
import {
    AppBar, Box,
    Menu,
    MenuItem,
    Toolbar
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {createContext, useEffect, useState} from "react";
import Link from "next/link";
import {ToastProvider, useToast} from "@/components/ToastContext";
import xtRequest from '@/utils/xt-request';
import {ArrowDropDownCircleOutlined, ArrowDropDownTwoTone} from '@mui/icons-material';
import {fromVipLevelToVipName} from "@/utils/utils";

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
                    padding: '20px 10px',
                    fontSize: '12px',
                    //     文字居中
                    textAlign: 'center',
                }
            }>
                CopyRight © 2023 tiebaIN Inc. All Rights Reserved. 所有数据均来自于公开互联网资料，如有侵权请联系。
            </div>
        </footer>
    )
}


export const XTContext = createContext();
export default function RootLayout({children}) {
    const [token, setToken] = useState(null);
    const [currentUserInfo, setCurrentUserInfo] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const getUserInfo = async () => {
        await xtRequest({
            url: '/818-api/818/user/getUserInfo',
            method: 'POST',
            onSuccess: (data) => {
                const dataObj = data.data;
                setCurrentUserInfo(dataObj);
            },
            onFailure: () => {
                const failureMessage = "获取用户信息失败"
            }
        })
    }
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            XTContext.token = token;
            setToken(storedToken);
        }
    }, []);
    if (token && !currentUserInfo) {
        // 获取用户信息
        getUserInfo().then(() => {
                console.log('获取用户信息成功');
            }
        );
    }
    return (
        <html lang="en">
        <body className='818body'>
        <ThemeRegistry>
            <XTContext.Provider value={{token, setToken, currentUserInfo, setCurrentUserInfo, getUserInfo}}>
                <ToastProvider>
                    <AppBar position="fixed" sx={{
                        zIndex: 2000,
                    }}>
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
                                        TiebaIn Inc.
                                    </Typography>
                                    {/*    请记住访问地址 tieba.in*/}
                                </Box>
                                <Typography variant="h6" noWrap component="div" color="black"
                                            sx={{ml: 1, fontSize: '12px'}}>
                                    请记住访问地址 tieba.in
                                </Typography>
                            </Link>
                            {/* 根据token的值来决定显示内容 */}
                            <Box display="flex" alignItems="center">
                                {token ? (
                                    <>
                                        <Typography noWrap component="div" color="black" onClick={handleClick}>
                                            {currentUserInfo && currentUserInfo.vipVO != null ? (
                                                <>
                                                    <span style={{color: '#d1c62c', fontWeight: 'bold'}}>
                                                            （{fromVipLevelToVipName(currentUserInfo.vipVO.vip.vipLevel)}）
                                                        </span>
                                                    {currentUserInfo ? currentUserInfo.phone : ''}
                                                </>
                                            ) : (
                                                <>
                                                    {currentUserInfo ? currentUserInfo.phone : ''}
                                                </>
                                            )}
                                        </Typography>
                                        <ArrowDropDownTwoTone onClick={handleClick} color="secondary"
                                                              sx={{cursor: 'pointer'}}/>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                            sx={{
                                                zIndex: 2001
                                            }}
                                        >
                                            <Link href="/personal-center">
                                                <MenuItem onClick={handleClose}>个人中心</MenuItem>
                                            </Link>
                                            <Link href="/search-history">
                                                <MenuItem onClick={handleClose}>查询历史</MenuItem>
                                            </Link>
                                            <MenuItem onClick={
                                                () => {
                                                    localStorage.removeItem('token');
                                                    setToken(null);
                                                    setCurrentUserInfo(null);
                                                    window.location.reload();
                                                }
                                            }>登出</MenuItem>
                                        </Menu>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/loginOrRegister?mode=login">
                                            <Button color="primary">登录</Button>
                                        </Link>
                                        <Link href="/loginOrRegister?mode=register">
                                            <Button color="primary">注册</Button>
                                        </Link>
                                    </>
                                )}
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
