'use client';
import {Box, Container, TextField, Typography, Button, IconButton, Paper, Grid, Stack} from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useState } from "react";
import xtRequest from "@/utils/xt-request";
import {useToast} from "@/components/ToastContext";
import {useRouter} from "next/navigation";

export default function PublishPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imgUrls, setImgUrls] = useState([]);
    const [targetTiebaName, setTargetTiebaName] = useState('');
    const [type, setType] = useState('');
    const showToast = useToast();
    const router = useRouter();
    const handlePublish = () => {
        // 发布帖子的请求逻辑
        const postData = {
            title,
            content,
            imgUrlList: imgUrls,
            targetTiebaName,
            type,
        };
        // TODO: 发送POST请求
        xtRequest({
            url: '/818-api/818/publishPostController/publishPost',
            method: 'POST',
            body: postData,
            onSuccess: (data) => {
                // Handle the success case
                // 跳转
                showToast('发布成功');
                router.push('/posts-square');
            },
            onFailure: () => {
                // Handle the failure case
            }
        })
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgUrls([...imgUrls, reader.result]);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    发布帖子
                </Typography>
                <Box component="form" mt={3} sx={{ '& .MuiTextField-root': { my: 1 } }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField label="标题" variant="outlined" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="内容" variant="outlined" fullWidth multiline rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <IconButton color="primary" aria-label="upload picture" component="label">
                                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                    <PhotoCamera />
                                </IconButton>
                                {imgUrls.map((url, index) => (
                                    <Box key={index} sx={{ width: 100, height: 100, overflow: 'hidden' }}>
                                        <img src={url} alt={`Uploaded preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </Box>
                                ))}
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="目标贴吧名称" variant="outlined" fullWidth value={targetTiebaName} onChange={(e) => setTargetTiebaName(e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="类型" variant="outlined" fullWidth value={type} onChange={(e) => setType(e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" fullWidth onClick={handlePublish}>
                                发布
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}
