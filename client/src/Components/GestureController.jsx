import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as handpose from '@tensorflow-models/handpose';
import { MdOutlinePanTool, MdPanTool } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';

const GestureController = () => {
  const webcamRef = useRef(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isPinching, setIsPinching] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const modelRef = useRef(null);
  const requestRef = useRef(null);
  const cursorRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const pinchRef = useRef(false);
  const lastScrollYRef = useRef(null);

  // Initialize TFJS and Handpose
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        const model = await handpose.load({ maxContinuousChecks: 5, detectionConfidence: 0.8, iouThreshold: 0.3, scoreThreshold: 0.75 });
        modelRef.current = model;
        setIsModelLoaded(true);
        console.log("Handpose model loaded");
      } catch (error) {
        console.error("Error loading Handpose model", error);
      }
    };
    loadModel();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Detection loop
  const detect = async () => {
    if (
      modelRef.current &&
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4 &&
      isEnabled
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Get predictions
      const predictions = await modelRef.current.estimateHands(video);

      if (predictions.length > 0) {
        const hand = predictions[0];
        const landmarks = hand.landmarks;

        // 8 is index finger tip, 4 is thumb tip, 12 is middle finger tip, 0 is wrist
        const indexTip = landmarks[8];
        const thumbTip = landmarks[4];
        const middleTip = landmarks[12];
        const wrist = landmarks[0];

        // Map to screen coordinates (mirroring X axis)
        // Video is mirrored, so left hand moves left on screen.
        // We need to map [0, videoWidth] to [window.innerWidth, 0]
        const screenX = window.innerWidth - (indexTip[0] / videoWidth) * window.innerWidth;
        const screenY = (indexTip[1] / videoHeight) * window.innerHeight;

        // Smooth cursor movement (easing)
        cursorRef.current.x = cursorRef.current.x + (screenX - cursorRef.current.x) * 0.3;
        cursorRef.current.y = cursorRef.current.y + (screenY - cursorRef.current.y) * 0.3;

        setCursorPos({ x: cursorRef.current.x, y: cursorRef.current.y });

        // Calculate pinch (distance between thumb tip and index tip)
        const dx = thumbTip[0] - indexTip[0];
        const dy = thumbTip[1] - indexTip[1];
        const dz = thumbTip[2] - indexTip[2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        const pinchThreshold = 40; // Adjust if needed
        const currentlyPinching = distance < pinchThreshold;

        // Click Logic
        if (currentlyPinching && !pinchRef.current) {
          // Just started pinching -> trigger click
          setIsPinching(true);
          triggerClick(cursorRef.current.x, cursorRef.current.y);
        } else if (!currentlyPinching && pinchRef.current) {
          // Stopped pinching
          setIsPinching(false);
        }
        pinchRef.current = currentlyPinching;

        // Scroll Logic
        // If index and middle fingers are up (and close to each other), we scroll
        const indexMiddleDist = Math.sqrt(Math.pow(indexTip[0] - middleTip[0], 2) + Math.pow(indexTip[1] - middleTip[1], 2));
        const isScrollMode = indexMiddleDist < 40 && !currentlyPinching;

        if (isScrollMode) {
          if (lastScrollYRef.current !== null) {
            const scrollDelta = (cursorRef.current.y - lastScrollYRef.current) * 2; // Multiplier for speed
            window.scrollBy(0, scrollDelta);
          }
          lastScrollYRef.current = cursorRef.current.y;
        } else {
          lastScrollYRef.current = null;
        }

      } else {
        // No hand detected
        lastScrollYRef.current = null;
      }
    }

    if (isEnabled) {
      requestRef.current = requestAnimationFrame(detect);
    }
  };

  useEffect(() => {
    if (isEnabled) {
      requestRef.current = requestAnimationFrame(detect);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isEnabled, isModelLoaded]);

  const triggerClick = (x, y) => {
    const element = document.elementFromPoint(x, y);
    if (element) {
      console.log("AI Clicked on:", element);
      
      // Try native click first, which works better with React
      if (typeof element.click === 'function') {
        element.click();
      } else {
        const event = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y
        });
        element.dispatchEvent(event);
      }
      
      // If it's a focusable input, focus it
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.focus();
      }
    }
  };

  return (
    <>
      {/* Custom AI Cursor */}
      {isEnabled && (
        <div
          id="ai-cursor"
          className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,77,45,0.8)] pointer-events-none z-[9999] flex items-center justify-center transition-transform duration-75"
          style={{
            transform: `translate(${cursorPos.x - 16}px, ${cursorPos.y - 16}px) scale(${isPinching ? 0.7 : 1})`,
            backgroundColor: isPinching ? 'rgba(255, 77, 45, 0.5)' : 'rgba(255, 77, 45, 0.2)',
          }}
        >
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
      )}

      {/* Floating Toggle Button & Webcam Preview */}
      <div className="fixed bottom-6 right-6 z-[9998] flex flex-col items-end gap-4">
        {isEnabled && (
          <div className="w-48 h-36 bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-orange-500 relative">
            <Webcam
              ref={webcamRef}
              className="w-full h-full object-cover transform scale-x-[-1]"
              mirrored={true}
              videoConstraints={{ facingMode: "user" }}
            />
            <div className="absolute bottom-2 left-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm text-center">
              Pinch to click<br/>Two fingers to scroll
            </div>
          </div>
        )}

        <button
          onClick={() => setIsEnabled(!isEnabled)}
          disabled={!isModelLoaded}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl transition-all duration-300 font-bold ${
            !isModelLoaded
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isEnabled
              ? 'bg-red-500 text-white hover:bg-red-600 hover:-translate-y-1'
              : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-orange-500/30 hover:-translate-y-1'
          }`}
        >
          {!isModelLoaded ? (
            <>
              <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
              Loading AI...
            </>
          ) : isEnabled ? (
            <>
              <MdPanTool className="text-xl" />
              Stop AI Gestures
            </>
          ) : (
            <>
              <MdOutlinePanTool className="text-xl" />
              Enable AI Gestures
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default GestureController;
