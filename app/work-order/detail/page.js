'use client'
import {
    Box,
    Card,
    CardContent, Container,
    Divider,
    List,
    TextField,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import xtRequest from "@/utils/xt-request";
import {useToast} from "@/components/ToastContext";
import dayjs from "dayjs";
import {useRouter} from "next/navigation";
import Button from "@mui/material/Button";
import {useLoadingDialog} from "@/components/LoadingDialogContext";

export default function WorkOrderDetailPage({searchParams: {workOrderId}}) {
    const [workOrderDetail, setWorkOrderDetail] = useState([]);
    const showToast = useToast();
    const router = useRouter();
    const loadingDialogContext = useLoadingDialog();
    useEffect(() => {
        // Fetch work orders when the component is mounted
        requestWorkOrderDetail();
    }, []);
    const requestWorkOrderDetail = () => {
        const url = '/818-api/818/workOrder/getWorkOrderDetail?workOrderId=' + workOrderId;
        xtRequest({
            url, method: 'POST',
            onSuccess: (data) => {
                const dataObj = data.data;
                if (!dataObj) {
                    showToast('获取工单详情失败，请检查后重试或联系管理员');
                    router.push('/');
                    return;
                }
                setWorkOrderDetail(dataObj);
            },
            onFailure: () => {
                showToast('获取工单详情失败，请检查后重试或联系管理员');
                router.push('/');
            }
        });
    }
    const [replyContent, setReplyContent] = useState('');
    const handleChangeReplyContent = (event) => {
        setReplyContent(event.target.value);
    }
    if (!workOrderDetail.workOrder) {
        return <div>工单详情加载中...</div>;
    }
    const sendReply = () => {
        const url = '/818-api/818/workOrder/replyToWorkOrder';
        const body = {
            workOrderId: workOrderId,
            replyContent: replyContent
        };
        loadingDialogContext.show("提交中...");
        xtRequest({
            url, method: 'POST', body,
            onSuccess: (data) => {
                const dataObj = data.data;
                if (!dataObj) {
                    showToast('回复工单失败，请检查后重试或联系管理员');
                    loadingDialogContext.close();
                    return;
                }
                showToast('回复工单成功');
                setReplyContent('');
                // 刷新页面
                requestWorkOrderDetail();
                loadingDialogContext.close();
            },
            onFailure: () => {
                showToast('回复工单失败，请检查后重试或联系管理员');
                loadingDialogContext.close();
            }
        });
    }
    return (
        <Container maxWidth="sm" style={{marginTop: '20px'}}>
            <Card variant="outlined">
                <CardContent>
                    {/*垂直居中*/}
                    <Typography variant="h5" gutterBottom>
                        工单详情
                    </Typography>
                    <Divider style={{marginBottom: '15px'}}/>
                    <Typography variant="body1" gutterBottom>
                        工单状态：{workOrderDetail.workOrder.orderStatusVOStr}
                    </Typography>
                    {/*<Typography variant="body1" gutterBottom>*/}
                    {/*    工单内容：{workOrderDetail.workOrder.workOrder.content}*/}
                    {/*</Typography>*/}
                    <Typography variant="body1" gutterBottom>
                        工单内容：
                    </Typography>
                    <Typography variant="body2" gutterBottom sx={{whiteSpace: 'pre-line'}} color="textSecondary">
                        {workOrderDetail.workOrder.workOrder.content}
                    </Typography>
                    <Divider style={{marginBottom: '15px'}}/>
                    <Typography variant="body2" gutterBottom>
                        工单发起时间：{dayjs(workOrderDetail.workOrder.workOrder.initiationTime).format('YYYY-MM-DD HH:mm:ss')}
                    </Typography>
                    {workOrderDetail.workOrder.workOrder.firstResponseTime && (
                        <Typography variant="body2" gutterBottom color="textSecondary">
                            工单首次响应时间：{dayjs(workOrderDetail.workOrder.workOrder.firstResponseTime).format('YYYY-MM-DD HH:mm:ss')}
                        </Typography>
                    )}
                    {workOrderDetail.workOrder.workOrder.closingTime && (
                        <Typography variant="body2" gutterBottom color="textSecondary">
                            工单关闭时间：{dayjs(workOrderDetail.workOrder.workOrder.closingTime).format('YYYY-MM-DD HH:mm:ss')}
                        </Typography>
                    )}
                </CardContent>
            </Card>
            <Card variant="outlined" style={{marginTop: '20px'}}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        工单沟通记录
                    </Typography>
                    <Divider style={{marginBottom: '15px'}}/>
                    <List>
                        {workOrderDetail.workOrderReplyList.map(reply => (
                            // {
                            //   "replyId": 1,
                            //   "workOrderId": 2,
                            //   "replierId": 8,
                            //   "replierName": "User",
                            //   "replyContent": "3",
                            //   "replyTime": "2023-09-20T14:12:38"
                            // }
                            <Box key={reply.replyId}>
                                <Typography variant="body2" gutterBottom color="textSecondary">
                                    {reply.replierName === 'User' ? '您' : '系统'} {dayjs(reply.replyTime).format('YYYY-MM-DD HH:mm:ss')}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    {reply.replyContent}
                                </Typography>
                                <Divider style={{marginBottom: '15px'}}/>
                            </Box>
                        ))}
                        {workOrderDetail.workOrderReplyList.length === 0 && (
                            <Typography variant="body2" gutterBottom color="textSecondary">
                                暂无沟通记录
                            </Typography>
                        )}
                    </List>
                </CardContent>
            </Card>
            {/*    工单输入框，发送按钮*/}
            {/*回复工单时措辞激烈将导致您的IP、账户被封禁*/}
            {/*如果不是Finished才显示*/}
            {workOrderDetail.workOrder.workOrder.orderStatus !== "Finished" && (
            <Card variant="outlined" style={{marginTop: '20px'}}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        工单回复
                    </Typography>
                    <Divider style={{marginBottom: '15px'}}/>
                    <Typography variant="body2" gutterBottom color="textSecondary">
                        工单回复后不可撤回，请谨慎操作；
                    </Typography>
                    <Typography variant="body2" gutterBottom color="textSecondary">
                        工单沟通时请详细描述问题、保持尊重，问题描述不清晰可能导致处理时间延长；
                    </Typography>
                    <Typography variant="body2" gutterBottom color="textSecondary">
                        措辞激烈将导致工单不予处理或导致您的IP、账户被封禁；
                    </Typography>
                    <Typography variant="body2" gutterBottom color="textSecondary">
                        遵守规则，避免重复提交工单、虚假报告或其他违反规定的行为可能导致您的IP和账户受到限制或封禁。
                    </Typography>
                    <Box sx={{display: 'flex', alignItems: 'flex-end'}}>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="回复内容"
                            multiline
                            maxRows={4}
                            fullWidth
                            value={replyContent}
                            onChange={handleChangeReplyContent}
                        />
                        <Button sx={{ml: 1}} variant="contained" onClick={sendReply}>
                            发送
                        </Button>
                    </Box>
                </CardContent>
            </Card>
            )}
        </Container>
    );
}
