window.onload = function(){
    // 自定义渲染函数
    function render(progress,speed,Company){
        document.querySelector('#speed .progress progress').value = progress
        document.querySelector('#speed .progress span').innerHTML = progress + '%'
        document.querySelectorAll('#speed .speed span')[1].innerHTML =  speed + Company
    }
    // uploadFile(document.querySelector('#file'),
    //     (progress,speed,Company)=>{
    //         // 自定义渲染html
    //         console.log('自定义渲染html')
    //         render(progress,speed,Company)
    //     },{
    //         url:'/upload'
    //     }
    // ).then(data=>{
    //     console.log(data,'data')
    // })

    // uploadFile(document.querySelector('#file'),
        // (progress,speed,Company)=>{
        //     // 自定义渲染html
        //     console.log('自定义渲染html')
        //     render(progress,speed,Company)
        // },
    //     ()=>{
    //         // 传输结束回调
    //         // render(0,0,'kb/s')
    //     },
    //     '/upload'
    // ).then(data=>{
    //     console.log(data,'data')
    // })
    let fileupload = new Uploadfile(document.querySelector('#file'))
    fileupload.upload((progress,speed,Company)=>{
        // 自定义渲染html
        console.log('自定义渲染html')
        render(progress,speed,Company)
    }
    ,'/upload').then(data=>{
        console.log(data)
    })
    document.querySelector('#stop').addEventListener('click',function(){
        fileupload.stop(()=>{
            console.log('结束了,hahahahhahahha哈哈哈哈哈 我见听发哦了')
        })
    })
    // uploadFile(document.querySelector('#file'),{
    //     url:'/upload',
    //     firstname:'第一'
    // }).then(data=>{
    //     console.log(data,'data')
    // })

    // uploadFile(document.querySelector('#file'),'/upload').then(data=>{
    //     console.log(data,'data')
    // })
}
