'use client';
import {Box, Container, TextField, Typography, Button, IconButton, Paper, Grid, Stack} from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import {useState} from "react";
import xtRequest from "@/utils/xt-request";
import {useToast} from "@/components/ToastContext";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function PublishPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imgUrls, setImgUrls] = useState([]);
    const [targetTiebaName, setTargetTiebaName] = useState('');
    const [type, setType] = useState('');
    const showToast = useToast();
    const router = useRouter();
    // 按钮类型数组
    const buttonTypes = ['骗子', '海王', '情感纠葛','假肢', '其他'];
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
        const formData = new FormData();
        formData.append('file', file);
        xtRequest({
                url: '/818-api/files/upload',
                method: 'POST',
                file: file,
                onSuccess: (data) => {
                    const dataStr = data.data;
                    // data就是图片的url
                    setImgUrls([...imgUrls, dataStr]);
                }
            }
        );
    };
    // {
    //     {
    //         '& .MuiFilledInput-root': {
    //             backgroundColor: '#F8F8F8',
    //         },
    //         '& .MuiFilledInput-underline:before': {
    //             borderBottom: 'none',
    //         },
    //         '& .MuiFilledInput-underline:after': {
    //             borderBottom: 'none',
    //         },
    //         '& .MuiFilledInput-underline:hover:before': {
    //             borderBottom: 'none',
    //         }
    //     }
    //    }
    const inputSX = 
    {
        '& .MuiFilledInput-root': {
            backgroundColor: '#F8F8F8',
        },
        '& .MuiFilledInput-underline:before': {
            borderBottom: 'none',
        },
        '& .MuiFilledInput-underline:after': {
            borderBottom: 'none',
        },
        '& .MuiFilledInput-underline:hover:before': {
            borderBottom: 'none',
        },
        // multiline的下划线
        '& .MuiFilledInput-multiline:before': {
            borderBottom: 'none',
        },
        // 没有lable的时候，multiline的下划线
        '& .MuiFilledInput-multiline:after': {
            borderBottom: 'none',
        },
        // lable 选中的时候也是灰色
        '& .MuiInputLabel-filled': {
            color: '#9E9E9E',
        },
    };
    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{p: 2, mt: 3}}>
                <Typography variant="h5" gutterBottom>
                    发布帖子
                </Typography>
                <Box component="form"  mt={3} sx={{'& .MuiTextField-root': {my: 1}}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField label="标题" variant="filled" fullWidth value={title}
                                       onChange={(e) => setTitle(e.target.value)}
                                    //    sx={inputSX} 基础上再调字号
                                        sx = {
                                            {
                                                ...inputSX,
                                                '& .MuiFilledInput-input': {
                                                    fontSize: '1.5rem',
                                                    fontWeight: 'bold',
                                                }
                                            }
                                        }
                                       />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="内容" variant="filled" fullWidth multiline rows={6} value={content}
                                       onChange={(e) => setContent(e.target.value)}
                                       sx={{
                                             ...inputSX
                                       }}
                                       />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" gutterBottom sx={{fontWeight: 'bold'}}>
                                类型
                            </Typography>
                            <Stack direction="row" sx={{
                                flexWrap: 'wrap',
                                // 靠左
                                justifyContent: 'flex-start',
                                gap: '0.5rem'
                            }}>
                                {buttonTypes.map((btnType) => (
                                    <Button
                                        key={btnType}
                                        variant={type === btnType ? 'contained' : 'contained'}
                                        // color={type === btnType ? 'primary' : 'default'}
                                        onClick={() => setType(btnType)}
                                        sx={{
                                            minWidth: 'fit-content',
                                            color: type === btnType ? 'white' : 'black',
                                            backgroundColor: type === btnType ? '#1976D2' : '#F8F8F8',
                                            '&:hover': {
                                                backgroundColor: type === btnType ? '#1976D2' : '#1976D2',
                                                color: 'white',
                                            }
                                        }}
                                    >
                                        {btnType}
                                    </Button>
                                ))}
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="目标贴吧名称" variant="filled" fullWidth value={targetTiebaName}
                                       onChange={(e) => setTargetTiebaName(e.target.value)}
                                       sx={inputSX}
                                       />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" gutterBottom sx={{fontWeight: 'bold'}}>
                                图片 <IconButton color="primary" aria-label="upload picture" component="label">
                                <input type="file" hidden accept="image/*" onChange={handleImageUpload}/>
                                <PhotoCamera/>
                            </IconButton>
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                {imgUrls.map((url, index) => (
                                    <Box key={index} sx={{width: 100, height: 100, overflow: 'hidden'}}>
                                        <img src={
                                            "/818-api/files/download?fileName=" + url
                                        } alt={`Uploaded preview ${index}`}
                                             style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                                    </Box>
                                ))}
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" color="textSecondary" align="left" sx={{marginTop: '0.5rem'}}>
                                在您发布前，视为您已经同意
                                <Link href="/disclaimer-clause" color="primary" prefetch={true}
                                      replace={false}>
                                    《数据使用说明》
                                </Link>。
                            </Typography>
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
