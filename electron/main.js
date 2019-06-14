const {app, BrowserWindow} = require('electron');


let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // win.loadFile('./web/dist/index.html');
    win.loadURL('http://localhost:1234/')

    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });

}

app.on('ready', createWindow);

app.on('window-all-cloesd', () => {
    if (ProcessingInstruction.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
})


const ipcMain = require('electron').ipcMain;
const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
const EventUtils = require('../utils/Events').Events;

// 获取 Render 进程事件 - Nginx Test
ipcMain.on(EventUtils.IPC_EVENT_NGINX_TEST, (sys, msg) => {
    console.log('---- 我要开始执行 nginx -t 命令了，请退后 ----');
    let commandBin = (msg && msg.nginxBinPath) || 'nginx';
    let commandConfPath = msg && msg.nginxConfPath ? '-c ' + msg.nginxConfPath : '';
    let commandOpts = '-t';
    let commandContent = commandBin + ' ' + commandConfPath + ' ' + commandOpts;
    let commandType = 'nginx test';
    execByCommand(commandContent, commandType, sys);
});

// 获取 Render 进程事件 - Nginx Start
ipcMain.on(EventUtils.IPC_EVENT_NGINX_START, (sys, msg) => {
    console.log('---- 我要开始执行 nginx start 命令了，请退后 ----');
    let commandBin = (msg && msg.nginxBinPath) || 'nginx';
    let commandConfPath = msg && msg.nginxConfPath ? '-c ' + msg.nginxConfPath : '';
    let commandContent = commandBin + ' ' + commandConfPath ;
    let commandType = 'nginx start';
    execByCommand(commandContent, commandType, sys);
});

// 获取 Render 进程事件 - Nginx Stop
ipcMain.on(EventUtils.IPC_EVENT_NGINX_STOP, (sys, msg) => {
    console.log('---- 我要开始执行 nginx stop 命令了，请退后 ----');
    let commandBin = (msg && msg.nginxBinPath) || 'nginx';
    let commandConfPath = msg && msg.nginxConfPath ? '-c ' + msg.nginxConfPath : '';
    let commandOpts = '-s stop';
    let commandContent = commandBin + ' ' + commandConfPath + ' stop';
    let commandType = 'nginx stop';
    execByCommand(commandContent, commandType, sys);
});

// 执行 shell 命令
function execByCommand(commandContent, commandType, sys) {
    console.log('exec 指令内容：\n', commandContent);
    let exec = child_process.exec;
    let commandResult = '';
    exec(commandContent, (err, stdout, stderr) => {
        if (err) {
            console.log('err:', err);
            commandResult = err;
        }
        if (stdout) {
            console.log('stdout:', stdout);
            commandResult = stdout;
        }
        if (stderr) {
            console.log('stderr:', stderr);
            commandResult = stderr;
        }
        sys.sender.send(EventUtils.IPC_EVENT_NGINX_OUT_PUT, {
            data: {
                commandType: commandType,
                commandContent: commandContent,
                commandResult: commandResult
            }
        })
    });

}


