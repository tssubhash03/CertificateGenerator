//It allows the user to interact with and modify the properties of selected objects on the canvas, such as rectangles and circles.
//  The Settings component receives the canvas object as a prop and uses it to listen for events such as object selection, modification, and scaling. 
// It then updates the state of the selected object's properties (width, height, diameter, and color) based on user input. 
// The component also includes input fields for the user to change these properties, which are reflected in real-time on the canvas.
import { Input } from "blocksin-system";
import React, {useState, useEffect } from "react";
function Settings({canvas}) {    
    //selectedObject: Tracks the currently selected object on the canvas.
    // width, height, diameter, color: Store and manage the respective properties of the selected object. 
    // These are displayed in the settings panel and updated when the user modifies them.
    const [selectedObject, setSelectedObject] = useState(null);
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [diameter, setDiameter] =  useState("");
    const [color, setColor] =  useState("");

useEffect(() => {
    //Events handled:
        //selection:created: Triggered when a new object is selected.
        //selection:updated: Triggered when the selection changes to a different object.
        //selection:cleared: Triggered when no object is selected.
        // object:modified: Triggered after an object is resized, rotated, or moved.
        // object:scaling: Triggered when an object is being resized.
    if (canvas){
    canvas.on("selection:created", (event)=>
    { handleObjectSelection(event.selected[0]); 

    });
    canvas.on("selection:updated", (event) =>{ 
        handleObjectSelection(event.selected[0]); 
    });
    canvas.on("selection:cleared", ()=>{ 
        setSelectedObject(null); 
        clearSettings(); 
    });
    
    canvas.on("object:modified", (event)=>{
         handleObjectSelection(event.target); 
    });
    canvas.on("object:scaling", (event)=>{
         handleObjectSelection(event.target); 
    });
}
}, [canvas]);

const handleObjectSelection = (object) => {
    if (!object) return;

    setSelectedObject(object);

    if (object.type === "rect") {
        setWidth(Math.round(object.width*object.scaleX));
        setHeight(Math.round(object.height*object.scaleY));
        setColor(object.fill);
        setDiameter("");
    }
    else if (object.type === "circle") {
        setDiameter (Math.round(object.radius *2* object.scaleX));
        setColor(object.fill);
        setWidth("");
        setHeight("");
    }
}

const clearSettings = () => {
    setWidth("");
    setHeight("");
    setDiameter("");
    setColor("");
}

const handleWidthChange = (event) => {
    const value=event.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    setWidth(intValue);

    if (selectedObject && selectedObject.type==="rect" && intValue>= 0) {
    selectedObject.set({ width: intValue / selectedObject.scaleX });
    canvas.renderAll();
}

}
const handleHeightChange = (event) => {
    const value=event.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    setHeight(intValue);

    if (selectedObject && selectedObject.type==="rect" && intValue>= 0) {
    selectedObject.set({ height: intValue / selectedObject.scaleY});
    canvas.renderAll();
    }
}
const handleDiameterChange = (event) => {
    const value=event.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    setDiameter(intValue);

    if (selectedObject && selectedObject.type==="circle" && intValue>= 0) {
    selectedObject.set({ radius:intValue/2 / selectedObject.scaleX});
    canvas.renderAll();
    }
}
const handleColorChange = (event) => {
    const value=event.target.value;
    setColor(value);

    if (selectedObject) {
    selectedObject.set({ fill: value });
    canvas.renderAll();
}
}
   return (
    <div className="Settings darkmode">
        {selectedObject && selectedObject.type ==="rect" && (
            <>
                <Input 
                    fluid
                    label="Width"
                    value = {width}
                    onChange = {handleWidthChange}
                />
                <Input 
                    fluid
                    label="Height"
                    value = {height}
                    onChange = {handleHeightChange}
                />
                <Input 
                    fluid
                    type="color"//Color Picker
                    label="Color"
                    value = {color}
                    onChange = {handleColorChange}
                />
            </>
        )}
        {selectedObject && selectedObject.type ==="circle" && (
            <>
                <Input 
                    fluid
                    label="Diameter"
                    value = {diameter}
                    onChange = {handleDiameterChange}
                />
                <Input 
                    fluid
                    type="color"// Color Picker
                    label="Color"
                    value = {color}
                    onChange = {handleColorChange}
                />
            </>
        )}
    </div>
   );
}
export default Settings;

// Summary : 
    // Purpose: The Settings component provides an interface to edit shapes on a canvas dynamically.
    // State Management: Handles the properties of selected shapes (rect and circle).
    // Integration with Canvas: Listens to canvas events and updates the UI and canvas objects in real-time.