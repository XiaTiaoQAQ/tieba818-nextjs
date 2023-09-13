'use client'
import {Card, Container, Divider, Typography} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import xtRequest from "@/utils/xt-request";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useToast} from "@/components/ToastContext";
import {SearchResults} from "@/app/page";
import dayjs from "dayjs";

export default function SearchDetail({searchParams: {queryRecordId}}) {
    const router = useRouter();
    const [searchDetail, setSearchDetail] = useState(null);
    const showToast = useToast();
    const querySearchDetail = async () => {
        const url = '/818-api/818/queryRecord/queryRecordDetail?queryRecordId=' + queryRecordId;
        await xtRequest({
            url, method: 'POST',
            onSuccess: (data) => {
                const dataObj = data.data;
                setSearchDetail(dataObj);
            },
            onFailure: () => {
                showToast('获取搜索历史失败');
                router.push('/');
            }
        });
    }
    useEffect(() => {
        if (queryRecordId) {
            querySearchDetail();
        }
    }, []);
    if (!queryRecordId) {
        router.push('/');
        return <div>404 缺少参数</div>
    }
    if (!searchDetail) {
        return <div>loading...</div>
    }
    return (
        // <Container maxWidth="sm" style={{marginTop: '20px'}}> 手机端是sm，适配pc
        <Container maxWidth="md" style={{marginTop: '20px'}}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        搜索详情 {queryRecordId}
                    </Typography>
                    {/* 搜索创建时间  "creationTime": "2023-09-13T10:48:53"*/}
                    <Divider style={{marginBottom: '15px'}}/>
                    <Typography variant="body1" gutterBottom>
                        此次搜索快照创建时间：{dayjs(searchDetail.creationTime).format('YYYY-MM-DD HH:mm:ss')}
                    </Typography>
                    {/*如需更新最新数据，请重新搜索*/}
                    <Typography variant="body1" gutterBottom color="textSecondary">
                        如需更新最新数据，请重新搜索
                    </Typography>
                    <SearchResults
                        searchResults={searchDetail.queryResponse}
                        search={
                            (searchType, searchValue) => {
                                // 打印
                                if (searchType && searchValue) {
                                    router.push('/?queryType=' + searchType + '&queryWord=' + searchValue);
                                } else {
                                    showToast('搜索参数不合法');
                                }
                            }
                        }
                        onUnlock={
                            (data) => {
                                // 打印
                                console.log('onUnlock data', data);
                                // 重新获取搜索详情
                                querySearchDetail();
                            }
                        }
                        onPayVip={
                            (data) => {
                                // 打印
                                console.log('onPayVip data', data);
                            }
                        }
                    />
                </CardContent>
            </Card>
        </Container>
    );
}
