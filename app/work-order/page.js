'use client'
import React, {useState, useEffect} from 'react';
import {
    Container, Card, CardContent, Typography, Divider, List, ListItem, ListItemText,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import xtRequest from "@/utils/xt-request";
import {useToast} from "@/components/ToastContext";

export default function WorkOrderPage() {
    const [workOrders, setWorkOrders] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newOrderContent, setNewOrderContent] = useState('');
    const showToast = useToast();
    useEffect(() => {
        // Fetch work orders when the component is mounted
        const url = '/818-api/818/workOrder/getWorkOrderList';
        xtRequest({
            url, method: 'POST',
            onSuccess: (data) => {
                const dataObj = data.data;
                if (!dataObj) {
                    showToast('获取搜索记录详情失败');
                    return;
                }
                setWorkOrders(dataObj);
            },
            onFailure: () => {
                showToast('获取搜索记录详情失败');
            }
        });
    }, []);

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
                console.log(dataObj);
                // 关闭Dialog
                setOpenDialog(false);
            },
            onFailure: () => {
                showToast('创建工单失败，请稍后重试！');
            }
        })
    };

    return (
        <Container maxWidth="sm" style={{marginTop: '20px'}}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        我的工单
                    </Typography>
                    <Divider style={{marginBottom: '15px'}}/>
                    {
                        workOrders.length ? (
                            <List>
                                {workOrders.map(order => (
                                    <ListItem key={order.id}>
                                        <ListItemText
                                            primary={`工单ID: ${order.id}`}
                                            secondary={order.content}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body1">
                                无
                            </Typography>
                        )
                    }
                    <Button variant="contained" color="primary" style={{marginTop: '15px'}}
                            onClick={() => setOpenDialog(true)}>
                        创建工单
                    </Button>
                </CardContent>
            </Card>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}
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
                        rows={8}
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