async function xtRequest({
                             url,
                             method = 'GET',
                             body = null,
                             file = null, // 新增参数来传递文件
                             onSuccess = () => {},
                             onFailure = () => {}
                         }) {
    const headers = {};

    // 如果localStorage中有token，添加到headers
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (file) {
        // 如果有文件，则使用 FormData
        const formData = new FormData();
        formData.append("file", file); // 根据后端的接收参数来确定键名

        if (body) {
            // 如果还有其他需要一起发送的数据，也可以添加到 FormData
            Object.keys(body).forEach(key => {
                formData.append(key, body[key]);
            });
        }

        config.body = formData;
    } else if (body && (method === 'POST' || method === 'PUT')) {
        config.headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify(body);
    }

    // 设置超时时间
    config.timeout = 60000; // 60秒
    try {
        const response = await fetch(url, config);
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/loginOrRegister?mode=login';
        }
        const data = await response.json();
        if (data.success) {
            onSuccess(data);
        } else {
            onFailure(data);
        }
        return data;
    } catch (error) {
        onFailure(error);
        throw error;
    }
}

export default xtRequest;
