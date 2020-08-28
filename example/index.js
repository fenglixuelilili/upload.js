// node.js
const Koa = require('koa')
const Koabody = require('koa-body')
const Static = require('koa-static')
const Router = require('koa-router')
const views = require('koa-views')
const fs = require('fs')
const app = new Koa()
app.use(Static(__dirname + '/static'))
app.use(Koabody({
    multipart:true
}))
app.use(views(__dirname+"/views",{extension:'pug'}));
const router = new Router()
router.get('/',async ctx=>{
    await ctx.render('upload.pug')
})
router.post('/upload',ctx=>{
    try {
        let temp = fs.readFileSync(ctx.request.files.file.path)
        fs.writeFileSync('imgs/' + ctx.request.files.file.name,temp)
        ctx.body = {
            state:1,
            message:'存储成功'
        }
    } catch (error) {
        ctx.body = {
            state:0,
            message:error
        }
    }
   
})
app.use(router.routes())
app.listen(8080)