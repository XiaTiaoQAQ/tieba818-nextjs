// utils/request.js
async function xtRequest({
                             url,
                             method = 'GET',
                             body = null,
                             onSuccess = () => {
                             },  // 默认为空函数
                             onFailure = () => {
                             }   // 默认为空函数
                         }) {
    const headers = {
        'Content-Type': 'application/json'
    };

    // 如果localStorage中有token，添加到headers
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (body && (method === 'POST' || method === 'PUT')) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, config);
        // 如果状态码是 401，说明 token 失效了，需要重新登录，清除 localStorage 中的 token
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/loginOrRegister?mode=login';
        }
        const data = await response.json();
        if (data.success) {
            onSuccess(data); // 如果请求成功，则调用 onSuccess 函数
        } else {
            onFailure(data); // 如果请求失败，则调用 onFailure 函数
        }
        return data;
    } catch (error) {
        onFailure(error); // 如果有其他错误（例如网络问题），也调用 onFailure 函数
        throw error;
    }
}


export default xtRequest;
