/**
 * 创建react路由
 * node端创建Router对象
 * 浏览器端则创建provider对象
 */
import * as React from "react";
import { IndexRoute, Router, Route, browserHistory } from "react-router";

import { createStore, combineReducers, applyMiddleware } from "redux";
import { render } from "react-dom";
import { Provider } from "react-redux";

/**
 * 创建node端react路由并保存在全局app.routers.router
 * @param routers 
 */
export default function createRouter(routers) {
  //app.decorators.view defined in util.decorators.ts
  const { ReduxAsyncConnect, asyncConnect, reducer } = app.decorators.view;
  app.routers = app.routers || {};
  app.routers.router = (
    <Router
      render={props => <ReduxAsyncConnect {...props} />}
      history={browserHistory}
    >
      {routers.map(router => {
        let component = app.pages[router.component];
        if (!component) {
          return console.log(`component ${router.component} not found`);
        }
        if (process.env.NODE_ENV != "production") {
          // var path = require('path').resolve(process.cwd(), 'views', 'pages', router.component);
          // if(require('fs').existsSync(path)){
          // delete require.cache[require.resolve(path)];
          // component = require(require.resolve(path)).default;
          // }
        }
        if (component.name != "Connect") {
          component = asyncConnect([{ key: "ctrl", promise: () => null }])(
            component
          );
        }
        if (component.childrenComponents) {
          return (
            <Route path={router.path} component={component}>
              <IndexRoute components={component.childrenComponents} />
            </Route>
          );
        } else {
          return <Route path={router.path} component={component} />;
        }
      })}
    </Router>
  );
}
/**
 * 参考 app_test/views/app.tsx :
 * 
 * var Provider = createProvider([
        require('../api/controllers/IndexController').default
    ],{
        cola : require('./pages/cola').default,
        simple : require('./pages/simple').default,
    });

    render(<Provider />, document.getElementById('app'))

 * @param controllers controller数组
 * @param views react page页面数组
 */
/* istanbul ignore next */
export function createProvider(controllers, views, reduxMiddlewares) {
  var reactRouters = [];
  const ROUTE_PREFIX = "$routes";
  for (const ctrl of controllers) {
    /* try { // 不知道什么原因，有时候Reflect.getMetadata会出错
            require('reflect-metadata');
            var routes = Reflect.getMetadata(ROUTE_PREFIX, ctrl);
        } catch (error) {}
        if (routes) {
            ctrl[ROUTE_PREFIX] = routes;
        }else { */
    var routes = ctrl[ROUTE_PREFIX];
    // }
    // 保存react-router所需要的component和path
    for (const {
      method,
      url,
      middleware,
      name,
      params,
      view,
      response
    } of routes) {
      if (view) {
        if (typeof view == "string") {
          var viewComponent = views && views[view];
          if (!viewComponent) {
            try {
              viewComponent = require(`${process.cwd()}/view/pages/${view}`)
                .default;
            } catch (error) {}
          }
          if (viewComponent) {
            reactRouters.push({
              component: viewComponent,
              path: url
            });
          } else {
            console.log(`view ${view} not found`);
          }
        } else {
          reactRouters.push({
            component: view,
            path: url
          });
        }
      }
    }
  }
  var { ReduxAsyncConnect, asyncConnect, reducer } = require("../../../client");
  // router.component._reducer为react-redux的自定义reducer
  var reducers = reactRouters.reduce((_reducer, router) => {
    _reducer.push(router.component._reducer || {});
    if (router.component.childrenComponents) {
      Object.keys(router.component.childrenComponents).forEach(child => {
        _reducer.push(
          router.component.childrenComponents[child]._reducer || {}
        );
      });
    }
    return _reducer;
  }, []);
  // 合并reducer，并使用页面的__data作为初始化数据
  var middleware = applyMiddleware.apply(
    null,
    Object.keys(reduxMiddlewares || {}).map(
      item => reduxMiddlewares[item]
    )
  );
  const store = createStore(
    combineReducers(Object.assign({ reduxAsyncConnect: reducer }, ...reducers)),
    (window as any).__data,
    middleware
  );
  return function() {
    return (
      <Provider store={store} key="provider">
        <Router
          render={props => <ReduxAsyncConnect {...props} />}
          history={browserHistory}
        >
          {reactRouters.map(router => {
            var component = router.component;
            if (component && component.name != "Connect") {
              component = asyncConnect([{ key: "ctrl", promise: () => null }])(
                component
              );
            }
            if (component.childrenComponents) {
              return (
                <Route key="route" path={router.path} component={component}>
                  <IndexRoute components={component.childrenComponents} />
                </Route>
              );
            } else {
              return (
                <Route key="route" path={router.path} component={component} />
              );
            }
          })}
        </Router>
      </Provider>
    );
  };
}
