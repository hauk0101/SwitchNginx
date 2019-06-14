### SwitchNginx v0.1

#### 目录
* 目标
* 原理
* 细节
* 待完善
* 待深究

##### 目标

* 能够通过UI界面进行 `nginx -t` 、`nginx -c xxx.conf` 、 `nginx -c xxx.conf -s stop` 的命令操作，实现 nginx 的`测试`、`启动`、`停止`基础操作
* 能够打包出可执行的程序
* 跑通技术栈基础串联，webpack + react + electron + node + nginx 

##### 原理

* 基于 electron ，通过 react 作为 UI 交互，通过 node 执行 shell 命令，操作 nginx 相关指令，实现对 nginx 的控制。
* webpack 打包 react
* child_process 执行 shell 指令
* electron-packager 打包程序

##### 细节
* 安装 electron
    * 由于 electron 相关的一些镜像在国外，所以直接通过 npm i electron 无法正常安装，会卡在 `... and 1 more ` 这一块，即使将 npm 的 registry 设置为淘宝源，依然会有这样的问题。
    * 此处，可以通过设置 ELECTRON_MIRROR 相关内容解决（网上的资源说是 win 系统好使，但是实测 mac 不生效）
    * 最终是通过修改 /etc/bashrc 文件，增加 export ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron/ 实现的
    * 参考资料：[正确设置 ELECTRON_MIRROR ，加速下载 electron 预编译文件](http://newsn.com.cn/say/electron-mirror.html) 
    * 小结：此处知识点，设置 npm 的 .npmrc 文件，在以后遇到类似问题时，可以考虑从这里入手解决问题
* 配置 Webpack
    * 配置 webpack 打包需要的配置文件，打包编译 react 的基础设置
    * 开发时代码热更新：webpack-dev-server 配置
* 开发
    * import 和 require 的同时使用
        * 在 electron 中更多使用的是 node 环境，所以用的是 require 
        * 但是在 react 中使用的是 ES6 ，用的是 import 
        * 解决方案：在需要被引用的文件中，通过如下方式导出即可
        ```
         // 导出方式
         module.exports = {
             Events: Events
         }
         
         // import 引用方式
         import {Events} from '../../../utils/Events';
         // require 引用方式
         const EventUtils = require('../utils/Events').Events;
        ```
    * react 的 UI 代码中，无法使用 node 相关 api ，如 child_process 模块，这时，就需要通过 ipcMain 和 ipcRender 解决
    * child_process 的 exec 执行回调中，stdout（标准输出） 和 stderr （标准错误），在执行 shell 指令后输出时，需要注意
    * react 中引用 electron
        * 引用方式：const electron = window.require('electron');
        * 说明：如果直接 import electron 的话，webpack 会去 node_modules 中查找，但是，electron 是在其运行时进行解析的。
        * 参考资料：[https://stackoverflow.com/questions/34427446/bundle-error-using-webpack-for-electron-application-cannot-resolve-module-elec](https://stackoverflow.com/questions/34427446/bundle-error-using-webpack-for-electron-application-cannot-resolve-module-elec)
    * ipcMain 主动发送消息时，必须通过 ipcMain 接受到消息的回调方法中的，`sys.sender.send()`  
    * nginx 指令
        * 通过 killall 和 pkill 无法正常在 mac 上完全杀死 nginx 进程
        * 针对 nginx -c xxx.conf 启动的服务，可以通过 nginx -c xxx.conf -s stop 停止
        * 但是，如果当前机器启动了多个 nginx ，则通过 nginx -c xxx.conf -s stop 停止时，会出现问题，只会停止一个服务，原因是因为停止了一个服务后，nginx.pid 被删除了，会提示找不到对应的 nginx.pid 目录或文件，需要注意。
        * 解决思路：
            * 写shell脚本，批量删除nginx
            * 在nginx配置文件中，加入对 nginx.pid 的相关设置。
* 打包
    * 执行 electron-packager 时，需要配置 electron-version 版本
    
##### 待完善 
* 功能完善（产品）
    * UI样式
    * 单个配置文件的编辑、保存功能
    * 多个配置文件的切换
    * 系统设置
        * 设置 nginx 指令执行文件地址
        * 设置 nginx 配置文件保存路径

* 架构完善（技术）
    * 应用 TypeScript
    * 加入单元测试
    * 项目目录整合、分离
    
* 文档完善（运营）
    * 产品研发历程文章
    * 平台推广     

##### 待深究
* electron 相关开发的热更新

