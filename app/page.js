'use client';
import Image from 'next/image';
import styles from './page.module.css';
import { Container, Grid, TextField, RadioGroup, FormControlLabel, Radio, Dialog, DialogContent, Typography, LinearProgress, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, ButtonGroup, Card } from "@mui/material";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Search } from "@mui/icons-material";
import { useToast } from '@/components/ToastContext';
import xtRequest from '@/utils/xt-request';
import dayjs from 'dayjs';

export default function Home() {
    const [searchType, setSearchType] = useState('accurate_user');
    const [searchValue, setSearchValue] = useState('');
    const showToast = useToast();
    const [currentSearchTypeString, setCurrentSearchTypeString] = useState('');
    const [currentSearchWord, setCurrentSearchWord] = useState('');

    // 根据搜索类型设置placeholder
    const searchPlaceholder = searchType === 'accurate_user' ?
        '输入用户的用户名/id 精确查询他的发帖' :
        '模糊搜索用户名、帖子标题、内容（适用于找不到用户名、仅有帖子标题或内容的情况）';

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [searchResults, setSearchResults] = useState(null);

    // 处理搜索类型变化
    const handleSearchTypeChange = (event) => {
        setSearchType(event.target.value);
    };

    // 处理搜索输入变化
    const handleSearchInputChange = (event) => {
        setSearchValue(event.target.value);
    };

    // 如果正在加载，增加进度
    useEffect(() => {
        let progressTimer;
        if (loading && progress < 99) {
            progressTimer = setInterval(() => {
                setProgress((prevProgress) => Math.min(prevProgress + Math.random() * 10, 99));
            }, 1000);
        }
        return () => {
            clearInterval(progressTimer);
        };
    }, [loading, progress]);

    // 搜索功能
    const onClickSearch = async () => {
        // 调用搜索方法
        search(searchType, searchValue);
    };

    // 提取搜索方法
    const search = async (searchType, searchValue) => {
        if (!searchValue) {
            showToast('搜索内容不能为空');
            return;
        }
        setCurrentSearchTypeString(searchType === 'accurate_user' ? '精确搜索用户发帖' : '模糊搜索用户、帖子标题、内容');
        setCurrentSearchWord(searchValue);
        setLoading(true);
        setProgress(0);

        // 构建URL
        const baseURL = `/818-api/818/query/queryRecord?queryType=${searchType}&queryWord=${searchValue}`;
        const url = searchType === 'accurate_user' ? `${baseURL}&userId=${searchValue}` : baseURL;

        try {
            const data = await xtRequest({ url, method: 'GET' });
            showToast('搜索成功');
            console.log(data.data);
            setSearchResults(data.data);  // 新增此行
            setProgress(100);
        } catch (error) {
            showToast('搜索失败，请检查后重试');
        } finally {
            setLoading(false);
        }
    };
    return (
        <Container>
            {/* 搜索部分 */}
            <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{ marginTop: "2rem" }}>
                <Grid item xs={12} sm={12} sx={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs={10}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={searchValue}
                                onChange={handleSearchInputChange}
                                placeholder={searchPlaceholder}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Search />}
                                onClick={onClickSearch}
                                disabled={loading}
                                sx={{ minWidth: "80px", whiteSpace: "nowrap" }} // Add this style
                            >
                                搜索
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>


                {/* 搜索选项部分 */}
                <Grid item xs={12} sm={12}>
                    <RadioGroup
                        row
                        aria-label="searchType"
                        name="searchType"
                        value={searchType}
                        onChange={handleSearchTypeChange}
                    >
                        <FormControlLabel
                            value="accurate_user"
                            control={<Radio color="primary" />}
                            label="精确搜索用户发帖"
                        />
                        <FormControlLabel
                            value="fuzzy"
                            control={<Radio color="primary" />}
                            label="模糊搜索用户、帖子标题、内容"
                        />
                    </RadioGroup>
                </Grid>
            </Grid>
            {searchResults && searchResults.tiebaDocumentVOList.length > 0 && (
                <Grid container spacing={2} sx={{ marginTop: "2rem" }}>
                    <Grid item xs={12}>
                        <Typography variant="h5">搜索结果{searchResults.queryType == 'accurate_user' ? '' : '（仅展示前100条）'}:</Typography>
                        {/* 卡片，展示queryType和queryWordString */}
                        <Typography variant="body2" color="textSecondary">
                            搜索类型：{searchResults.queryType == 'accurate_user' ? '精搜用户' : '模糊搜索用户、帖子标题、内容'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {searchResults.queryType == 'accurate_user' ? '用户ID' : '搜索内容'}：{searchResults.queryWordString}
                        </Typography>
                        {/* 副标题灰色字 */}
                        <Typography variant="subtitle2" color="textSecondary">
                            共{searchResults.tiebaDocumentVOList.length}条结果{searchResults.queryType == 'accurate_user' ? '' : '，如果没有命中符合的结果，请调整模糊搜索的内容，点击用户头像或名称可以精确搜索目标用户的发帖'}
                        </Typography>
                        <List>
                            {searchResults.tiebaDocumentVOList.map((item, index) => (
                                <div key={index}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar
                                                alt={item.author}
                                                src="/path/to/user/image.jpg"
                                                onClick={() => {
                                                    search('accurate_user', item.authorUserId);
                                                }}
                                                sx={{
                                                    cursor: "pointer"
                                                }}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={item.title}
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2" color="textSecondary">
                                                        {item.content}
                                                    </Typography>
                                                    <br />
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="textSecondary"
                                                    >
                                                        回复数：{item.replyNum}
                                                    </Typography>
                                                    <br />
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="textPrimary"
                                                        onClick={() => {
                                                            search('accurate_user', item.authorUserId);
                                                        }}
                                                        sx={{
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        发帖时用户名：{item.author}
                                                    </Typography>
                                                    <br />
                                                    <Typography component="span" variant="body2" color="textSecondary">
                                                        快照更新：{item.updateAt
                                                            ? dayjs(item.updateAt).format("YYYY-MM-DD HH:mm:ss")
                                                            : "未知"} / 快照创建：{item.createAt ? dayjs(item.createAt).format("YYYY-MM-DD HH:mm:ss") : "未知"}
                                                    </Typography>
                                                    <br />
                                                    <Typography component="span" variant="body2" color="textSecondary">
                                                        板块：{item.tiebaName} / 用户ID：{item.authorUserId}
                                                    </Typography>
                                                    <br />
                                                    <ButtonGroup size="small" variant="outlined">
                                                        <Button
                                                            disabled={item.authorLink.includes('*')}
                                                            href={item.authorLink}
                                                            target="_blank"
                                                        >
                                                            Tieba用户主页
                                                        </Button>
                                                        <Button
                                                            disabled={item.tieziPageLink.includes('*')}
                                                            href={item.tieziPageLink}
                                                            target="_blank"
                                                        >
                                                            帖子链接
                                                        </Button>
                                                    </ButtonGroup>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </div>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            )}


            {/* 加载弹窗 */}
            <Dialog open={loading}>
                <DialogContent>
                    <Typography variant="h6" gutterBottom>
                        搜索中，请稍后...
                    </Typography>
                    <Typography variant="body2" gutterBottom color="textSecondary">
                        搜索类型：{currentSearchTypeString}
                    </Typography>
                    <Typography variant="body2" gutterBottom color="textSecondary">
                        搜索内容：{currentSearchWord}
                    </Typography>
                    <Typography variant="body2" gutterBottom color="textSecondary">
                        预计等待时间为10s
                    </Typography>

                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={10}>
                            <LinearProgress variant="determinate" value={progress} />
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="body2">{Math.round(progress)}%</Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </Container>
    );
}
