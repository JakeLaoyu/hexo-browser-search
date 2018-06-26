# hexo-browser-search

使用`koa2`、`redis`完成hexo博客chrome浏览器地址栏搜索

![](https://blogimg.jakeyu.top/20170719150043011893340.png)

## demo

首先访问一次[https://i.jakeyu.top/](https://i.jakeyu.top/)

然后在chrome地址栏输入`i.jakeyu.top`，点击`Tab`进行搜索

## Hexo配置

安装[hexo-generator-search](https://github.com/Wzpan/hexo-generator-search)插件

```
npm install hexo-generator-search -S
```

在`_config.yml`添加下面配置

```yml
search:
  path: localsearch.xml
  field: post
```

在博客`source`目录下创建`sitesearch.xml`

```xml
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
<InputEncoding>utf-8</InputEncoding>
<ShortName>标题</ShortName>
<Description>描述</Description>
<Image height="16" width="16" type="image/x-icon">图标地址(例:https://xxx.com/favicon.ico)</Image>
<Url type="text/html" template="https://xxx.com/search?search={searchTerms}"/>
</OpenSearchDescription>
```

在博客源码中添加link

```html
<link rel="search" type="application/opensearchdescription+xml" href="https://xxx.com/sitesearch.xml" title="Jake">
```


## 服务端配置

### redis

需要安装`redis`,检查是否开启

![](https://blogimg.jakeyu.top/hexo-browser-search/Jietu20180524-001406@2x.png)

### 配置文件`config.js`说明

```js
module.exports = {
  index: 'https://i.jakeyu.top', // 网站首页
  link: 'https://i.jakeyu.top/archives/', // 归档页面地址
  searchFile: 'localsearch.xml',  // hexo-generator-search path配置
  port: 3500, //服务端口
  cronTime: '00 59 23 * * *', // 设置定时任务时间 参考 https://github.com/kelektiv/node-cron
  sentryUrl: '', // https://sentry.io 监控错误，如果不需要删除即可
  redis: {
    port: 6379, // redis 端口
    host: '127.0.0.1',  // redis 地址
    keyPreifx: 'searchDatas', // redis key
    expire: 30 // redis过期时间(s)
  },
  api: {
    search: '/search', // 搜索路由
    cache: '/search/cache' // 刷新缓存路由
  }
}
```

### nginx

```nginx
location /search {
  proxy_pass http://127.0.0.1:3500;
}
```

### 启动
```
git clone git@github.com:JakeLaoyu/hexo-browser-search.git
cd hexo-browser-search
npm i
npm i pm2 -g
pm2 start pm2.config.json
```

## 开发

```
git clone https://github.com/JakeLaoyu/hexo-browser-search.git
cd hexo-browser-search
yarn
npm run dev
```

## License
MIT © [JakeLaoyu](https://github.com/JakeLaoyu)
