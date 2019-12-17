# SRC 
约定`src`为源码目录，如果不存在`src`目录，则当前目录会被作为源码目录。   
比如：下面的两种目录结构的效果是一致的。
```tree
+ src
  + pages
    - index.js
  + layouts
    - index.js
- .umirc.js
```

```tree
+ pages
  - index.js
+ layouts
  - index.js
- .umirc.js
```
# src/layouts/index.js
注：配置式路由下无效。
全局布局，在路由外面嵌套的一层路由。
比如你的路由是：
```js
[
  { path: '/', component: './pages/index' },
  { path: '/users', component: './pages/users' },
]
```

如果有有`layouts/index.js`,那么路由就会变为：
```js
[
  { path: '/', component: './layouts/index', routes: [
    { path: '/', component: './pages/index' },
    { path: '/users', component: './pages/users' },
  ] }
]
```
# src/pages
注：配置式路由下无效。
约定pages下所有的js、jsx、ts和tsx文件即路由。关于更多关于约定式路由的介绍，请前往路由章节。https://umijs.org/zh/guide/router.html

# src/pages/404.js
404页面。注意开发模式下有内置的umi提供的404提示页面，所以只有显式访问 /404 才能访问到这个页面。

# src/pages/document.ejs
有这个文件时，会覆盖默认的HTMl模板。https://github.com/umijs/umi/blob/master/packages/umi-build-dev/template/document.ejs
```html
<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
<% if (context.title != null) { %>
  <title><%= context.title %></title>
<% } %>
</head>
<body>

<div id="<%= context.config.mountElementId %>"></div>

</body>
</html>
```
模板里需要至少包含根节点的HTML信息。
```html
<div id="root"></div>
```
