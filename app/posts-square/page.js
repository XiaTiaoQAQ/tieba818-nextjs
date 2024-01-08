'use client'
import React, { useState, useEffect } from 'react';
import {
    Container, Card, CardContent, Typography, Divider, List, ListItem, ListItemText,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Paper, ButtonBase, Chip, Pagination
} from '@mui/material';
import xtRequest from "@/utils/xt-request";
import { useToast } from "@/components/ToastContext";
import { useRouter } from "next/navigation";
import { fromTimeToReadableTime } from '@/utils/utils';
import { useLoadingDialog } from '@/components/LoadingDialogContext';


export default function PostsSquarePage() {
    const showToast = useToast();
    const router = useRouter();
    const [postList, setPostList] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState('');
    const [type, setType] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [selectedType, setSelectedType] = useState('');
    const loadingDialogContext = useLoadingDialog();

    const handleChipClick = (chipType) => {
        if (selectedType === chipType) {
            setType('');
            setSelectedType('');
        } else {
            setType(chipType);
            setSelectedType(chipType);
        }
    };

    const requestPostList = () => {
        loadingDialogContext.show(); // 显示loading
        const url = `/818-api/818/publishPostController/getPostList?page=${page - 1}&size=${size}&search=${search}&type=${type}`;
        xtRequest({
            url, method: 'POST',
            onSuccess: (data) => {
                const dataObj = data.data
                if (!dataObj) {
                    showToast('获取广场帖子失败，请检查后重试或联系管理员');
                    router.push('/');
                    return;
                }
                setPostList(dataObj.content);
                setTotalPages(dataObj.totalPages);
                loadingDialogContext.close();
            },
            onFailure: () => {
                showToast('获取广场帖子失败，请检查后重试或联系管理员');
                router.push('/');
            }
        });
    };

    useEffect(() => {
        requestPostList();
    }, [page, size, type]);

    return (
        <Container maxWidth="sm" style={{
            marginTop: '20px',
            borderRadius: '10px',
            backgroundColor: '#fff',
            paddingTop: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            paddingLeft: '0px',
            paddingRight: '0px',
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginLeft: '10px', marginRight: '10px' }}>

                    <Box>
                        <Box>
                            <TextField
                                label="搜索"
                                variant="outlined"
                                size="small"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ marginRight: '10px' }}
                            />
                            <Button variant="contained" onClick={() => requestPostList()}>搜索</Button>
                        </Box>
                        <Box sx={{
                            display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px', marginTop: '10px'
                        }}>
                            <Chip
                                label="骗子"
                                onClick={() => { 
                                    handleChipClick('骗子');
                                 }}
                                style={{
                                    backgroundColor: selectedType === '骗子' ? '#1976d2' : undefined,
                                    color: selectedType === '骗子' ? '#fff' : undefined,
                                }}
                            />

                            {/* <Chip label="海王" onClick={() => setType('海王')} /> */}
                            <Chip label="海王" onClick={() => {
                                handleChipClick('海王');
                             }}
                                style={{
                                    backgroundColor: selectedType === '海王' ? '#1976d2' : undefined,
                                    color: selectedType === '海王' ? '#fff' : undefined,
                                }}
                            />
                            <Chip label="情感纠葛" onClick={() => { 
                                handleChipClick('情感纠葛');
                             }}
                                style={{
                                    backgroundColor: selectedType === '情感纠葛' ? '#1976d2' : undefined,
                                    color: selectedType === '情感纠葛' ? '#fff' : undefined,
                                }}
                            />
                            <Chip label="假肢" onClick={() => { 
                                handleChipClick('假肢');
                             }}
                                style={{
                                    backgroundColor: selectedType === '假肢' ? '#1976d2' : undefined,
                                    color: selectedType === '假肢' ? '#fff' : undefined,
                                }}
                            />
                            <Chip label="其他" onClick={() => { 
                                handleChipClick('其他');
                             }}
                                style={{
                                    backgroundColor: selectedType === '其他' ? '#1976d2' : undefined,
                                    color: selectedType === '其他' ? '#fff' : undefined,
                                }}
                            />
                        </Box>
                    </Box>

                    <Button variant="contained" onClick={() => router.push('/posts-square/publish-post')}
                        sx={{
                            maxHeight: '48px',
                            minWidth: 'fit-content',
                        }}
                    >发布帖子</Button>
                </Box>
                <Divider style={{ marginBottom: '0px', marginTop: '10px' }} />
                {postList.length > 0 ? (
                    <List sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                        {postList.map(post => (
                            <React.Fragment key={post.id}>
                                <PostSquarePostListItem post={post} />
                                <Divider sx={{ marginTop: '15px', marginBottom: '10px' }} />
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    // 空状态
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                        <Typography variant="h6" sx={{ marginTop: '10px' }}>暂无帖子</Typography>
                    </Box>
                )}
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                    style={{ padding: '20px 0', justifyContent: 'center', display: 'flex' }}
                />
            </Box>
        </Container>
    );
}

function PostSquarePostListItem({ post }) {
    // 判断imgUrls不为空的话，就split
    const imgUrlList = post.imgUrls ? post.imgUrls.split(',') : [];
    const router = useRouter();
    return (
        <ButtonBase
            style={{ display: 'block', textAlign: 'inherit', width: '100%' }}
            onClick={() => {
                router.push('/posts-square/detail?publishPostId=' + post.uuidId);
            }}
        >
            <Typography sx={{
                fontWeight: 'bold',
                fontSize: '1.4rem',
            }}>
                {post.title}
            </Typography>
            <Typography style={{
                maxHeight: '2.6rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '1rem',
                fontWeight: 'normal',
                color: '#666',
                wordBreak: 'break-word',
            }}>
                {post.content}
            </Typography>
            <Typography variant="caption" display="block">
                帖吧名称: {post.tiebaName}
            </Typography>
            {post.type != null && (
                <Typography variant="caption" display="block">
                    类型: {post.type}
                </Typography>
            )
            }
            {/* 被挂人 贴吧用户：红名 */}
            <Typography variant="caption" display="block">
                被挂人：<Typography variant="caption" sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
                    今天你会心动吗
                </Typography>
            </Typography>
            <Typography variant="caption" display="block">
                {/* 曝光于: {new Date(post.createdAt).toLocaleString()} */}
                曝光于：{fromTimeToReadableTime(post.createdAt)}
            </Typography>
            {/*    图片 */}
            {imgUrlList.length > 0 && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    gap: '0.5rem'
                }}>
                    {imgUrlList.map((imgUrl) => (
                        <img src={"/818-api/files/download?fileName=" + imgUrl}
                            key={imgUrl}
                            style={{
                                maxWidth: '30%', aspectRatio: 1,
                                border: '1px solid #e0e0e0', borderRadius: '5px',
                                objectFit: 'cover'
                            }} />
                    ))}
                </Box>
            )}
        </ButtonBase>
    );
}
