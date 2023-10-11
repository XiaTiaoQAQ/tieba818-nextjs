'use client';
import {
    Container,
    Grid,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    Dialog,
    DialogContent,
    Typography,
    LinearProgress,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Divider,
    ButtonGroup,
    Card,
    DialogTitle,
    DialogContentText,
    DialogActions, Stepper, Step, StepLabel, IconButton, Tooltip, List
} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import Button from "@mui/material/Button";
import {HelpOutline, Search, ShoppingBag, VpnKey} from "@mui/icons-material";
import {useToast} from '@/components/ToastContext';
import xtRequest from '@/utils/xt-request';
import dayjs from 'dayjs';
import {XTContext} from "@/app/client-root-layout";
import CardContent from "@mui/material/CardContent";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {FixedSizeList, VariableSizeList} from "react-window";
import {fromVipLevelToVipName} from "@/utils/utils";
import Link from "next/link";
import SuportTiebaList from "@/components/SuportTiebaList";
import {useLoadingDialog} from "@/components/LoadingDialogContext";
import UserInfoCard from "@/components/UserInfoCard";

function VIPQueryCard({queryRecordId, onUnlock, onPayVip, isUnLocked}) {
    const context = useContext(XTContext);
    const {currentUserInfo} = context;
    const [openDialog, setOpenDialog] = useState(false);
    const [activationCode, setActivationCode] = useState("");
    const showToast = useToast();
    const loadingDialogContext = useLoadingDialog();
    const openBuyVIPDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const useVipUnlock = async () => {
        loadingDialogContext.show("解锁中，请稍后...");
        await xtRequest({
            url: '/818-api/818/needPayQuery/useVipToUnBlockQueryRecord?queryRecordId=' + queryRecordId,
            method: 'POST',
            onSuccess: (data) => {
                onUnlock(data.data);
                context.getUserInfo();
                loadingDialogContext.close();
            },
            onFailure: () => {
                // Handle the failure case
                showToast('VIP解锁失败,请联系管理员或稍后重试');
                loadingDialogContext.close();
            }
        })
    };

    return (
        <div>
            {currentUserInfo && currentUserInfo.vipVO ? (
                <div>
                    <p>VIP信息: {fromVipLevelToVipName(currentUserInfo.vipVO.vip.vipLevel)}</p>
                    <Typography variant="body2" color="text.secondary">
                        今日已解锁：{currentUserInfo.vipVO.todayUnlockedCount} / {currentUserInfo.vipVO.vipQueryTimes} 次
                    </Typography>
                    {!isUnLocked && (
                        <Button variant="contained" color="primary" onClick={useVipUnlock}>
                            使用VIP解锁查询结果
                        </Button>
                    )}
                </div>
            ) : (
                <div>
                    <p>您还不是VIP，点击下方按钮购买激活码激活VIP身份</p>
                    <Button variant="contained" color="primary" onClick={openBuyVIPDialog}>
                        立即购买VIP
                    </Button>
                </div>
            )}
            <VIPDialog openDialog={openDialog} handleCloseDialog={handleCloseDialog} onPayVip={onPayVip}/>
        </div>
    );
}

export function VIPDialog({openDialog, handleCloseDialog, onPayVip}) {
    const [activeStep, setActiveStep] = useState(0);
    const [activationCode, setActivationCode] = useState("");
    const context = useContext(XTContext);
    const loadingDialogContext = useLoadingDialog();
    const steps = [
        '跳转打开vniao、购买激活码',
        '输入激活码、点击激活',
        '激活成功！'
    ];
    const monthlyPrice = 38;
    const priceCards = [
        {
            title: '体验卡(周卡)',
            price: 15,
            originalPrice: null,
            unlocks: '限时出售\n 每日10次解锁'
        },
        {
            title: '月卡',
            price: 38,
            originalPrice: null,
            unlocks: '每日20次解锁'
        },
        {
            title: '季卡',
            price: 88,
            originalPrice: monthlyPrice * 3,
            unlocks: '每日50次解锁'
        },
        {
            title: '年卡',
            price: 288,
            originalPrice: monthlyPrice * 12,
            unlocks: '每日88次解锁\n 系统内设置仅14天快照可见用户（1名）\n 工单优先处理'
        }
    ];

    const showToast = useToast();
    const queryToUseActivationCode = async () => {
        if (!activationCode) {
            showToast("请输入激活码");
            return;
        }
        loadingDialogContext.show("激活中，请稍后...");
        await xtRequest({
            url: '/818-api/818/needPayQuery/useActivationCode?activationCode=' + activationCode,
            method: 'POST',
            data: {activationCode},
            onSuccess: (data) => {
                // 如果步骤条是第二步，那么激活成功后，跳转到第三步
                // console.log("data", data);
                if (activeStep === 1) {
                    setActiveStep(prevActiveStep => prevActiveStep + 1);
                }
                loadingDialogContext.close();
                onPayVip();
                // 刷新用户信息
                context.getUserInfo();
            },
            onFailure: () => {
                showToast("激活码激活失败，请检查激活码是否正确或直接联系管理员。");
                loadingDialogContext.close();
            }
        });
    };

    const handleNext = async () => {
        // Here you can handle specific logic for each step
        if (activeStep === 0) {
            // 新窗口打开vniao
            window.open("https://vn.vmp.cc/vniao/2236A1EC");
            setActiveStep(prevActiveStep => prevActiveStep + 1);
        }
        if (activeStep === 1) {
            // 激活码激活
            await queryToUseActivationCode();
        }
    };

    return (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>
                VIP会员购买
                <IconButton edge="end" color="inherit" onClick={handleCloseDialog} aria-label="close">
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            {/* 跳转Vniao */}
            <Link href="https://vn.vmp.cc/vniao/2236A1EC" target="_blank">
                <Typography variant="body2" color="text.secondary" style={{margin: '-20px 0px 0px 20px'}}>
                    点击跳转打开vniao、购买激活码
                </Typography>
            </Link>
            <div style={{ margin: '16px' }}>
                {priceCards.map(card => (
                    <Card variant="outlined" style={{ width: '100%', marginBottom: '8px' }} key={card.title}>
                        <CardContent>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" component="div"
                                sx={{
                                    fontWeight: 'bold',
                                }}
                                >
                                    {card.title}
                                </Typography>
                                <div>
                                    {card.originalPrice &&
                                        <Typography variant="body2" style={{ textDecoration: 'line-through', color: 'grey', display: 'inline', marginRight: '8px' }}>
                                            {card.originalPrice}元
                                        </Typography>
                                    }
                                    <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold', display: 'inline' }}>
                                        {card.price.toFixed(2)}元
                                    </Typography>
                                </div>
                            </div>
                            <Typography variant="subtitle2" sx={{ whiteSpace: 'pre-line', marginTop: '8px' }}>
                                {card.unlocks}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Stepper activeStep={activeStep} alternativeLabel style={{padding: '16px'}}>
                {steps.map(label => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <DialogContent
                sx={{
                    // 设置内容完整显示
                    overflow: 'visible',
                }}
            >
                {activeStep === 0 && (
                    <div style={{textAlign: 'center'}}>
                        <Button startIcon={<ShoppingBag/>} variant="contained" color="primary" onClick={handleNext}>
                            打开vniao购买
                        </Button>
                    </div>
                )}
                {activeStep === 1 && (
                    <div>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="activationCode"
                            label="激活码"
                            type="text"
                            fullWidth
                            value={activationCode}
                            onChange={(e) => setActivationCode(e.target.value)}
                        />
                        <div style={{textAlign: 'center'}}>
                            <Button startIcon={<VpnKey/>}
                                    variant="contained" color="primary" onClick={handleNext}
                                    style={{
                                        marginTop: '16px',
                                    }}>
                                激活
                            </Button>
                        </div>
                    </div>
                )}
                {activeStep === 2 && (
                    <div style={{textAlign: 'center'}}>
                        <DialogContentText>
                            您已成功激活VIP身份！
                        </DialogContentText>
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                    关闭
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export const SearchResults = ({
                                  searchResults,
                                  search,
                                  onUnlock,
                                  onPayVip
                              }) => {
    // 对tiebaDocumentVOList进行统计
    const countTiebaNames = (list) => {
        return list.reduce((acc, item) => {
            acc[item.tiebaName] = (acc[item.tiebaName] || 0) + 1;
            return acc;
        }, {});
    };

    // 如果searchResults改变，那么就重置filteredTiebaName为全部
    useEffect(() => {
        setFilteredTiebaName('全部');
    }, [searchResults]);

    // tiebaName过滤的状态
    const [filteredTiebaName, setFilteredTiebaName] = useState('全部');

    const filteredList = filteredTiebaName === '全部'
        ? searchResults ? searchResults.tiebaDocumentVOList : []
        : searchResults.tiebaDocumentVOList.filter(item => item.tiebaName === filteredTiebaName);

    const tiebaNameCounts = searchResults ? countTiebaNames(searchResults.tiebaDocumentVOList) : {};
    const getItemSize = (index) => {
        const data = filteredList[index];
        // console.log("index", index);
        // console.log("data", data);
        if (!data) {
            return 200;
        } else {
            // 判断是否是手机端
            const isMobile = window.innerWidth <= 768;
            const titleLineWords = isMobile ? 18 : 70;
            // 如果是0行，至少算1行
            const titleLines = Math.max(data.title.length / titleLineWords, 1);
            const contentLines = Math.max(data.content.length / titleLineWords, 1);
            const titleHeight = titleLines * 25;
            const contentHeight = contentLines * 24;
            const extraHeight = isMobile ? 160 : 140;
            // console.log("计算方式为-总数 = ", titleHeight + contentHeight + extraHeight, "titleHeight = ", titleHeight, "contentHeight = ", contentHeight, "extraHeight = ", extraHeight);
            return titleHeight + contentHeight + extraHeight;
        }
    }
    return (
        <>
            {searchResults && (searchResults.tiebaDocumentVOList.length > 0 ||
                searchResults.youMayKnowPeople && searchResults.youMayKnowPeople.length > 0
            ) && (
                <Grid container spacing={2} sx={{marginTop: "0.1rem"}}>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            搜索结果{searchResults.queryType === 'accurate_user' ? '' : '（仅展示前100条）'}:
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            搜索类型：{searchResults.queryType === 'accurate_user' ? '精搜用户' : '模糊搜索用户、帖子标题、内容'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {searchResults.queryType === 'accurate_user' ? '用户ID' : '搜索内容'}：{searchResults.queryWordString}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                            共{searchResults.tiebaDocumentVOList.length}条结果{searchResults.queryType === 'accurate_user' ? '，快照不保证所有发帖记录都留存（例如：发帖秒删），但所展示快照中不存在误差，一定是对方发帖过才会被系统记录' : '，如果没有命中符合的结果，请调整模糊搜索的内容，点击用户头像或名称可以精确搜索目标用户的发帖，精搜用户解锁后将不限制返回条数'}
                        </Typography>
                        {
                            searchResults.vipUnlockedTime !== null && (
                                <Typography variant="body2" color="textSecondary">
                                    此记录解锁时间：{dayjs(searchResults.vipUnlockedTime).format('YYYY-MM-DD HH:mm:ss')}
                                </Typography>
                            )
                        }
                        {searchResults && searchResults.tiebaDocumentVOList.length > 0 && (
                            <>
                                <VIPQueryCard
                                    queryRecordId={searchResults.queryRecordId}
                                    onUnlock={data => {
                                        // console.log('onUnlock data', data);
                                        onUnlock(data);
                                    }}
                                    onPayVip={data => {
                                        // console.log('onPayVip data', data);
                                        onPayVip(data);
                                    }}
                                    isUnLocked={searchResults.vipUnlockedTime !== null}
                                />
                                <Divider sx={{marginTop: "0.5rem", marginBottom: "0.5rem"}}/>
                            </>
                        )
                        }
                    </Grid>
                    {searchResults.youMayKnowPeople && searchResults.youMayKnowPeople.length > 0 && (
                        <Grid item xs={12}>
                            <Typography variant="h5">
                                {searchResults.queryType === 'accurate_user' ? '您查询的用户详情' : '您可能想找的用户（最多50条）:'}
                            </Typography>
                            {searchResults.queryType !== 'accurate_user' && (
                                <>
                                    <Typography variant="body2" color="textSecondary">
                                        以下是您可能认识的人，点击头像或名称可以精确搜索目标用户的发帖，横向可以滚动
                                    </Typography>
                                </>
                            )
                            }
                            <Divider sx={{marginTop: "0.5rem", marginBottom: "0.5rem"}}/>
                            {/* 横向列表 */}
                            <List sx={{
                                display: 'flex',
                                flexWrap: 'nowrap', // 为了确保内容不换行
                                padding: '0px',
                                overflowX: 'auto',  // 添加横向滚动
                                maxWidth: '100vw',  // 设定一个最大宽度，可以根据需要调整
                                // 子控件垂直居上
                                alignItems: 'flex-start',
                            }}>
                                {searchResults.youMayKnowPeople.map((person, index) => (
                                    <ListItem key={index} sx={{padding: '2px'}}>
                                        <UserInfoCard data={person} onCardClick={
                                            () => {
                                                search("accurate_user", person.auther_id)
                                            }
                                        }/>
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>)
                    }
                    {/* ... (保持其他部分不变) */}
                    <Divider sx={{marginTop: "0.5rem", marginBottom: "0.5rem"}}/>

                    {/* 添加tiebaName过滤的按钮 */}
                    {searchResults && searchResults.tiebaDocumentVOList.length > 0 && (
                        <>
                            <ButtonGroup variant="outlined" size="small" sx={{margin: "0.5rem", flexWrap: "wrap"}}>
                                <Button
                                    onClick={() => setFilteredTiebaName('全部')}
                                    variant={filteredTiebaName === '全部' ? 'contained' : 'outlined'}
                                >
                                    全部({searchResults.tiebaDocumentVOList.length})
                                </Button>
                                {Object.entries(tiebaNameCounts).map(([name, count]) => (
                                    <Button
                                        key={name}
                                        onClick={() => setFilteredTiebaName(name)}
                                        variant={filteredTiebaName === name ? 'contained' : 'outlined'}
                                    >
                                        {name}({count})
                                    </Button>
                                ))}
                            </ButtonGroup>

                            <VariableSizeList
                                height={800}
                                width="100%"
                                itemSize={getItemSize}
                                layout="vertical"
                                itemCount={filteredList.length}
                                itemData={{
                                    tiebaDocumentVOList: filteredList,
                                    search: search,
                                    dayjs: dayjs,
                                }}
                            >
                                {Row}
                            </VariableSizeList>
                        </>
                    )
                    }
                </Grid>
            )}

            {searchResults && searchResults.tiebaDocumentVOList.length === 0 && (
                <Typography variant="h5" sx={{marginTop: "2rem"}}>
                    {
                        searchResults.queryType === 'accurate_user' ? '系统内暂未收录到该用户的发帖记录' : '未查询到符合条件的发帖记录，请调整搜索内容后重试'
                    }
                </Typography>
            )}
        </>
    );
};


export default function Home({searchParams: {queryType, queryWord}}) {
    const [searchType, setSearchType] = useState('fuzzy');
    const [searchValue, setSearchValue] = useState('');
    const showToast = useToast();
    const [currentSearchTypeString, setCurrentSearchTypeString] = useState('');
    const [currentSearchWord, setCurrentSearchWord] = useState('');

    // 根据搜索类型设置placeholder
    const searchPlaceholder = searchType === 'accurate_user' ?
        '输入用户的主页链接URL/id 精确查询他的发帖' :
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
        if (searchType === 'accurate_user') {
            if (event.target.value.startsWith('http')) {
                try {
                    const url = new URL(event.target.value);
                    const params = new URLSearchParams(url.search);
                    const idValue = params.get('id');
                    if (idValue && idValue.startsWith('tb.1.')) {
                        setSearchValue(idValue);
                        return;
                    }
                } catch (e) {
                    // 不是有效的URL
                }
            }
        }
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

    // 在第一次加载时，如果有搜索参数，直接搜索，但是要防止之后的重复搜索
    useEffect(() => {
            if (queryType && queryWord && !searchResults) {
                search(queryType, queryWord);
                // 去除url
                window.history.replaceState({}, '', '/');
            }
        }
        , [queryType, queryWord]);

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
            const data = await xtRequest({url, method: 'GET'});
            showToast('搜索成功');
            setSearchResults(data.data);  // 新增此行
            setProgress(100);
        } catch (error) {
            showToast('搜索失败，请检查后重试，倘若是超时，请前往查询历史查询结果');
        } finally {
            setLoading(false);
        }
    };
    return (
        <Container>
            {/* 搜索部分 */}
            <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{marginTop: "2rem"}}>
                <Grid item xs={12} sm={12} sx={{paddingLeft: "1rem", paddingRight: "1rem"}}>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs={10}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={searchValue}
                                onChange={handleSearchInputChange}
                                placeholder={"昵称/用户名/帖子标题/内容"}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Search/>}
                                onClick={onClickSearch}
                                disabled={loading}
                                sx={{minWidth: "80px", whiteSpace: "nowrap"}} // Add this style
                            >
                                搜索
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>


                {/* 搜索选项部分 */}
                {/*<Grid item xs={12} sm={12}>*/}
                {/*    <RadioGroup*/}
                {/*        row*/}
                {/*        aria-label="searchType"*/}
                {/*        name="searchType"*/}
                {/*        value={searchType}*/}
                {/*        onChange={handleSearchTypeChange}*/}
                {/*    >*/}
                {/*        <FormControlLabel*/}
                {/*            value="fuzzy"*/}
                {/*            control={<Radio color="primary"/>}*/}
                {/*            label="模糊搜索用户、帖子标题、内容"*/}
                {/*        />*/}
                {/*        <FormControlLabel*/}
                {/*            value="accurate_user"*/}
                {/*            control={<Radio color="primary"/>}*/}
                {/*            label="精确搜索用户发帖"*/}
                {/*        />*/}
                {/*        /!*垂直*!/*/}
                {/*    </RadioGroup>*/}
                {/*</Grid>*/}
                <Grid item xs={12} sm={12}>
                    <Link href="/guide">
                        <Typography variant="body2" gutterBottom color="primary">
                            第一次使用？推荐阅读《使用指引》
                        </Typography>
                    </Link>
                </Grid>
            </Grid>
            <SuportTiebaList/>
            <SearchResults
                searchResults={searchResults}
                search={search}
                onUnlock={
                    (data) => {
                        // 打印
                        // console.log('onUnlock data', data);
                        setSearchResults(data)
                    }
                }
                onPayVip={
                    (data) => {
                        // 打印
                        // console.log('onPayVip data', data);
                    }
                }
            />


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
                        预计等待时间为10s，倘若超时，请稍等一会后前往右上角查询历史查看结果
                    </Typography>

                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={10}>
                            <LinearProgress variant="determinate" value={progress}/>
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

function Row(props) {
    const {index, style, data} = props;
    const item = data.tiebaDocumentVOList[index];
    const {search, dayjs} = data;
    return (
        <div style={style}>
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
                            <br/>
                            <Typography
                                component="span"
                                variant="body2"
                                color="textSecondary"
                            >
                                回复数：{item.replyNum}
                            </Typography>
                            <br/>
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
                            <br/>
                            <Typography component="span" variant="body2" color="textSecondary">
                                快照更新：{item.updateAt
                                ? dayjs(item.updateAt).format("YYYY-MM-DD HH:mm:ss")
                                : "未知"} /
                                快照创建：{item.createAt ? dayjs(item.createAt).format("YYYY-MM-DD HH:mm:ss") : "未知"}
                            </Typography>
                            <br/>
                            <Typography component="span" variant="body2" color="textSecondary">
                                板块：{item.tiebaName} / 用户ID：{item.authorUserId}
                            </Typography>
                            <br/>
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
            <Divider variant="inset" component="div"/>
        </div>
    )
}
