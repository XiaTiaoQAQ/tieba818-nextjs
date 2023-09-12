'use client'
import {Card, Container, Divider, Typography} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import xtRequest from "@/utils/xt-request";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useToast} from "@/components/ToastContext";
import {SearchResults} from "@/app/page";

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
        <Container maxWidth="sm" style={{marginTop: '20px'}}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        搜索详情 {queryRecordId}
                    </Typography>
                    <Divider style={{marginBottom: '15px'}}/>
                    <SearchResults
                        searchResults={searchDetail}
                        search= {
                            (data) => {
                                // 打印
                                console.log('search data', data);
                            }
                        }
                        onUnlock={
                            (data) => {
                                // 打印
                                console.log('onUnlock data', data);
                                setSearchDetail(data)
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
