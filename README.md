# Diagram Codes Engine Client Integration Library

Use this library to embed the Diagram Codes Engine into a Web Application.


## Install

yarn add diagram-codes-engine-bridge

## Usage

Import the module:

```
import diagramEngine from 'diagram-codes-engine-bridge'
```

Then, set the path to the engine. This is provided to you when registering
for an integration subscription.

For test purposes you can use this path: https://web-engine-demo-dev.diagram.codes/apirender/

```
diagramEngine.setEnginePath('engine path goes here')
```

```
diagramEngine.renderDiagram({
    container:"#someElementContainerSelector",
    type:'tree',
    code:'a->b,c,d'
})
```

The previous code will initialize the container and will render
the provided diagram (in this case a tree).

## Setting themes

Appearance can be modified to better fit with the host application styles.

```
diagramEngine.renderDiagram({
    container:"#someElementContainerSelector",
    type:'tree',
    code:'a->b,c,d',
    theme: {
        document: {
            backgroundColor: "#fff",
            shadowColor: "black",
            shadow: false,
        },
        nodes: {
            fontFamily: "Arial",
            fontSize: "16",
            textColor:'black',
            fillColor: "white",
            borderWidth: "2",
            borderColor: "black",
            borderRadius: 3,
            padding: 8,
        },
        labels: {
            fontFamily: "Arial",
            fontSize: "14",
            textColor:'black',
            fillColor: "white",
            borderWidth: "0",
            borderColor: "none",
            borderRadius: 0,
            padding: 4,
        },
        connectors: {
            color: "black",
            width: "2",
        }
    }
})
```

## Events

The engine provides the following events

- onError: If the diagram input text has an error

```
diagramEngine.renderDiagram({
    container:"#someElementContainerSelector",
    type:'tree',
    code:'a->b,c,d',
    onError: ({line}) => {
        
    }
})
```
