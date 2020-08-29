class DiagramEngine {
    constructor() {}

    static setEnginePath(path) {
        DiagramEngine.enginePath = path;
    }

    static setErrorHandler(cb) {
        DiagramEngine.globalErrorHandler = cb;
    }

    /*
      @container: CSS selector or DOM element
      @type: Diagram type identifier
      @code: Diagram Code
      @theme: Diagram Theme
    */
    static renderDiagram({ container, type, code, theme }) {
        return new Promise((resolve, reject) => {
            if (!DiagramEngine.enginePath) {
                throw new Error(
                    "Diagram Engine path not set, use DiagramEngine.setEnginePath('path-to-engine')"
                );
            }
            let elem =
                typeof container === "string"
                    ? document.querySelector(container)
                    : container;
            if (!elem) {
                throw new Error("Could not find container DOM element");
            }
            //wait until we receive the 'ready'  message from the engine
            //only the 1st time
            const iframe = container.querySelector("iframe[diagram-renderer]");
            if (!iframe) {
                throw new Error(
                    "Please call DiagramEngine.init(container) to initialize the engine first"
                );
            }

            const handlerDone = (ev) => {
                resolve();
            };

            //Registrar handler para evento 'render-finished'
            DiagramEngine.addMessageHandler(
                "diagram-render-finished",
                iframe,
                handlerDone,
                true
            );

            //send the render message to the engine
            iframe.contentWindow.postMessage(
                {
                    type: "render-diagram",
                    data: {
                        type,
                        code,
                        theme,
                    },
                },
                "*"
            );
        });
    }

    /* Creates an iframe inside the container
       The iframe will be 100% width and height of the container */
    static async init(elem) {
        return new Promise((resolve) => {
            //Is already initialized? skip
            let iframe = elem.querySelector("iframe[diagram-renderer]");
            if (iframe) {
                iframe.remove();
            }

            //clear container
            elem.innerHTML = "";

            iframe = document.createElement("iframe");
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.border = "none";
            iframe.style.minWidth = "400px";
            iframe.style.minHeight = "400px";
            iframe.setAttribute("diagram-renderer", "");
            iframe.setAttribute("ready", "false");
            iframe.src = DiagramEngine.enginePath;

            /* Creamos handler para esperar mensaje de ready del engine
               cuando llegue resolvemos la promesa.
               Sólo cuando recibimos el evento ready se cumple
               la promesa
            */
            const handler = (ev) => {
                if (ev.data && ev.data.type === "diagram-render-engine-ready") {
                    iframe.setAttribute("ready", "true");
                    resolve(iframe);
                }
            };

            DiagramEngine.addMessageHandler(
                "diagram-render-engine-ready",
                iframe,
                handler,
                true
            );
            elem.appendChild(iframe);
        });
    }

    static getSvg({ container }) {
        return new Promise((resolve) => {
            const iframe = container.querySelector("iframe[diagram-renderer]");
            if (!iframe) {
                throw new Error(
                    "Please call DiagramEngine.init(container) to initialize the engine first"
                );
            }

            const handler = (ev) => {
                console.log("getSvg handler ev:", ev);
                resolve(ev.data);
            };
            //Register the handler for the response (with once=true)
            DiagramEngine.addMessageHandler(
                "rendered-svg-response",
                iframe,
                handler,
                true
            );

            //send request to return the svg
            iframe.contentWindow.postMessage(
                {
                    type: "request-rendered-svg",
                },
                "*"
            );
        });
    }

    /*  El padre puede recibir mensajes de diferentes iframes
        usamos esta lista de handlers para que podamos ejecutar 
        codigo sólo para mensajes de un iframe especifico */

    static addMessageHandler(eventName, iframe, cb, once = false) {
        DiagramEngine.handlers.push({ eventName, iframe, cb, once });
    }
}

/* Llamamos el handler del iframe apropiado */
window.addEventListener("message", (ev) => {
    if (ev.data && ev.data.type) {
        let handler = DiagramEngine.handlers.find((h) => {
            //Verificar si el ifram del handler corresponde
            //con la fuente de este evento
            return (
                h.eventName === ev.data.type &&
                h.iframe.contentWindow === ev.source
            );
        });

        //Si hay un handler registrado para el iframe y el evento lo llamamos
        //Si es un handler "once" lo quitamos de la lista
        if (handler) {
            handler.cb(ev);
            if (handler.once) {
                const ix = DiagramEngine.handlers.indexOf(handler);
                DiagramEngine.handlers.splice(ix, 1);
            }
        }

        //Ver si es un error para ejecutar el handler de error global
        if (ev.data && ev.data.type === "diagram-render-error") {
            if (DiagramEngine.globalErrorHandler) {
                DiagramEngine.globalErrorHandler(ev.data);
            }
        }
    }
});

//Global error handler
// window.addEventListener('message', (ev)=>{
//     console.log('message', ev)
//     if(ev.data && ev.data.type === 'diagram-render-error'){
//         if(DiagramEngine.globalErrorHandler) {
//             DiagramEngine.globalErrorHandler(ev.data);
//         }
//     }
// })

DiagramEngine.handlers = [];

export default DiagramEngine;
