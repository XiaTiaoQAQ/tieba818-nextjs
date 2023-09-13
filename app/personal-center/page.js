'use client'
import React, { useContext } from 'react';
import dayjs from 'dayjs';
import { Typography, Container, Card, CardContent, Divider, List, ListItem, ListItemText } from '@mui/material';
import { XTContext } from "@/app/layout";
import { fromVipLevelToVipName } from "@/utils/utils";

export default function PersonalCenter() {
    const context = useContext(XTContext);
    const { currentUserInfo } = context;

    return (
        <Container maxWidth="sm" style={{ marginTop: '20px' }}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        个人中心
                    </Typography>
                    <Divider style={{ marginBottom: '15px' }} />
                    {
                        currentUserInfo ? (
                            <List>
                                <ListItem>
                                    <ListItemText primary="手机号码" secondary={currentUserInfo.phone} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="注册时间" secondary={dayjs(currentUserInfo.registrationTime).format('YYYY-MM-DD HH:mm:ss')} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="注册IP" secondary={currentUserInfo.registrationIp} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="最后登录IP" secondary={currentUserInfo.lastLoginIp} />
                                </ListItem>

                                {
                                    currentUserInfo.vipVO && (
                                        <>
                                            <Divider style={{ margin: '15px 0' }} />
                                            <Typography variant="h6" gutterBottom>
                                                VIP 详情
                                            </Typography>
                                            <ListItem>
                                                <ListItemText primary="VIP状态" secondary={fromVipLevelToVipName(currentUserInfo.vipVO.vip.vipLevel)} />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primary="VIP开始日期" secondary={dayjs(currentUserInfo.vipVO.vip.vipStartTime).format('YYYY-MM-DD HH:mm:ss')} />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primary="VIP结束日期" secondary={dayjs(currentUserInfo.vipVO.vip.vipEndTime).format('YYYY-MM-DD HH:mm:ss')} />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primary="VIP查询次数" secondary={currentUserInfo.vipVO.vipQueryTimes} />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primary="今天已使用解锁次数" secondary={currentUserInfo.vipVO.todayUnlockedCount} />
                                            </ListItem>
                                        </>
                                    )
                                }
                            {/*    还没有VIP？立即激活！*/}
                            </List>
                        ) : (
                            <Typography variant="body1" style={{ marginTop: '15px' }}>
                                请先登录
                            </Typography>
                        )
                    }
                </CardContent>
            </Card>
        </Container>
    );
}
