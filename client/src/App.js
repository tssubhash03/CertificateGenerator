import "./styles.scss";
import './App.css';
import React ,{useEffect, useRef,useState} from "react"; //Allowing Fabric.js access the DOM element
import {Canvas,Rect,Circle} from 'fabric';
import {IconButton} from 'blocksin-system';
import {CircleIcon, SquareIcon} from 'sebikostudio-icons';
import Settings from "./Settings";
// import Video from "./Video";
import CanvasSettings from "./CanvasSettings";
import { handleObjectMoving,clearGuidelines } from "./snappingHelpers";
import undoRedoHelpers from "./undoRedoHelpers";

function App() {
  const canvasRef = useRef(null); //This References to canva element ,can manipulate the canva's Things in DOM.Useref is hook
  const [canvas,setCanvas] = useState(null);//Another hook for tracking values change in canva.
  //Upto here Canva is not initialized or setup then later update the State hook .
  const [guidelines,setGuidelines] = useState([]);//Another hook for tracking values change in guidelines.

  useEffect(()=>{//Runs once when the component is mounted
      if(canvasRef.current){
        const initCanvas =  new Canvas(canvasRef.current,{
          width : 500,
          height :500
        });
        initCanvas.backgroundColor = '#fff';
        initCanvas.renderAll();

        setCanvas(initCanvas);

        initCanvas.on('object:moving',(event)=>{
          handleObjectMoving(initCanvas,event.target,guidelines,setGuidelines);
        }
        );
        initCanvas.on('object:modified',()=>{
          clearGuidelines(initCanvas,guidelines,setGuidelines);
        }
        );
        return () =>{
          initCanvas.dispose();// If this page move to previous page clear the memory of this page 

        }
      }
  },[])
  const addRectangle = () =>{
    if (canvas){
      const rect = new Rect({
        width : 100,
        height : 100,
        fill : 'red',
        top : 100,
        left : 100
      });
      canvas.add(rect);
    }
  }
  const addCircle = () =>{
    if (canvas){
      const circle = new Circle({
        radius : 50,
        fill : 'blue',
        top : 100,
        left : 100
      });
      canvas.add(circle)
  }
}
  return (
    <div className="App">
      
      <div className="Toolbar darkmode">
        <IconButton onClick={addRectangle} variant = "ghost" size="medium">
          <SquareIcon/> 
        </IconButton>
        <IconButton onClick={addCircle} variant = "ghost" size="medium">
          <CircleIcon/> 
        </IconButton>
        {/* <Video canvas={canvas} canvasRef={canvasRef} /> */}
      </div>
      <canvas id ="canvas" ref={canvasRef}></canvas>
      <div className="SettingsWrapper">
        <CanvasSettings canvas = {canvas}/>
        <Settings canvas = {canvas}/>
        <undoRedoHelpers canvas = {canvas}/>

      </div>
    </div>
  );
}

export default App;
