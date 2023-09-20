'use client'
import React, {useState, useEffect} from 'react';
import {
    Container, Card, CardContent, Typography, Divider, List, ListItem, ListItemText,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box
} from '@mui/material';
import xtRequest from "@/utils/xt-request";
import {useToast} from "@/components/ToastContext";
import {useRouter} from "next/navigation";
import dayjs from "dayjs";
import Link from "next/link";

export default function WorkOrderPage() {
    const [workOrders, setWorkOrders] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [newOrderContent, setNewOrderContent] = useState(
        `详细描述您目前的问题：

详细描述您目前出现问题前的大致操作流程：

目前的问题给您带来了什么影响：

您期望的结果：

涉及功能或页面的页面名称：

您觉得对解决问题有帮助的补充信息（例如订单号、查询的用户名称等）：
`);
    const showToast = useToast();
    const router = useRouter();
    const [selectedStatus, setSelectedStatus] = useState('全部');  // 新添加的状态，表示当前选择的工单状态
    useEffect(() => {
        // Fetch work orders when the component is mounted
        const url = '/818-api/818/workOrder/getWorkOrderList';
        xtRequest({
            url, method: 'POST',
            onSuccess: (data) => {
                const dataObj = data.data;
                if (!dataObj) {
                    showToast('获取工单记录失败');
                    router.push('/');
                    return;
                }
                setWorkOrders(dataObj);
            },
            onFailure: () => {
                showToast('获取工单记录失败')
                router.push('/');
            }
        });
    }, []);
    // 提取所有的工单状态
    const getStatusSet = (orders) => {
        const statusSet = new Set();
        orders.forEach(order => statusSet.add(order.orderStatusVOStr));
        return statusSet;
    };
    const statusSet = workOrders ? getStatusSet(workOrders) : new Set();

    // 根据选择的状态过滤工单列表
    const filteredOrders = selectedStatus === '全部' ? workOrders : workOrders.filter(order => order.orderStatusVOStr === selectedStatus);

    const handleCreateOrder = () => {
        // Call API to create a new work order and then close the dialog
        const newOrder = {
            userSubmitWorkOrderContent: newOrderContent
        };

        // Assuming you have an API method to create a new work order
        const url = "/818-api/818/workOrder/createWorkOrder";
        xtRequest({
            url, method: 'POST', body: newOrder,
            onSuccess: (data) => {
                const dataObj = data.data;
                if (!dataObj) {
                    showToast('获取搜索记录详情失败');
                    return;
                }
                const workOrderId = dataObj.workOrderId;
                // 跳转工单详情页面
                console.log(dataObj);
                router.push(`/work-order/detail?workOrderId=${workOrderId}`);
                // 关闭Dialog
                setOpenDialog(false);
            },
            onFailure: () => {
                showToast('创建工单失败，请稍后重试！');
            }
        })
    };

    if (!workOrders) {
        return <div>工单记录加载中...</div>;
    }

    return (
        <Container maxWidth="sm" style={{marginTop: '20px'}}>
            <Card variant="outlined">
                <CardContent>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        {/*垂直居中*/}
                        <Typography variant="h5" gutterBottom>
                            我的工单
                        </Typography>
                        <Button variant="contained" color="primary" style={{marginBottom: '15px'}}
                                onClick={() => setOpenDialog(true)}>
                            创建工单
                        </Button>
                    </Box>
                    {/* Filter按钮部分 */}
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px'}}>
                        <Button variant={selectedStatus === '全部' ? 'contained' : 'outlined'} color="primary" onClick={() => setSelectedStatus('全部')}>全部({workOrders.length})</Button>
                        {
                            Array.from(statusSet).map(status => (
                                <Button
                                    key={status}
                                    variant={selectedStatus === status ? 'contained' : 'outlined'}
                                    color="primary"
                                    onClick={() => setSelectedStatus(status)}>
                                    {status}({workOrders.filter(order => order.orderStatusVOStr === status).length})
                                </Button>
                            ))
                        }
                    </Box>
                    <Divider style={{marginBottom: '15px'}}/>
                    {
                        filteredOrders.length ? (
                            <List>
                                {filteredOrders.map(order => (
                                    <ListItem key={order.id}>
                                        <ListItemText
                                            primary={`（${order.orderStatusVOStr}）${order.workOrder.content.length > 20 ? order.workOrder.content.substring(0, 28) + '...' : order.workOrder.content}`}
                                            secondary={
                                                <>
                                                    {/*   黄色字 自定义RGB */}
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        sx={{display: 'inline'}}
                                                        color="textSecondary"
                                                    >
                                                        工单状态：{order.orderStatusVOStr}
                                                    </Typography>
                                                    {/*    创建时间 workOrder.initiationTime 2023-09-19T16:55:10*/}
                                                    <br/>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        sx={{display: 'inline'}}
                                                        color="textSecondary"
                                                    >
                                                        创建时间：{dayjs(order.workOrder.initiationTime).format('YYYY-MM-DD HH:mm:ss')}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                        <Link href={`/work-order/detail?workOrderId=${order.workOrder.id}`}>
                                            <Button variant="contained" color="primary">
                                                查看详情
                                            </Button>
                                        </Link>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body1">
                                无
                            </Typography>
                        )
                    }
                </CardContent>
            </Card>

            <Dialog open={openDialog}
                    maxWidth={'sm'}
                    fullWidth>
                <DialogTitle>创建工单</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={newOrderContent}
                        onChange={e => setNewOrderContent(e.target.value)}
                        placeholder="请输入工单内容..."
                        multiline
                        rows={16}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        取消
                    </Button>
                    <Button onClick={handleCreateOrder} color="primary">
                        创建
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}
