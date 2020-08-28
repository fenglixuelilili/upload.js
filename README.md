## 自定义渲染上传过程的javascript文件上传工具库

> 不依赖任何第三方库 支持Promise 支持自定义渲染过程 支持终止传输 面向对象 轻量级的原生javascript函数库

&emsp;

### 基本使用

&emsp;

> 1.引入文件： upload.js (upload_fn.js为函数版本)

&emsp;

> 2.实例化： 对外暴露 Uploadfile类  实例化的时候传入input上传文件框对象

&emsp;

    let fileupload = new Uploadfile(document.querySelector('#file'))

&emsp;

> 3.调用上传：实例会有一个 upload 的方法，包含2个可选参数和1个必选参数
&emsp;

>   采用必选置后的原则，必选参数永远放到函数的参数的最后一位

&emsp;

> 可选参数1：自定义渲染函数 会有三个重要的参数 为 progress 进度(百分制),speed(速度),Company(速度单位)

&emsp;

>   可选参数2：上传完成回调

&emsp;

>   必选参数3：对象 或者 字符串，当是字符串的时候则是上传路径，当是对象的时候，name属性为文件对象的name属性 url为上传地址  其他属性则是文件上传过程中其他的数据

&emsp;

    <!-- 直接调用 -->
    fileupload.upload('/upload').then(data=>{
        console.log(data)
    }).then(data=>{
        console.log(data)
    })

&emsp;

    或者
    <!-- 使用配置对象 -->
    fileupload.upload({url:'/upload',name:'myfile'}).then(data=>{
        console.log(data)
    }).then(data=>{
        console.log(data)
    })

&emsp;

    或者
    <!-- 使用自定义渲染上传进度 -->
    fileupload.upload((progress,speed,Company)=>{
        // 自定义渲染html
        console.log('自定义渲染html')
        render(progress,speed,Company)
    }
    ,'/upload').then(data=>{
        console.log(data)
    })

&emsp;

    或者
    fileupload.upload((progress,speed,Company)=>{
        // 自定义渲染html
        console.log('自定义渲染html')
        render(progress,speed,Company)
    },
    ()=>{
        console.log('传输完成执行的回调')
    }
    ,'/upload').then(data=>{
        console.log(data)
    })

&emsp;

> 4.终止传输 使用实例上的stop方法 该方法依然支持传入可选参数 function 为停止上传之后的回调

&emsp;

    fileupload.stop(()=>{
        console.log('停止了')
    })
    
&emsp;

### 案例运行方法（需要node环境）：

&emsp;

* 
* 1.进入example目录
* 
* 2.下载依赖 npm i
* 
* 3.启动 node index
* 
* 4.访问 http://localhost:8080/

## 小结
### 菜鸟一个，大佬们多多批评指点 多谢了（给个start再走呗）
    