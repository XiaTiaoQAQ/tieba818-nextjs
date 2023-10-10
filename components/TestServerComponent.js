// 缓存
import React from 'react';

let cache = {};

async function getProjects() {
    // 缓存一分钟
    if (cache.time && cache.time + 1000 * 60 > new Date().getTime()) {
        console.log('使用缓存');
        return cache;
    }
    const res = await fetch('https://tieba.baidu.com/home/get/panel?ie=utf-8&fid=2071624&id=tb.1.f90d83b1.LIwchJrLsVJhFHUp_BB8rg');
    const data = await res.json();
    console.log(data);
    cache = {
        "data": data.data,
        "time": new Date().getTime()
    }
    return cache;
}

export default async function TestServerComponent() {
    const projects = await getProjects();
    return (
        <div>
            <h1>TestServerComponent</h1>
            <p>{projects.data.name ? projects.data.name : "未知"}</p>
        </div>
    )
}
