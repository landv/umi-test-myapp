# 目录及约定
- https://umijs.org/zh/guide/app-structure.html#src-global-css-less-sass-scss
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
# src/pages/.umi
这是umi dev时产生的临时目录，默认包含umi.js和router.js，有些插件也会在这里生成一些其他临时文件。可以在这里做一些验证，但请不要直接在这里修改代码，umi重启或者pages下的文件修改都会重新生成这个文件夹下的文件。

#src/pages/.umi-production
同src/pages/.umi,但是是在umi build 时生成的，umi build 执行完自动删除。

#.tet.(js|ts)和.e2e.(js|ts)
测试文件，umi test 会查找所有的.test.js和.e2e.js文件来跑测试。
#src/global.(js|ts)
此文件会在入口文件的最前面被自动引入，可以在这里加载补丁，做一些初始化的操作等。
#src/global.(css|less|sass|scss)
此文件不走 css modules,且会自动被引入，可以在这里写全局样式，以及做样式覆盖。
#src/app.(js|ts)
运行时配置文件，可以在这里扩展运行时的能力，比如修改路由、修改render方法等。
#.umirs.(js|ts)和config/config.(js|ts)
编译时配置文件，二选一，不可共存。
#.env
环境变量配置文件，比如：
```env
CLEAR_CONSOLE=none
BROWSER=none
```
这里定义的系统环境变量在整个umi-build-dev的生命周期里都可以被使用
#.env.local
本地化的系统环境变量，该文件通常不用提交到代码仓库。本地启动时，相同内容.env.local会覆盖.env。

---
#路由

::: tip 提示
下文介绍的路由使用可以在 umi-examples/routes 和 umi-examples/routes-via-config 里找到示例代码。
:::
umi会根据pages目录自动生成路由配置。
# 约定式路由
## 基础路由
假设pages目录结构如下：
```
+ pages/
  + users/
    - index.js
    - list.js
  - index.js
```
那么，umi会自动生成路由配置如下：
```
[
  { path: '/', component: './pages/index.js' },
  { path: '/users/', component: './pages/users/index.js' },
  { path: '/users/list', component: './pages/users/list.js' },
]
```
> 注意：若`.umirc.(ts|js)`或者`config/config.(ts|js)`文件中对router进行了配置，约定式路由将失效、新添加的页面不会自动被UMI编译，UMI将使用配置式路由。

## 动态路由
umi 里约定，带$前缀的目录或文件为动态路由。
比如一下目录结构：
```
+ pages/
  + $post/
    - index.js
    - comments.js
  + users/
    $id.js
  - index.js
```
会生成路由配置如下：
```
[
  { path: '/', component: './pages/index.js' },
  { path: '/users/:id', component: './pages/users/$id.js' },
  { path: '/:post/', component: './pages/$post/index.js' },
  { path: '/:post/comments', component: './pages/$post/comments.js' },
]
```
## 可选的动态路由
umi里约定动态路由如果带$后缀，则为可选动态路由。
比如一下的结构：
```
+ pages/
  + users/
    - $id$.js
  - index.js
```
会生成路由配置如下：
```
[
  { path: '/': component: './pages/index.js' },
  { path: '/users/:id?': component: './pages/users/$id$.js' },
]
```
## 嵌套路由
umi里约定目录下有_layout.js时会生产嵌套路由，以_layout.js为该目录的layout。
比如一下目录结构：
```
+ pages/
  + users/
    - _layout.js
    - $id.js
    - index.js
```
会生成路由配置如下：
```
[
  { path: '/users', component: './pages/users/_layout.js',
    routes: [
     { path: '/users/', component: './pages/users/index.js' },
     { path: '/users/:id', component: './pages/users/$id.js' },
   ],
  },
]
```
## 全局layout
约定 src/layouts/index.js为全局路由，返回一个REACT组件，通过props.children渲染子组件。
比如：
```
export default function(props) {
  return (
    <>
      <Header />
      { props.children }
      <Footer />
    </>
  );
}
```
## 不同的全局layout
你可能需要针对不同路由输出不同的全局layout，umi不支持这样的配置，但你仍可以在layouts/index.js对location.path做区分，渲染不同的layout。
比如想要针对/login输出简单布局，
```
export default function(props) {
  if (props.location.pathname === '/login') {
    return <SimpleLayout>{ props.children }</SimpleLayout>
  }

  return (
    <>
      <Header />
      { props.children }
      <Footer />
    </>
  );
}
```
## 404路由
约定pages/404.js为404页面，需返回REACT组件。
比如：
```
export default () => {
    return (
        <div>I am a customized 404 page</div>
    )
}
```
> 注意：开发模式下，umi会添加一个默认的404页面来辅助开发，大你仍然可以通过精确访问/404来验证404页面。
## 通过注释扩展路由
约定路由文件的手工注释如果包含yaml格式的配置，则会被用于扩展路由。
比如：
```
+ pages/
  - index.js
```
如果pages/index.js里包含：
```
/**
* title: Index Page
* Routes:
*   - ./src/routes/a.js
*   - ./src/routes/b.js
*/
```
则会生成路由配置：
```
[
  { path: '/', component: './index.js',
    title: 'Index Page',
    Routes: [ './src/routes/a.js', './src/routes/b.js' ],
  },
]
```
# 配置式路由
如果你倾向于使用配置式的路由，可以配置.umirc.(ts|js)或者config/config.(ts|js)配置文件中的routes属性，此配置项存在时则不会对src/pages目录做约定式的解析。
比如：
```
export default {
  routes: [
    { path: '/', component: './a' },
    { path: '/list', component: './b', Routes: ['./routes/PrivateRoute.js'] },
    { path: '/users', component: './users/_layout',
      routes: [
        { path: '/users/detail', component: './users/detail' },
        { path: '/users/:id', component: './users/id' }
      ]
    },
  ],
};
```
> 注意：component是相对于src/pages目录的
## 权限路由
umi的权限路由是通过配置路由的Routes属性来实现。约定式的通过yaml注释添加，配置式的直接配上即可。
比如有一下配置：
```
[
  { path: '/', component: './pages/index.js' },
  { path: '/list', component: './pages/list.js', Routes: ['./routes/PrivateRoute.js'] },
]
```
然后umi会用./routes/PrivateRoute.js来渲染/list。
`./routes/PrivateRoute.js`文件示例：
```
export default (props) => {
  return (
    <div>
      <div>PrivateRoute (routes/PrivateRoute.js)</div>
      { props.children }
    </div>
  );
}
```
## 路由动效(*) //TODO 暂未搞明白得练习一下
路由动效应该是有多种实现方式，这里举的https://github.com/reactjs/react-transition-group例子。
先安装依赖，
```
$ yarn add react-rransition-group
```
在layout组件（layouts/index.js或者pages子目录下的_layout.js）里在渲染子组件时使用TransitionGroup和CSSTransition包裹一层，并一location.pathname为key,
```
import withRouter from 'umi/withRouter';
import { TransitionGroup, CSSTransition } from "react-transition-group";

export default withRouter(
  ({ location }) =>
    <TransitionGroup>
      <CSSTransition key={location.pathname} classNames="fade" timeout={300}>
        { children }
      </CSSTransition>
    </TransitionGroup>
)
```
上面用到的fade样式，可以在src下的global.css里定义：
```css
.fade-enter {
  opacity: 0;
  z-index: 1;
}

.fade-enter.fade-enter-active {
  opacity: 1;
  transition: opacity 250ms ease-in;
}
```
## 面包屑
面包屑也是有多种实现方式，这里举https://github.com/icd2k3/react-router-breadcrumbs-hoc的例子。
先安装依赖，
```$ yarn add react-router-breadcrumbs-hoc ```
然后实现一个`Breadcrumbs.js`，比如：
```
import NavLink from 'umi/navlink';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';

// 更多配置请移步 https://github.com/icd2k3/react-router-breadcrumbs-hoc
const routes = [
  { path: '/', breadcrumb: '首页' },
  { path: '/list', breadcrumb: 'List Page' },
];

export default withBreadcrumbs(routes)(({ breadcrumbs }) => (
  <div>
    {breadcrumbs.map((breadcrumb, index) => (
      <span key={breadcrumb.key}>
        <NavLink to={breadcrumb.props.match.url}>
          {breadcrumb}
        </NavLink>
        {(index < breadcrumbs.length - 1) && <i> / </i>}
      </span>
    ))}
  </div>
));
```
然后在需要的地方引入此REACT组件即可。
## 启用Hash路由
umi默认是用的Browser History，如果需要用Hash History，需配置：
```
export default {
    history: 'hash',
}
```
## Scroll to top （返回到顶部）

在layout组件（layouts/index.js或者pages子目录下的_layout.js)的componentDitUpdate里决定是否scroll to top,比如：
```
import { Component } from 'react';
import withRouter from 'umi/withRouter';

class Layout extends Component {
    componentDitUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0,0);
        }
    }
    render() {
        return this.props.children;
    }
}

export default winthRouter(Layout);
```
## 参考（路由）
- https://reacttraining.com/react-router/