
# koa-cola
[![Build Status](https://travis-ci.org/hcnode/koa-cola.svg?branch=master)](https://travis-ci.org/hcnode/koa-cola)
[![Coverage Status](https://coveralls.io/repos/github/hcnode/koa-cola/badge.svg?branch=master)](https://coveralls.io/github/hcnode/koa-cola?branch=master)
[![npm](https://img.shields.io/npm/v/koa-cola.svg)](https://www.npmjs.com/package/koa-cola)

[koa-cola](http://www.koa-cola.com)是一个基于koa和react的服务器端SSR(server side render)和浏览器端的SPA(single page application)的web前后端全栈应用框架。

koa-cola使用typescript开发，使用d-mvc（es7 decorator风格的mvc）开发模式。另外koa-cola大量使用universal ("isomorphic") 开发模式，比如react技术栈完全前后端universal（server端和client端均可以使用同一套component、react-redux、react-router）。

## 特点
* SSR+SPA的完整方案，只需要一份react代码便可以实现：服务器端渲染＋浏览器端bundle实现的交互
* 使用koa作为web服务（使用node8可以使用最新的v8高性能原生使用async/await）
* 使用typescript开发
* 使用完整的react技术栈(包括react-router和react-redux)
* react相关代码前后端复用(包括component渲染、react-router和react-redux)


## 如何使用

koa-cola支持node.js的版本包括7.6和8，建议使用8，因为8.0使用的最新的v8版本，而且8.0会在[今年10月正式激活LTS](https://github.com/nodejs/LTS)，因为koa-cola的async/await是原生方式使用没有经过transform，所以不支持node7.6以下的node版本。

* `npm i koa-cola ts-node -g` 安装全局koa-cola和ts-node
* `koa-cola new koa-cola-app` 在当前文件夹创建名字为app的新koa-cola项目，创建完整的目录结构，并自动安装依赖
* `cd koa-cola-app`
* `koa-cola dev` dev模式启动，build webpack bundle、launch项目、并自动打开浏览器

视频演示：

<a href="http://www.koa-cola.com/doc/video/koa-cola-dev.mp4" target="_blank"><img src="http://www.koa-cola.com/doc/video/poster.png" width="500" /></a>


## 对比next.js

[next.js](https://github.com/zeit/next.js)是一个比较流行的也是基于react的SSR的应用框架，不过在react技术栈，next.js只支持component和react-router，并没有支持redux，在服务器端，也没有太多支持，比如controller层和express/koa中间件，服务器端只是支持简单的路由、静态页面等，koa-cola则是提供前后端完整的解决方案的框架。

在数据初始化，两者有点类似，next.js使用静态方法getInitialProps来初始化数据：
```javascript
import React from 'react'
export default class extends React.Component {
  static async getInitialProps ({ req }) {
    return req
      ? { userAgent: req.headers['user-agent'] }
      : { userAgent: navigator.userAgent }
  }
  render () {
    return <div>
      Hello World {this.props.userAgent}
    </div>
  }
}
```

koa-cola提供[两种方式](http://koa-cola.com/doc/tip1-react-init.html)来进行数据初始化，更加灵活。

而且，next.js不支持子组件的数据初始化：

> Note: getInitialProps can not be used in children components. Only in pages.

koa-cola则只需要加上装饰器 "include", 完全支持所有的子组件的数据初始化。

```javascript
import * as React from 'react';

var {
  Cola,
  include
} = require('koa-cola/client');
// Child1, Child2 是Cola的组件，并且会进行数据初始化
var Child1 = require('../components/child1').default;
var Child2 = require('../components/child2').default;

export interface Props {}
export interface States {}

@Cola({})
@include({
  Child1,
  Child2
})
class MultiChildren extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return <div>
        <Child1 {...this.props} />
        <Child2 {...this.props} />
      </div>
  }
}

export default MultiChildren;

```

koa-cola不但可以支持component的数据初始化，还可以合并page和component的reducer，使用同一个store，page和component的redux无缝结合。详细可参考[多子组件的redux页面例子源码](https://github.com/hcnode/koa-cola/blob/master/app_test/views/pages/multiChildren.tsx)和[在线Demo](http://koa-cola.com:3001/multiChildren)


## Examples
使用[官方react-redux的todolist](http://redux.js.org/docs/basics/UsageWithReact.html)作为基础，演示了官方的和基于koa-cola的例子（完整的mvc结构）

**demo依赖本地的mongodb**

[online demo](http://koa-cola.com:3000/)

使用方法：
* `npm i koa-cola ts-node typescript -g`
* `git clone https://github.com/koa-cola/todolist`
* `cd todolist`
* `npm i`
* `koa-cola dev`

更多详情请查看[官方文档](http://koa-cola.com/doc/index.html)

