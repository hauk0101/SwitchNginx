import React, {Component} from 'react';
// 如果直接 import electron 的话，webpack 会去 node_modules 中查找，
// 但是，electron 是在其运行时进行解析的。
// 可参考：https://stackoverflow.com/questions/34427446/bundle-error-using-webpack-for-electron-application-cannot-resolve-module-elec
const ipcRenderer = window.require('electron').ipcRenderer;
import {Events} from '../../../utils/Events';


const EventUtils = Events;
export default class Content extends Component {
    constructor() {
        super();
        this.state = {
            nginxBinPath: '/usr/local/Cellar/nginx/1.15.11/bin/nginx',
            nginxConfPath: '/usr/local/etc/nginx/allinmd_local.conf',
            commandType: '',
            commandContent: '',
            commandResult: ''
        }
        this.ipcRenderEventInit();
    }

    // ipcRender 事件监听初始化
    ipcRenderEventInit() {
        ipcRenderer.on(EventUtils.IPC_EVENT_NGINX_OUT_PUT, (sys, msg) => {
            this.setState({
                commandType: msg.data.commandType,
                commandContent: msg.data.commandContent,
                commandResult: msg.data.commandResult
            })
        });
    }

    // nginx 可执行文件的路径输入变化处理函数
    handleNginxBinPathChange(event) {
        this.setState({
            nginxBinPath: event.target.value
        })
    }

    // nginx 配置文件的路径输入变化处理函数
    handleNginxConfPathChange(event) {
        this.setState({
            nginxConfPath: event.target.value
        })
    }

    // nginx 测试按钮点击处理函数
    handleNginxTestBtnClick(event) {
        console.log('请注意，我要开始测试nginx配置文件了...');
        ipcRenderer.send(EventUtils.IPC_EVENT_NGINX_TEST, {
            nginxBinPath: this.state.nginxBinPath,
            nginxConfPath: this.state.nginxConfPath
        })
    }

    // nginx 开始按钮点击处理函数
    handleNginxStartBtnClick(event) {
        console.log('请注意，我要开始启动nginx了...');
        ipcRenderer.send(EventUtils.IPC_EVENT_NGINX_START, {
            nginxBinPath: this.state.nginxBinPath,
            nginxConfPath: this.state.nginxConfPath
        })
    }

    // nginx 停止全部进程按钮点击处理函数
    handleNginxStopBtnClick(event) {
        console.log('请注意，我要关闭所有的nginx进程了...');
        ipcRenderer.send(EventUtils.IPC_EVENT_NGINX_STOP, {
            nginxBinPath: this.state.nginxBinPath,
            nginxConfPath: this.state.nginxConfPath
        })
    }

    render() {
        return <>
            <div>
                <label htmlFor={'nginxBin'}>输入nginx执行路径：</label>
                <input id={'nginxBin'}
                       placeholder={'请输入 nginx 可执行路径，如 /usr/bin/nginx'}
                       style={{width: '300px'}}
                       value={this.state.nginxBinPath}
                       onChange={this.handleNginxBinPathChange.bind(this)}
                />
            </div>
            <div>
                <label htmlFor={'nginxConf'}>输入nginx配置文件目录：</label>
                <input id={'nginxConf'}
                       placeholder={'请输入 nginx.conf 路径'}
                       style={{width: '300px'}}
                       value={this.state.nginxConfPath}
                       onChange={this.handleNginxConfPathChange.bind(this)}
                />
            </div>
            <div>
                <button onClick={this.handleNginxTestBtnClick.bind(this)}>Nginx 测试</button>
                <button onClick={this.handleNginxStartBtnClick.bind(this)}>Nginx 启动</button>
                <button onClick={this.handleNginxStopBtnClick.bind(this)}>Nginx 停止</button>
            </div>
            <h3>操作日志</h3>
            <div>
                <div><label>指令类型：{this.state.commandType}</label></div>
                <div><label>指令内容：{this.state.commandContent}</label></div>
                <div><label>执行结果：</label>
                    <pre>{this.state.commandResult}</pre>
                </div>
            </div>
        </>
    }
}
