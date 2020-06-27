class DiagramEngine {


    constructor(){

    }

    static setEnginePath(path){
        DiagramEngine.enginePath = path;
    }

    static setErrorHandler(cb){
        DiagramEngine.globalErrorHandler = cb;
    }

    /*
      @container: CSS selector or DOM element
      @type: Diagram type identifier
      @code: Diagram Code
      @theme: Diagram Theme
    */
    static async renderDiagram({container,type,code,theme}){
        if(!DiagramEngine.enginePath){
            throw new Error("Diagram Engine path not set, use DiagramEngine.setEnginePath('path-to-engine')")
        }
        let elem = typeof container === 'string' ? document.querySelector(container): container;
        if(!elem){
            throw new Error('Could not find container DOM element')
        }
        //wait until we receive the 'ready'  message from the engine
        //only the 1st time
        console.log('initContainer')
        const iframe = await DiagramEngine.initContainer(elem)
        console.log('initContainer ends', iframe)

        //send the render message to the engine
        iframe.contentWindow.postMessage({
            type:'render-diagram',
            data:{
                type,
                code,
                theme
            }
        }, '*')

    }

    /* Creates an iframe inside the container
       The iframe will be 100% width and height of the container */
    static async initContainer(elem){

        return new Promise((resolve)=>{
            //Is already initialized? skip
            let iframe = elem.querySelector('iframe[diagram-renderer]')
            if(iframe){
                 resolve(iframe);
                 return;
            }

            //clear container
            elem.innerHTML = '';

            iframe = document.createElement('iframe');
            iframe.style.width = "100%"
            iframe.style.height = "100%"
            iframe.style.border = "none";
            iframe.style.minWidth = "400px";
            iframe.style.minHeight = "400px";
            iframe.setAttribute('diagram-renderer',"")
            iframe.src = DiagramEngine.enginePath

            window.addEventListener('message', (ev)=>{
                if(ev.data && ev.data.type === 'diagram-render-engine-ready'){
                    resolve(iframe);
                }
            })
            elem.appendChild(iframe)
        })
    }
}

//Global error handler
window.addEventListener('message', (ev)=>{
    console.log('message', ev)
    if(ev.data && ev.data.type === 'diagram-render-error'){
        if(DiagramEngine.globalErrorHandler) {
            DiagramEngine.globalErrorHandler(ev.data);
        }
    }
})


export default DiagramEngine
