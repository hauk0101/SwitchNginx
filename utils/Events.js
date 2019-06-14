const Events = {
    IPC_EVENT_NGINX_TEST: 'ipc event nginx test', // IPC 通信，nginx 测试事件
    IPC_EVENT_NGINX_START: 'ipc event nginx start', // IPC 通信，nginx 启动事件
    IPC_EVENT_NGINX_STOP: 'ipc event nginx stop',// IPC 通信，nginx 停止事件
    IPC_EVENT_NGINX_OUT_PUT: 'ipc event nginx out put', // IPC 通信，nginx 输出事件
}

module.exports = {
    Events: Events
}

