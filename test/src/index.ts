import DiagramEngine from 'diagram-codes-engine-client'
 /* Set the path to the location of the engine web package.
           The unique engine url is provided when you register for an integration subscription.

           If required, the diagram rendering engine can also be self hosted
        */

window.addEventListener('DOMContentLoaded', () => {
   
})

//DiagramEngine.enginePath = 'https://web-engine-demo-dev.diagram.codes/'
DiagramEngine.enginePath = 'http://localhost:3000/'
console.log('DiagramEngine.enginePath', DiagramEngine.enginePath);

const btn = document.querySelector('#btn')
btn.addEventListener('click', async ()=>{

    //Render Diagram (Graph)
    const {iframe, instanceId} =  await DiagramEngine.init(document.querySelector('#container1'))

    console.log('diagram renderer initialized:', instanceId);
    
    let diagramParams = {
        container:'#container1',
        type:'mind-map',
        code:`
            "My Map"->b,c,d,e,random
            random->${Math.random()*1000}
        `,
        theme: {
            document: {
                backgroundColor:'lightgrey'
            }
        }
    }
    console.log('Calling renderDiagram')
    DiagramEngine.renderDiagram(diagramParams)
})

//Capture errors
DiagramEngine.setErrorHandler((errorData)=>{
    console.log(errorData.message);
    console.log(errorData.line);
})