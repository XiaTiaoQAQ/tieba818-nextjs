'use client'
import React, {useState, useEffect} from 'react';
import {
    Container, Card, CardContent, Typography, Divider, List, ListItem, ListItemText,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Paper, ButtonBase, Chip
} from '@mui/material';
import xtRequest from "@/utils/xt-request";
import {useToast} from "@/components/ToastContext";
import {useRouter} from "next/navigation";

export default function PostsSquarePage() {
    useEffect(() => {
        // Fetch work orders when the component is mounted
        requestPostList();
    }, []);
    const showToast = useToast();
    const router = useRouter();
    const [postList, setPostList] = useState([]);
    const requestPostList = () => {
        const url = '/818-api/818/publishPostController/getPostList?page=' + 0 + '&size=' + 10;
        xtRequest({
            url, method: 'POST',
            onSuccess: (data) => {
                const dataObj = data.data;
                if (!dataObj) {
                    showToast('获取广场帖子失败，请检查后重试或联系管理员');
                    router.push('/');
                    return;
                }
                setPostList(dataObj);
            },
            onFailure: () => {
                showToast('获取广场帖子失败，请检查后重试或联系管理员');
                router.push('/');
            }
        });
    }
    return (
        <Container maxWidth="sm" style={{marginTop: '20px'}}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                {/*垂直居中*/}
                <Box sx={{
                    display: 'flex',
                    // space-between
                    justifyContent: 'space-between',
                }}>
                    <Typography variant="h5" gutterBottom>
                        TiebaIn 挂人
                    </Typography>
                    <Button variant="contained" onClick={() => {
                        router.push('/posts-square/publish-post');
                    }
                    }>
                        发布帖子
                    </Button>
                </Box>
                {postList.length > 0 ? (
                    <List>
                        {postList.map(post => (
                            // <ListItem key={post.id} button onClick={() => { /* Handle click event, perhaps navigate to post details */
                            // }}>
                            <PostListItem key={post.id} post={post}/>
                            // </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body1" gutterBottom>
                        暂无帖子
                    </Typography>
                )
                }
            </Box>
        </Container>
    )
}

function PostListItem({post}) {
    // 判断imgUrls不为空的话，就split
    const imgUrlList = post.imgUrls ? post.imgUrls.split(',') : [];
    return (
        <Paper elevation={2} style={{margin: '10px', padding: '10px'}}>
            <ButtonBase
                style={{display: 'block', textAlign: 'inherit', width: '100%'}}
                onClick={() => {
                }}
            >
                <Typography variant="h6" gutterBottom>
                    <Chip label={post.status} variant="filled" size="small"
                          sx={{
                              //审核中、已发布、已拒绝
                              backgroundColor: post.status === '审核中' ? '#ecbb10'
                                  : post.status === '已发布' ? '#2ecc71'
                                      : post.status === '已拒绝' ? '#e74c3c'
                                          : '#1976D2',
                              color: '#fff',
                              fontWeight: 'bold',
                              marginRight: '10px',
                              paddingLeft: '2px',
                              paddingTop: '3px',
                          }}
                    />{post.title}
                </Typography>
                <Divider/>
                <Typography variant="body1" gutterBottom noWrap style={{maxHeight: '3.6rem', overflow: 'hidden'}}>
                    {post.content}
                </Typography>
                <Typography variant="overline" display="block" gutterBottom>
                    帖吧名称: {post.tiebaName}
                </Typography>
                {post.type != null && (
                    <Typography variant="caption" display="block" gutterBottom>
                        类型: {post.type}
                    </Typography>
                )
                }
                <Typography variant="caption" display="block" gutterBottom>
                    曝光于: {new Date(post.createdAt).toLocaleString()}
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
                                 style={{
                                     maxWidth: '160px', aspectRatio: 1,
                                     border: '1px solid #e0e0e0', borderRadius: '5px',
                                     objectFit: 'cover'
                                 }}/>
                        ))}
                    </Box>
                )}
            </ButtonBase>

        </Paper>
    );
}
