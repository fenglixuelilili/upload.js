    /*
            file 传文件上传input元素节点
            data 传输文件中所带的数据 {} 对象格式  默认文件名字 是file,如果需要其他名字 使用name覆盖 上传地址 是url 可覆盖
            renderHtml 自定义渲染回调函数  函数参数分别为 progress进度,speed传输速度,Compan单位
            endfn 传输结束的回调
            配置莫尾原则
    */
    function uploadFile(file,renderHtml=function(){},endfn = function(){},data={name:'file',url:'/upload'}){
        const _arguments = arguments
        if(_arguments.length == 0){
            return uploadAjax
        }
        const upload = {
            fileEle:file,
            xhr:uploadFile.xhr
        }
        return new Promise((resolve,reject)=>{
            if(!file){
                console.error('请传入input对象')
                return reject('请传入input对象')
            }
            upload.fileEle.addEventListener('change',function(e){
                const fileobj = e.target.files[0]
                let form = new FormData()
                let _data = {}
                if(typeof _arguments[_arguments.length-1] == 'object' && _arguments.length > 1){
                    _data = _arguments[_arguments.length-1]
                    let keys = Object.keys(_data)
                    if(keys.indexOf('name') >= 0){
                        form.append(_data['name'],fileobj)
                    }else{
                        form.append('file',fileobj)
                    }
                    if(keys.indexOf('url') == -1){
                        console.error('请配置上传路径！')
                        return
                    }
                    for(let k in _data){
                        if(k!='name' && k!='url'){
                            form.append(k,_data[k])
                        }
                    }
                }else if(typeof _arguments[_arguments.length-1] == 'string' && _arguments.length > 1){
                    _data.url = _arguments[_arguments.length-1]
                    form.append('file',fileobj)
                }else{
                    console.error('请配置上传路径！')
                    return
                }
                uploadAjax({
                    url:_data.url,
                    multipal:true,
                    data:form
                }).then(data=>{
                    resolve(data)
                }).catch(error=>{
                    reject(error)
                })

            })
        })
        function uploadAjax({
            method='post',
            url,
            data={},
            multipal=false
        }){
            return new Promise((resolve,reject)=>{
                let xhr = upload.xhr
                if(method == 'get'){
                    let str = ''
                    for(let key in data){
                        str+=`${key}=${data[key]}`
                    }
                    xhr.open(method,url + '?' + str)
                    xhr.send()
                }
                if(method == 'post'){
                    if(!multipal){
                        xhr.open(method,url)
                        xhr.setRequestHeader('content-type','application/json')
                        xhr.send(JSON.stringify(data))
                    }else{
                        // 文件上传
                        xhr.open(method,url)
                        // xhr.setRequestHeader('content-type','multipart/form-data') //如果是formData对象 则不需要添加此行
                        let startTime = 0
                        let endTime = 0
                        let speed = 0
                        let currentsize = 0
                        let Company = 'b/s'
                        let progress = 0
                        xhr.upload.onloadstart = function(){
                            document.querySelector('#speed').style.display = 'block'
                            startTime = new Date().getTime()
                        }
                        xhr.upload.onprogress = function(e){
                            progress = (e.loaded/e.total * 100).toFixed(2)
                            endTime = new Date().getTime()
                            speed = (e.loaded - currentsize)/((endTime-startTime)/1000) //得出来的是 b/s
                            if(speed/(1024*1024*1024)>1){
                                speed = (speed/(1024*1024*1024)).toFixed(2)
                                Company = 'Gb/s'
                            }
                            if(speed/(1024*1024)>1){
                                speed = (speed/(1024*1024)).toFixed(2)
                                Company = 'Mb/s'
                            }
                            if(speed/1024>1){
                                speed = (speed/1024).toFixed(2)
                                Company = 'kb/s'
                            }
                            currentsize = e.loaded
                            startTime = new Date().getTime()
                            if(typeof _arguments[1] == 'function'){
                                renderHtml && renderHtml(progress,speed,Company)
                            }
                        }
                        xhr.upload.onload = function(){
                            if(typeof _arguments[2] == 'function'){
                                endfn && endfn()
                            }
                        }
                        xhr.upload.onabort = function(){
                            // alert('已终止操作')
                            // 终止操作
                            uploadFile.stopFn && uploadFile.stopFn()
                        }
                        xhr.upload.onloaded = function(){
                            console.log('最终都会进入的函数')
                        }
                        xhr.send(data)
                    }
                }
                xhr.onload = function(){
                    resolve(xhr.responseText)
                }
            })
        }
    }
    uploadFile.xhr = new XMLHttpRequest()
    uploadFile.stop = function(stop){
        uploadFile.stopFn = stop
        uploadFile.xhr.abort()
    }

    
    class Uploadfile {
        constructor(file = null){
            this._arguments = null
            this._con_arguments = arguments
            this.file = file
            this.xhr = new XMLHttpRequest()
            this.stopfn = null
        }
        upload(renderHtml=function(){},endfn = function(){},data={name:'file',url:'/upload'}){
            this._arguments = arguments
            return new Promise((resolve,reject)=>{
                if(!this.file){
                    console.error('请传入input框对象')
                    return reject('请传入input对象')
                }
                this.file.addEventListener('change',function(e){
                    const fileobj = e.target.files[0]
                    let form = new FormData()
                    let _data = {}
                    let _arguments = this._arguments
                    if(typeof _arguments[_arguments.length-1] == 'object' && _arguments.length >= 1){
                        _data = _arguments[_arguments.length-1]
                        let keys = Object.keys(_data)
                        if(keys.indexOf('name') >= 0){
                            form.append(_data['name'],fileobj)
                        }else{
                            form.append('file',fileobj)
                        }
                        if(keys.indexOf('url') == -1){
                            console.error('请配置上传路径！')
                            return
                        }
                        for(let k in _data){
                            if(k!='name' && k!='url'){
                                form.append(k,_data[k])
                            }
                        }
                    }else if(typeof _arguments[_arguments.length-1] == 'string' && _arguments.length >= 1){
                        _data.url = _arguments[_arguments.length-1]
                        form.append('file',fileobj)
                    }else{
                        console.error('请配置上传路径！')
                        return
                    }
                    this.uploadAjax({
                        url:_data.url,
                        multipal:true,
                        data:form
                    }).then(data=>{
                        resolve(data)
                    }).catch(error=>{
                        reject(error)
                    })
    
                }.bind(this))
            })
        }
        uploadAjax({
            method='post',
            url,
            data={},
            multipal=false
        }){
            return new Promise((resolve,reject)=>{
                let xhr = this.xhr
                if(method == 'get'){
                    let str = ''
                    for(let key in data){
                        str+=`${key}=${data[key]}`
                    }
                    xhr.open(method,url + '?' + str)
                    xhr.send()
                }
                if(method == 'post'){
                    if(!multipal){
                        xhr.open(method,url)
                        xhr.setRequestHeader('content-type','application/json')
                        xhr.send(JSON.stringify(data))
                    }else{
                        // 文件上传
                        xhr.open(method,url)
                        // xhr.setRequestHeader('content-type','multipart/form-data') //如果是formData对象 则不需要添加此行
                        let startTime = 0
                        let endTime = 0
                        let speed = 0
                        let currentsize = 0
                        let Company = 'b/s'
                        let progress = 0
                        xhr.upload.onloadstart = function(){
                            document.querySelector('#speed').style.display = 'block'
                            startTime = new Date().getTime()
                        }
                        xhr.upload.onprogress = function(e){
                            progress = (e.loaded/e.total * 100).toFixed(2)
                            endTime = new Date().getTime()
                            speed = this.getCompany((e.loaded - currentsize)/((endTime-startTime)/1000)).speed
                            Company = this.getCompany((e.loaded - currentsize)/((endTime-startTime)/1000)).Company
                            currentsize = e.loaded
                            startTime = new Date().getTime()
                            if(typeof this._arguments[0] == 'function'){
                                this._arguments[0] && this._arguments[0](progress,speed,Company)
                            }
                        }.bind(this)
                        xhr.upload.onload = function(){
                            if(typeof this._arguments[1] == 'function'){
                                this._arguments[1] && this._arguments[1]()
                            }
                        }.bind(this)
                        xhr.upload.onabort = function(){
                            this.stopfn && this.stopfn()
                        }.bind(this)
                        xhr.upload.onloaded = function(){
                            console.log('最终都会进入的函数')
                        }
                        xhr.send(data)
                    }
                }
                xhr.onload = function(){
                    resolve(xhr.responseText)
                }
            })
        }
        getCompany(speed){
            if(speed/(1024*1024*1024)>1){
                return {
                    speed:(speed/(1024*1024*1024)).toFixed(2),
                    Company:'Gb/s'
                }
            }
            if(speed/(1024*1024)>1){
                return {
                    speed:(speed/(1024*1024)).toFixed(2),
                    Company:'Mb/s'
                }
            }
            if(speed/1024>1){
                return {
                    speed:(speed/1024).toFixed(2),
                    Company: 'kb/s'
                }
            }
            return {
                speed:speed.toFixed(2),
                Company: 'b/s'
            }
        }
        stop(stop){
            if(stop&&typeof stop == 'function'){
                this.stopfn = stop
            }
            this.xhr.abort()
        }
    }
    