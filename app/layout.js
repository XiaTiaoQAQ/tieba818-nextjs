import RootLayoutInClient from "@/app/client-root-layout";

import React from "react";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

async function getTodayUpdateNum() {
    try {
        const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://tieba.in';
        const data = await fetch(baseUrl + "/818-api/818/openPublicApi/todayRequestTrackAnalysis", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                cache: 'no-cache',
            }
        );
        const dataObj = await data.json();
        console.log("getTodayUpdateNum 请求数据：", dataObj);
        return {
            "data": dataObj.data,
            //当前时间
            "updateTime": new Date().getTime()
        }
    } catch (e) {
        console.log("getTodayUpdateNum 请求数据失败：", e);
        return null;
    }
}

var serverSideData = {}
export default async function RootLayoutInServer({children}) {
    const todayUpdateNumData = serverSideData.todayUpdateNum
    // 判断时间是否大于10秒
    if (!todayUpdateNumData || todayUpdateNumData.updateTime + 1000 * 10 < new Date().getTime()) {
        // 如果大于10秒，重新获取数据
        var result = await getTodayUpdateNum()
        if (result) {
            serverSideData = {
                "todayUpdateNum": result
            }
            serverSideData.todayUpdateNum.updateTime = new Date().getTime()
        }
    } else {
        // 如果小于10秒，使用缓存数据
        console.log("使用缓存数据");
    }
    return (
        <html lang="en">
        <body className='818body'>
        <title>Tieba.in Inc. - 贴吧黑洞工具箱 - 贴吧发帖查询 - 贴吧精搜 - 贴吧高搜 - 贴吧查发言</title>
        <meta name="keywords" content="贴吧黑洞工具箱,贴吧发帖查询,贴吧精搜,贴吧高搜,贴吧查发言"/>
        <RootLayoutInClient serverData={serverSideData}>
            {children}
        </RootLayoutInClient>
        </body>
        </html>
    )
}
