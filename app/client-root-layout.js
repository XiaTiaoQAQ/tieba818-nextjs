'use client'
import './globals.css'
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import DashboardIcon from '@mui/icons-material/Dashboard';
import {
    AppBar, Box, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText,
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
import {
    AccountCircle,
    ArrowDropDownTwoTone, MenuOpenOutlined, MenuOutlined, Podcasts, QueryStats
} from '@mui/icons-material';
import {fromVipLevelToVipName} from "@/utils/utils";
import {LoadingDialogProvider} from "@/components/LoadingDialogContext";

const FooterBar = () => {
    return (
        <footer>
            <Link href="/contact-us" style={{
                textDecoration: 'none',
                color: '#444',
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
            }}
                  prefetch={true}
                  replace={false}
            >
                CopyRight © 2023 TiebaIN Inc. All Rights Reserved. 所有数据均来自于公开互联网资料，如有侵权请联系。
            </Link>
            {/*<Link href={'/contact-us'} style={{*/}
            {/*    textDecoration: 'none',*/}
            {/*    color: '#444',*/}
            {/*    display: 'flex',*/}
            {/*    justifyContent: 'center',*/}
            {/*    alignItems: 'center',*/}
            {/*    height: '100%',*/}
            {/*    width: '100%',*/}
            {/*    flexDirection: 'column',*/}
            {/*    padding: '20px 10px',*/}
            {/*    fontSize: '12px',*/}
            {/*    //     文字居中*/}
            {/*    textAlign: 'center',*/}
            {/*}*/}
            {/*}*/}
            {/*      prefetch={true}*/}
            {/*      replace={false}*/}
            {/*>（TiebaIn Inc Version 1.0.1）</Link>*/}

        </footer>
    )
}


export const XTContext = createContext();

export default function RootLayoutInClient({children, serverData}) {
    const [token, setToken] = useState(null);
    const [currentUserInfo, setCurrentUserInfo] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [serverDataState, setServerDataState] = useState(serverData);
    const [drawerAnchor, setDrawerAnchor] = useState(null);
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (
            event.key === 'Tab' ||
            event.key === 'Shift'
        )) {
            return;
        }
        setDrawerAnchor(open);
    }
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
        console.log("|-------------------------------------------------------------------|");
        console.log("|                            Tieba.in                               |");
        console.log("|-------------------------------------------------------------------|");
        console.log("| Hoping Tieba.in's Black Hole Toolkit can be the Swiss Army Knife, |");
        console.log("| piercing through the hypocrisy in human nature.                   |");
        console.log("|-------------------------------------------------------------------|");
        console.log("%c\"希望Tieba.in黑洞工具箱可以成为瑞士军刀，刺穿人性中的虚伪。\"", "color: #000000; font-weight: bold");
    }, []);
    if (token && !currentUserInfo) {
        // 获取用户信息
        getUserInfo().then(() => {
                // console.log('获取用户信息成功');
            }
        );
    }
    const navItems = [
        {
            key: 'TiebaIn 挂人',
            icon: Podcasts,
            primary: 'TiebaIn 挂人',
            secondary: '挂、扒、吃瓜',
            href: '/posts-square'
        },
        {
            key: 'TiebaIn 数据统计',
            icon: QueryStats,
            primary: 'TiebaIn 数据统计',
            secondary: '趋势、排行 每日更新',
            href: '/search-history'
        }
    ]
    return (
        <ThemeRegistry>
            <XTContext.Provider value={{
                token,
                setToken,
                currentUserInfo,
                setCurrentUserInfo,
                getUserInfo,
                serverDataState,
                setServerDataState
            }}>
                <LoadingDialogProvider>
                    <ToastProvider>
                        <AppBar position="fixed" sx={{
                            zIndex: 1000,
                        }}>
                            <Toolbar
                                sx={{
                                    backgroundColor: 'background.paper',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                {/* DashboardIcon 和 Typography 居左 */}
                                {/*添加点击事件，跳转首页*/}
                                <Link href="/"
                                      prefetch={true}
                                      replace={false}>
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
                                    {/*如果是电脑端 遍历navItems */}
                                    <Box
                                        sx={{
                                            display: {
                                                xs: 'none',
                                                sm: 'block',
                                                md: 'block',
                                                lg: 'block',
                                                xl: 'block',
                                            }
                                        }}
                                    >
                                        {navItems.map(item => (
                                            <Link href={
                                                item.href
                                            } prefetch={true} replace={false} key={item.key}>
                                                <Button color="primary" sx={{textTransform: 'none'}}>
                                                    {item.primary}
                                                </Button>
                                            </Link>
                                        ))}
                                    </Box>
                                    {token ? (
                                        <>
                                            {/*替换为 Account Circle 灰色 */}
                                            <Box
                                                onClick={handleClick}
                                                display="flex"
                                                alignItems="center"
                                            >
                                                <AccountCircle
                                                    color={
                                                        'action'
                                                    }
                                                    sx={{
                                                        cursor: 'pointer',
                                                        fontSize: '2rem',
                                                    }}
                                                />
                                                <Typography noWrap component="div" color="black" onClick={handleClick}
                                                            sx={{
                                                                padding: '5px 4px',
                                                            }}
                                                >
                                                    {currentUserInfo ? currentUserInfo.phone : ''}
                                                </Typography>
                                            </Box>

                                            {/*<ArrowDropDownTwoTone onClick={handleClick} color="secondary"*/}
                                            {/*                      sx={{cursor: 'pointer'}}/>*/}
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                onClose={handleClose}
                                                sx={{
                                                    zIndex: 2001
                                                }}
                                            >
                                                <Typography noWrap component="div" color="black" onClick={handleClick}
                                                            sx={{
                                                                padding: '10px 10px',
                                                            }}
                                                >
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
                                                <Divider/>
                                                <Link href="/personal-center" prefetch={true}
                                                      replace={false}>
                                                    <MenuItem onClick={handleClose}>个人中心</MenuItem>
                                                </Link>
                                                <Link href="/search-history" prefetch={true}
                                                      replace={false}>
                                                    <MenuItem onClick={handleClose}>查询历史</MenuItem>
                                                </Link>
                                                {/* 工单系统 */}
                                                <Link href="/work-order" prefetch={true}
                                                      replace={false}>
                                                    <MenuItem onClick={handleClose}>我的工单</MenuItem>
                                                </Link>
                                                <MenuItem onClick={
                                                    () => {
                                                        localStorage.removeItem('token');
                                                        setToken(null);
                                                        setCurrentUserInfo(null);
                                                        window.location.reload();
                                                    }
                                                }>登出</MenuItem>
                                                <Divider/>
                                                <Typography noWrap component="div"
                                                            sx={{
                                                                padding: '2px 10px',
                                                            }}
                                                            variant="body2"
                                                            color="textSecondary"
                                                >
                                                    TiebaIn Inc. Version 1.0.1
                                                </Typography>
                                            </Menu>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/loginOrRegister?mode=login" prefetch={true}
                                                  replace={false}>
                                                <Button color="primary">登录</Button>
                                            </Link>
                                            <Link href="/loginOrRegister?mode=register" prefetch={true}
                                                  replace={false}>
                                                <Button color="primary">注册</Button>
                                            </Link>
                                        </>
                                    )}
                                    {/*    更多按钮 只在手机显示 */}
                                    <MenuOutlined
                                        sx={{
                                            cursor: 'pointer',
                                            fontSize: '2rem',
                                            display: {
                                                xs: 'block',
                                                sm: 'none',
                                                md: 'none',
                                                lg: 'none',
                                                xl: 'none',
                                            }
                                        }
                                        }
                                        color={'action'}
                                        onClick={toggleDrawer(true)}
                                    />
                                    {/*    Drawer */}
                                    <Drawer
                                        anchor={'right'}
                                        open={drawerAnchor}
                                        onClose={toggleDrawer(false)}
                                        sx={{
                                            zIndex: 2000
                                        }}
                                    >
                                        <Box
                                            sx={{width: 250}}
                                            role="presentation"
                                            onClick={toggleDrawer(false)}
                                            onKeyDown={toggleDrawer(false)}
                                        >
                                            <List>
                                                {navItems.map(item => (
                                                    <Link href={
                                                        item.href
                                                    } prefetch={true} replace={false} key={item.key}>
                                                        <ListItem button key={item.key}>
                                                            <ListItemIcon>
                                                                <item.icon/>
                                                            </ListItemIcon>
                                                            <ListItemText primary={item.primary}
                                                                          secondary={item.secondary}/>
                                                        </ListItem>
                                                    </Link>
                                                ))}
                                            </List>
                                        </Box>
                                    </Drawer>
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
                </LoadingDialogProvider>
            </XTContext.Provider>
        </ThemeRegistry>
    )
}
