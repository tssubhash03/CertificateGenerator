import React, { useState, useEffect, useRef } from "react";
import { Image as FabricImage } from "fabric";
import { IconButton,Button } from "blocksin-system";
import { VideoCameraIcon } from "sebikostudio-icons";
// import "./styles.scss";

function Video({canvas, canvasRef}){
    const [videoSrc, setVideoSrc] = useState(null);
    const [fabricVideo, setFabricVideo] = useState(null);
    const [recordingChunks, setRecordingChunks] =  useState([]);
    const [isRecording, setIsRecording] =  useState(false);
    const [loadedPercentage, setLoadedPercentage] = useState(0);
    const [uploadMessage, setUploadMessage] = useState("");
    const [recordingTime, setRecordingTime] = useState(0);
    const [isPlaying, setIsPlaying] =  useState(false);
    const videoRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleVideoUpload= (event) => {
        const file = event.target.files[0];
        if (file) {
            setLoadedPercentage(0);
            setVideoSrc(null);
            setUploadMessage("");

            const url = URL.createObjectURL(file);
            setVideoSrc(url);

            const videoElement = document.createElement("video");
            videoElement.src = url;
            videoElement.crossOrigin = "anonymous";

            videoElement.addEventListener("loadeddata", () => {
                const videoWidth = videoElement.videoWidth;
                const videoHeight = videoElement.videoHeight;
                videoElement.width = videoWidth;
                videoElement.height = videoHeight;

                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;

                const scale = Math.min( 
                    canvasWidth / videoWidth, 
                    canvasHeight / videoHeight 
                );
                canvas.renderAll();

                const fabricImage= new FabricImage(videoElement, {
                    left: 0,
                    top: 0,
                    scaleX: scale,
                    scaleY: scale,
                });
                    setFabricVideo(fabricImage);
                    canvas.add(fabricImage);
                    canvas.renderAll();

                    setUploadMessage("Uploaded");
                    setTimeout(() => {
                        setUploadMessage("");
                    }, 3000);
            }); 
            videoElement.addEventListener("progress", ()=>{
                    if (videoElement.buffered.length > 0) {
                        const bufferedEnd = videoElement.buffered.end(
                        videoElement.buffered.length - 1
                    );
                    const duration = videoElement.duration;
                    if (duration > 0) {
                        setLoadedPercentage ((bufferedEnd / duration) * 100);
                    }
                }        
            });
            videoElement.addEventListener("error", (error) =>{
                console.error("Video load error:", error);
            });
            videoRef.current = videoElement;
        }
    }
    const handlePlayPauseVideo = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                videoRef.current.addEventListener("timeupdate", () => {
                fabricVideo.setElement(videoRef.current);
                canvas.renderAll();
            });
            setIsPlaying(true);
            } 
            else {
            videoRef.current.pause();
            setIsPlaying (false);
            }
        }
    };
    const handleStopVideo = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying (false);
            canvas.renderAll();
        }
    };
    const handleVideoUploadButtonClick = () => {
        fileInputRef.current.click();
    };
    return(
        <>
            <input 
                ref = {fileInputRef}
                type = "file"
                style={{display: "none"}}
                accept="video/mp4"
                onChange={handleVideoUpload}
            />
            <IconButton
            onClick = {handleVideoUploadButtonClick}
            variant = "ghost"
            size = "medium">
            <VideoCameraIcon/>
            </IconButton>
            {videoSrc && (
                <div className="bottom transform darkmode">
               
                <Button
                    onClick = {handlePlayPauseVideo}
                    variant="ghost"
                    size="medium"
                >
                    {isPlaying ? "Pause Video": "Play Video"}
                </Button>
                <Button onClick={handleStopVideo} variant="ghost" size="medium">
                    Stop
                </Button>
                
                </div>
            )}
        </>
    )
}
export default Video;