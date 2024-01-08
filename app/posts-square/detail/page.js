'use client'
import {
    Box,
    Card,
    CardContent, Container,
    Divider, ImageList, ImageListItem,
    List,
    TextField,
    Typography,
    Dialog 
} from "@mui/material";
import React, { useEffect, useState } from "react";
import xtRequest from "@/utils/xt-request";
import { useToast } from "@/components/ToastContext";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import { useLoadingDialog } from "@/components/LoadingDialogContext";
import { fromTimeToReadableTime } from "@/utils/utils";
import { AccessTimeFilled, Bookmark, BookmarkBorder, Description, Groups2, More, Person2 } from "@mui/icons-material";

export default function PublishDetailPage({ searchParams: { publishPostId } }) {
    const [publishPostDetail, setPublishPostDetail] = useState({});
    const showToast = useToast();
    const router = useRouter();
    const loadingDialogContext = useLoadingDialog();
    const [open, setOpen] = useState(false);
    const [currentImg, setCurrentImg] = useState('');
    
    useEffect(() => {
        requestPublishDetail();
    }, []);
    const requestPublishDetail = () => {
        const url = '/818-api/818/publishPostController/getPostDetail?uuidId=' + publishPostId;
        xtRequest({
            url, method: 'POST',
            onSuccess: (data) => {
                const dataObj = data.data;
                if (!dataObj) {
                    showToast('获取帖子详情失败，请检查后重试或联系管理员');
                    router.push('/');
                    return;
                }
                setPublishPostDetail(dataObj);
            },
            onFailure: () => {
                showToast('获取帖子详情失败，请检查后重试或联系管理员');
                router.push('/');
            }
        });
    }
    const handleOpen = (imgUrl) => {
        setCurrentImg(imgUrl);
        setOpen(true);
      };
      
    if (!publishPostDetail.uuidId) {
        return <div>帖子详情加载中...</div>;
    }


    const renderImages = (imgUrls) => {
        if (!imgUrls || imgUrls.length === 0) {
            return <></>
        }
        const imgUrlsArr = imgUrls.split(',');
        return (
            <>
                <Divider sx={{ marginTop: '10px', marginBottom: '10px' }} />
                <ImageList cols={3}>
                    {imgUrlsArr.map((imgUrl) => (
                        <ImageListItem key={imgUrl} onClick={() => handleOpen(imgUrl)}>
                            <img
                                src={"/818-api/files/download?fileName=" + imgUrl}
                                alt={`Post Image`}
                                loading="lazy"
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
                <Dialog open={open} onClose={() => setOpen(false)}>
  <img src={"/818-api/files/download?fileName=" + currentImg} alt="Enlarged post" />
</Dialog>

            </>

        );
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '20px' }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" sx={
                        {
                            fontWeight: 'bold',
                        }
                    }>{publishPostDetail.title}</Typography>
                    <Box sx={{
                        backgroundColor: '#F8F8F8',
                        borderRadius: '5px',
                        paddingLeft: '10px',
                        paddingRight: '10px',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        marginTop: '10px',
                    }
                    }>
                        {/* 图标+文字 */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                        }}>
                            <AccessTimeFilled sx={{
                                marginRight: '5px',
                            }}
                                color="disabled"
                                fontSize="small"
                            />
                            <Typography color="textSecondary"
                                variant="body2">发布于：{fromTimeToReadableTime(publishPostDetail.createdAt)}</Typography>
                        </Box>
                        {/* <Typography color="textSecondary" */}
                        {/* variant="body2">相关贴吧：{publishPostDetail.tiebaName}</Typography> */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            marginTop: '5px',
                        }}>
                            <Groups2 sx={{
                                marginRight: '5px',
                            }}
                                color="disabled"
                                fontSize="small"
                            />
                            <Typography color="textSecondary"
                                variant="body2">相关贴吧：{publishPostDetail.tiebaName}</Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            marginTop: '5px',
                        }}>
                            <Person2 sx={{
                                marginRight: '5px',
                            }}
                                color="disabled"
                                fontSize="small"
                            />
                            <Typography color="textSecondary"
                                variant="body2">被挂者贴吧昵称：君の小七</Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            marginTop: '5px',
                        }}>
                            <Bookmark sx={{
                                marginRight: '5px',
                            }}
                                color="disabled"
                                fontSize="small"
                            />
                            <Typography color="textSecondary"
                                variant="body2">类型：{publishPostDetail.type}</Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            marginTop: '5px',
                        }}>
                            <Description sx={{
                                marginRight: '5px',
                            }}
                                color="disabled"
                                fontSize="small"
                            />
                            <Typography color="textSecondary"
                                variant="body2">状态：{publishPostDetail.status}</Typography>
                        </Box>

                    </Box>
                    <Box sx={{
                        marginTop: '10px',
                    }}>
                        <Typography variant="body1">{publishPostDetail.content}</Typography>
                    </Box>
                    {renderImages(publishPostDetail.imgUrls)}
                </CardContent>
            </Card>
        </Container>
    );
}
