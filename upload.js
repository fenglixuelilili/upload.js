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