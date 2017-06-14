import * as Koa from 'Koa';

export default async function disabledMiddleware(ctx : Koa.Context, next : any){
    ctx.state.middlewareOrders = ctx.state.middlewareOrder || [];
    ctx.state.middlewareOrders.push('disabledMiddleware');
    await next();
    if(ctx.url == '/disabledMiddleware'){
        ctx.body = ctx.state.middlewareOrders.join('-');
    }

}