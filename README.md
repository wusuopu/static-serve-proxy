# static-serve-proxy

一个简单的静态文件服务器。简单于 `python -m SimpleHTTPServer`。

同时增加 http proxy 功能，为了方便本地测试 react, vue 之类的项目 build 之后的静态文件。

## 使用方法

serve 当前目录的静态文件
```
node index.js
```

对于 react 前端路由的项目
```
node index.js -d build -f proxy.json
```

对于 react 后端路由的项目
```
node index.js -d build -f proxy.json -i build/index.html
```
