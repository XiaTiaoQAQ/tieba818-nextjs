'use client'
import {Card, Container, Divider, Typography, List, ListItem, ListItemText} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import xtRequest from "@/utils/xt-request";
import {useEffect, useState} from "react";
import {useToast} from "@/components/ToastContext";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import Link from "next/link";

function SearchItem({item}) {
    // Determine the query type
    const queryType = item.queryType === 'fuzzy' ? '模糊搜索用户、帖子标题、内容' : '精搜用户';

    // Determine which to show: targetQueryWord or authorUserId
    const displayQueryWordOrAuthorId = item.queryParameters.targetQueryWord || item.queryParameters.authorUserId;

    return (
        <ListItem>
            <ListItemText
                primary={`搜索关键字: ${displayQueryWordOrAuthorId}`}
                secondary={
                    <>
                        <div>查询类型：{queryType}</div>
                        <div>创建时间：{dayjs(item.creationTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                        <div>更新时间：{dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                        {item.activationCodeId && <div>激活码ID：{item.activationCodeId}</div>}
                        {item.vipUnlockedTime && (
                            <div>VIP解锁时间：{dayjs(item.vipUnlockedTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                        )}
                    </>
                }
            />
            <Link href={`/search-detail?queryRecordId=${item.recordId}`}>
                <Button variant="contained" color="primary">
                    查看详情
                </Button>
            </Link>

        </ListItem>
    );
}

export default function SearchHistory() {
    const [searchHistory, setSearchHistory] = useState(null);
    const showToast = useToast();

    const queryRecentSearchHistory = async () => {
        const url = '/818-api/818/queryRecord/userRecentQueryRecord';
        await xtRequest({
            url, method: 'POST',
            onSuccess: (data) => {
                const dataObj = data.data;
                if (dataObj) {
                    setSearchHistory(dataObj);
                } else {
                    showToast('获取搜索历史失败');
                }
            },
            onFailure: () => {
                showToast('获取搜索历史失败');
            }
        });
    }
    useEffect(() => {
        if (!searchHistory) {
            queryRecentSearchHistory();
        }
    }, []);
    if (!searchHistory) {
        return <div>loading...</div>
    }
    return (
        <Container maxWidth="sm" style={{marginTop: '20px', padding: '20px'}}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        搜索历史
                    </Typography>
                    <Divider style={{marginBottom: '15px'}}/>
                    <List>
                        <Typography variant="h6" gutterBottom>
                            最近未解锁搜索记录（最多显示5条）
                        </Typography>
                        {searchHistory?.notUnlockedList.map(item =>
                            <SearchItem key={item.recordId} item={item} isVip={false}/>
                        )}
                        {/*如果是0，则显示暂无数据*/}
                        {searchHistory?.notUnlockedList.length === 0 && <div>暂无数据</div>}
                        <Divider style={{margin: '15px 0'}}/>
                        <Typography variant="h6" gutterBottom>
                            最近3天VIP解锁过的搜索记录
                        </Typography>
                        {searchHistory?.vipUnlockedListIn3Days.map(item =>
                            <SearchItem key={item.recordId} item={item} isVip={true}/>
                        )}
                        {/*如果是0，则显示暂无数据*/}
                        {searchHistory?.vipUnlockedListIn3Days.length === 0 && <div>暂无数据</div>}
                    </List>
                </CardContent>
            </Card>
        </Container>
    );
}
