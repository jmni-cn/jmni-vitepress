# 抓包工具whistle

## 安装Node
whistle支持v0.10.0以上版本的Node，为获取更好的性能，推荐安装最新版本的Node。

如果你的系统已经安装了v0.10.0以上版本的Node，可以忽略此步骤，直接进入安装whistle的步骤


## 安装whistle

Node安装成功后，执行如下npm命令安装whistle

```
npm install -g whistle
```

npm默认镜像是在国外，有时候安装速度很慢或者出现安装不了的情况，如果无法安装或者安装很慢，可以使用taobao的镜像安装：

```
npm install whistle -g --registry=https://registry.npmmirror.com
```

whistle安装完成后，执行命令 `whistle help` 或 `w2 help`，查看whistle的帮助信息

```
  w2 help

  Usage: whistle <command> [options]


  Commands:

    status          Show the running status
    add [filepath]  Add rules from local js file (.whistle.js by default)
    install         Install a whistle plugin
    uninstall       Uninstall a whistle plugin
    exec            Exec whistle plugin command
    run             Start a front service
    start           Start a background service
    stop            Stop current background service
    restart         Restart current background service
    help            Display help information

  Options:

    -h, --help                                      output usage information
    -D, --baseDir [baseDir]                         set the configured storage root path
    -z, --certDir [directory]                       set custom certificate store directory
    -l, --localUIHost [hostname]                    set the domain for the web ui (local.whistlejs.com by default)
    -L, --pluginHost [hostname]                     set the domain for the web ui of plugin  (as: "script=a.b.com&vase=x.y.com")
    -n, --username [username]                       set the username to access the web ui
    -w, --password [password]                       set the password to access the web ui
    -N, --guestName [username]                      set the the guest name to access the web ui (can only view the data)
    -W, --guestPassword [password]                  set the guest password to access the web ui (can only view the data)
    -s, --sockets [number]                          set the max number of cached connections on each domain (256 by default)
    -S, --storage [newStorageDir]                   set the configured storage directory
    -C, --copy [storageDir]                         copy the configuration of the specified directory to a new directory
    -c, --dnsCache [time]                           set the cache time of DNS (60000ms by default)
    -H, --host [boundHost]                          set the bound host (INADDR_ANY by default)
    -p, --port [proxyPort]                          set the proxy port (8899 by default)
    -P, --uiport [uiport]                           set the webui port
    -m, --middlewares [script path or module name]  set the express middlewares loaded at startup (as: xx,yy/zz.js)
    -M, --mode [mode]                               set the starting mode (as: pureProxy|debug|multiEnv|capture|disableH2|network|rules|plugins|prod)
    -t, --timeout [ms]                              set the request timeout (360000ms by default)
    -e, --extra [extraData]                         set the extra parameters for plugin
    -f, --secureFilter [secureFilter]               set the path of secure filter
    -r, --shadowRules [shadowRules]                 set the shadow/default rules
    -R, --reqCacheSize [reqCacheSize]               set the cache size of request data (600 by default)
    -F, --frameCacheSize [frameCacheSize]           set the cache size of webSocket and socket's frames (512 by default)
    -A, --addon [pluginPaths]                       add custom plugin paths
    --dnsServer [dnsServer]                         set custom dns servers
    --socksPort [socksPort]                         set the socksv5 server port
    --httpPort [httpPort]                           set the http server port
    --httpsPort [httpsPort]                         set the https server port
    --no-global-plugins                             do not load any globally installed plugins
    --no-prev-options                               do not reuse the previous options when restarting
    --inspect [[host:]port]                         activate inspector on host:port (127.0.0.1:9229 by default)
    --inspectBrk [[host:]port]                      activate inspector on host:port and break at start of user script (127.0.0.1:9229 by default)
    -V, --version                                   output the version number
```

如果能正常输出whistle的帮助信息，表示whistle已安装成功。

## 启动whistle
>最新版本的whistle支持三种等价的命令`whistle`、`w2`、`wproxy`

启动whistle:

```
w2 start
```

重启whsitle:

```
w2 restart
```

停止whistle:

```
w2 stop
```

## 配置代理

### 配置信息

- 代理服务器：127.0.0.1 (如果部署在远程服务器或虚拟机上，改成对应服务器或虚拟机的ip即可)
- 默认端口：8899 (如果端口被占用，可以在启动时通过 -p 来指定新的端口，更多信息可以通过执行命令行 w2 help (v0.7.0及以上版本也可以使用w2 help) 查看)

>勾选上 对所有协议均使用相同的代理服务器


### 浏览器代理 (推荐)：安装浏览器代理插件

- 安装Chrome代理插件：推荐安装 [SwitchyOmega](https://chrome.google.com/webstore/detail/proxy-switchyomega/padekgcemlokbadohgkifijomclgjgif)

![switchyomega.jpg](//static.jmni.cn/blog/img/17043fb9fa2d44b5af3147f8353fed17.jpg)

- Firefox: 地址栏输入访问 `about:preferences`，找到 `Network Proxy`，选择 手动代理配置(Manual proxy configuration)，输入代理服务器地址、端口，保存

![firefoxproxy1.jpg](//static.jmni.cn/blog/img/33845f5cdbd149cea931f9d86e00bf68.jpg)
![firefoxproxy2.jpg](//static.jmni.cn/blog/img/97ac801255dd46dc887d87fbe72f2580.jpg)

- 移动端需要在设置中配置当前Wi-Fi的代理，以 iOS 为例：

![iOSproxyall.jpg](//static.jmni.cn/blog/img/ff4a5394a0bd4771b07aa92ae31fb884.jpg)

PS: 如果配置完代理，手机无法访问，可能是whistle所在的电脑防火墙限制了远程访问whistle的端口，关闭防火墙或者设置白名单：http://jingyan.baidu.com/article/870c6fc317cae7b03ee4be48.html

## 访问配置页面

启动whistle及配置完代理后，用 **Chrome浏览器(由于css兼容性问题界面只支持Chrome浏览器)** 访问配置页面，如果能正常打开页面，whistle安装启动完毕，可以开始使用。

可以通过以下两种方式来访问配置页面：

- 通过ip+端口来访问，形式如 `http://whistleServerIP:whistlePort/` e.g. http://127.0.0.1:8899
- 通过命令行参数 `-P xxxx` 自定义webui的端口(xxxx表示要设置的端口号)，自定义端口支持上述两种方式访问，也支持 http://127.0.0.1:xxxx
