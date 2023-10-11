'use client'
import React, {useContext, useState} from 'react';
import dayjs from 'dayjs';
import {Typography, Container, Card, CardContent, Divider, List, ListItem, ListItemText} from '@mui/material';
import {XTContext} from "@/app/client-root-layout";
import {fromVipLevelToVipName} from "@/utils/utils";
import Button from "@mui/material/Button";
import {VIPDialog} from "@/app/page";
import InvisibleUserDialog from "@/components/TiebaInvisibleUserDialog";

export default function PersonalCenter() {
    const context = useContext(XTContext);
    const {currentUserInfo} = context;
    const [openDialog, setOpenDialog] = useState(false);
    const [openInvisibleUserDialog, setOpenInvisibleUserDialog] = useState(false);
    return (
        <Container maxWidth="sm" style={{marginTop: '20px'}}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        个人中心
                    </Typography>
                    <Divider style={{marginBottom: '15px'}}/>
                    <Typography variant="h6" gutterBottom>
                        续费、升级或激活VIP
                    </Typography>
                    {/* 升级：当您处在月卡有效期内，激活季卡、年卡，您剩余的月卡使用时间将自动升级。 */}
                    {/* 续费：当您处在月卡有效期内，激活月卡，您剩余的月卡使用时间将自动累加。 */}
                    <Typography variant="body2" gutterBottom color="textSecondary">
                        升级：当您处在月卡有效期内，激活季卡、年卡，您剩余的月卡使用时间将自动升级。
                    </Typography>
                    <Typography variant="body2" gutterBottom color="textSecondary">
                        续费：当您处在月卡有效期内，激活月卡，您剩余的月卡使用时间将自动累加。
                    </Typography>
                    <Button variant="contained" color="primary" style={{marginTop: '15px'}} onClick={() => {
                        setOpenDialog(true);
                    }
                    }>
                        续费或激活VIP
                    </Button>
                    {
                        currentUserInfo ? (
                            <List>
                                <ListItem>
                                    <ListItemText primary="手机号码" secondary={currentUserInfo.phone}/>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="注册时间"
                                                  secondary={dayjs(currentUserInfo.registrationTime).format('YYYY-MM-DD HH:mm:ss')}/>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="注册IP" secondary={currentUserInfo.registrationIp}/>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="最后登录IP" secondary={currentUserInfo.lastLoginIp}/>
                                </ListItem>

                                {
                                    currentUserInfo.vipVO && (
                                        <>
                                            <Divider style={{margin: '15px 0'}}/>
                                            <Typography variant="h6" gutterBottom>
                                                VIP 详情
                                            </Typography>
                                            <ListItem>
                                                <ListItemText primary="VIP状态"
                                                              secondary={fromVipLevelToVipName(currentUserInfo.vipVO.vip.vipLevel)}/>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primary="VIP开始日期"
                                                              secondary={dayjs(currentUserInfo.vipVO.vip.vipStartTime).format('YYYY-MM-DD HH:mm:ss')}/>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primary="VIP结束日期"
                                                              secondary={dayjs(currentUserInfo.vipVO.vip.vipEndTime).format('YYYY-MM-DD HH:mm:ss')}/>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primary="VIP查询次数/日"
                                                              secondary={currentUserInfo.vipVO.vipQueryTimes}/>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primary="今天已使用解锁次数"
                                                              secondary={currentUserInfo.vipVO.todayUnlockedCount}/>
                                            </ListItem>
                                            <Divider style={{margin: '15px 0'}}/>
                                            <Typography variant="h6" gutterBottom>
                                                设置仅14天可见贴吧用户
                                                <Typography variant="body2" gutterBottom color="textSecondary">
                                                    暂时仅限年卡用户使用，设置后，您指定的贴吧用户发帖快照将14天内可见。
                                                </Typography>
                                                {/*    设置按钮*/}
                                                {/*如果不是年卡用户，则设为禁用按钮*/}
                                                <Button variant="contained" color="primary" style={{marginTop: '15px'}}
                                                        disabled={currentUserInfo.vipVO.vip.vipLevel !== 3}
                                                        onClick={() => {
                                                            setOpenInvisibleUserDialog(true);
                                                        }}>
                                                    设置
                                                </Button>
                                            </Typography>
                                        </>
                                    )
                                }
                            </List>
                        ) : (
                            <Typography variant="body1" style={{marginTop: '15px'}}>
                                请先登录
                            </Typography>
                        )
                    }
                </CardContent>
            </Card>
            <VIPDialog openDialog={openDialog} handleCloseDialog={() => setOpenDialog(false)} onPayVip={() => {
            }}/>
            {/*    export default function InvisibleUserDialog(props) {*/}
            <InvisibleUserDialog openDialog={openInvisibleUserDialog}
                                 handleCloseDialog={() => setOpenInvisibleUserDialog(false)}/>
        </Container>
    );
}
