import React, {useState, useEffect} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    TextField,
    Button,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import xtRequest from "@/utils/xt-request";
import {useToast} from "@/components/ToastContext";

export default function InvisibleUserDialog({
    openDialog,handleCloseDialog
                                            }) {
    const [users, setUsers] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const showToast = useToast();
    useEffect(() => {
        // 获取隐身贴吧用户列表
        xtRequest({
            url: '/818-api/818/vip/getSearchInvisibleUserList',
            method: 'POST',
            onSuccess: (data) => {
                const dataObj = data.data;
                setUsers(dataObj);
            },
            onFailure: () => {
                showToast('获取隐身贴吧用户列表失败，请检查网络或刷新重试');
            }
        });
    }, []);

    const handleAdd = () => {
        xtRequest({
            url: '/818-api/818/vip/addSearchInvisibleUser?targetTiebaId=' + inputValue,
            method: 'POST',
            onSuccess: (data) => {
                const dataObj = data.data;
                setUsers(prevUsers => [...prevUsers, dataObj]);
                setInputValue('');
            },
            onFailure: () => {
                showToast('添加隐身贴吧用户失败，请检查后刷新重试');
            }
        });
    };

    const handleDelete = (id) => {
        xtRequest({
            url: '/818-api/818/vip/deleteSearchInvisibleUser?id=' + id,
            method: 'POST',
            data: {targetTiebaId: id},
            onSuccess: () => {
                setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
            },
            onFailure: () => {
                showToast('删除隐身贴吧用户失败，请检查后刷新重试');
            }
        });
    };

    return (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth={'sm'} fullWidth>
            <DialogTitle>设置指定用户快照仅14天可见</DialogTitle>
            {/*备注解释ID*/}
            <DialogContent>
                <Typography variant="body2" gutterBottom color="textSecondary">
                    此处所展示以及输入的贴吧用户ID，为精搜用户后的数字ID格式，并非tb.格式。
                </Typography>
                <Typography variant="body2" gutterBottom color="textSecondary">
                    可以复制贴吧主页链接精搜用户后在系统内显示搜索词中查看。
                </Typography>
                <List>
                    {users.length === 0 ? (
                        <Typography align="center">没有数据</Typography>
                    ) : (
                        users.map(user => (
                            <ListItem key={user.targetTiebaId}>
                                <ListItemText
                                    primary={`贴吧用户ID: ${user.targetTiebaId}`}
                                    secondary={new Date(user.invisibleEndTime) > new Date() ? "生效中" : "已过期"}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" onClick={() => handleDelete(user.id)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))
                    )}
                </List>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16}}>
                    <TextField
                        value={inputValue}
                        onChange={e => {
                            // 只允许输入数字
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                setInputValue(value);
                            }
                        }}
                        label="请输入贴吧用户ID，为精搜用户后的数字ID格式，并非tb.格式"
                        variant="outlined"
                        style={{flex: 1}}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={inputValue === '' || users.length >= 1}
                        onClick={handleAdd}
                        style={{marginLeft: 16}}
                    >
                        添加
                    </Button>
                </div>
                <Typography align="right" style={{marginTop: 16}}>
                    {users.length}/1
                </Typography>
            </DialogContent>
        </Dialog>
    );
}
