class DiagramEngine {


    constructor(){

    }

    static setEnginePath(path){
        DiagramEngine.enginePath = path;
    }

    /*
      @container: CSS selector or DOM element
      @type: Diagram type identifier
      @code: Diagram Code
      @theme: Diagram Theme
    */
    static renderDiagram({container,type,code,theme}){
        if(!DiagramEngine.enginePath){
            throw new Error("Diagram Engine path not set, use DiagramEngine.setEnginePath('path-to-engine')")
        }
        let elem = typeof container === 'string' ? document.querySelector(container): container;
        initContainer(elem)
    }

    /* Creates an iframe inside the container
       The iframe will be 100% width and height of the container */
    static initContainer(elem){
        //Is already initialized? skip
        if(elem.querySelector('iframe[diagram-renderer]')){
            return;
        }

        //clear container
        elem.innerHTML = '';

        let iframe = document.createElement('iframe');
        iframe.style.width = "100%"
        iframe.style.height = "100%"
        iframe.style.border = "none";
        iframe.style.minWidth = "400px";
        iframe.style.minHeight = "400px";
        iframe.setAttribute('diagram-renderer',"")

        elem.appendChild(iframe)
    }
}


export default DiagramEngine
