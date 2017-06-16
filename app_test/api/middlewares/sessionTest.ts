/**
 * this middleware use commonjs module pattern
 */
import * as Koa from 'Koa';
import * as KoaSession from 'koa-session';

module.exports = async function (ctx : Koa.Context , next){
    ctx.session.count = ctx.session.count || 0;
    ctx.session.count ++;
    await next();
};