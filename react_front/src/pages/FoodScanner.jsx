import { useEffect, useRef, useState } from "react";
import Navbar from "../components/NavBar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FoodScanner() {
  const canvasRef = useRef(null);
  const resultRef = useRef(null);
  const videoRef = useRef(null);
  const [status, setStatus] = useState("Procesando...");
  const [isPaused, setIsPaused] = useState(false);
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState(() => {
    const saved = localStorage.getItem("ingredientesDisponibles");
    return saved ? JSON.parse(saved) : [];
  });
  const lastProcessedRef = useRef(0);

  const resizeCanvas = () => {
    if (canvasRef.current) {
      const width = Math.min(window.innerWidth * 0.9, 500);
      canvasRef.current.width = width;
      canvasRef.current.height = width * 0.75;
      if (resultRef.current) {
        resultRef.current.style.width = `${width}px`;
        resultRef.current.style.height = `${width * 0.75}px`;
      }
    }
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    let stream;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        videoRef.current = document.createElement("video");
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        videoRef.current.onloadedmetadata = () => processFrame();
      } catch (err) {
        setStatus(`Error al acceder a la cámara: ${err.message}`);
      }
    };

    const processFrame = () => {
      if (isPaused || !videoRef.current || !canvasRef.current) return;

      const ctx = canvasRef.current.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      canvasRef.current.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("frame", blob, "frame.jpg");

        try {
          const response = await fetch("http://localhost:5000/video_feed", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error(`Error: ${response.status}`);
          const data = await response.json();

          // Convert hex image to blob
          const imageBytes = new Uint8Array(
            data.image.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
          );
          const blob = new Blob([imageBytes], { type: "image/jpeg" });
          resultRef.current.src = URL.createObjectURL(blob);
          setStatus("Detección en curso");

          const now = Date.now();
          if (now - lastProcessedRef.current < 2000) {
            setTimeout(processFrame, 100);
            return;
          }
          lastProcessedRef.current = now;

          data.ingredients.forEach((ingredient) => {
            const name = ingredient.name;
            if (name && !ingredientesDisponibles.includes(name)) {
              const toastId = `ingredient-${name}`;
              toast.info(
                <div className="flex flex-col space-y-2">
                  <p className="text-gray-800">
                    Se encontró: <span className="font-semibold">{name}</span> (Confianza: {(ingredient.confidence * 100).toFixed(1)}%)
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => toast.dismiss(toastId)}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        setIngredientesDisponibles((prev) => {
                          const newDisponibles = [...prev, name];
                          localStorage.setItem("ingredientesDisponibles", JSON.stringify(newDisponibles));
                          return newDisponibles;
                        });
                        toast.dismiss(toastId);
                      }}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      Agregar
                    </button>
                  </div>
                </div>,
                {
                  position: "top-right",
                  autoClose: 10000,
                  closeOnClick: false,
                  draggable: false,
                  toastId: toastId,
                }
              );
            }
          });

          setTimeout(processFrame, 100);
        } catch (err) {
          setStatus(`Error: ${err.message}`);
          setTimeout(processFrame, 1000);
        }
      }, "image/jpeg");
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isPaused, ingredientesDisponibles]);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <div className="min-w-[375px] flex flex-col items-center bg-[#F4F1DE] min-h-screen">
      <Navbar />
      <div className="w-full max-w-[500px] bg-transparent rounded-2xl shadow-2xl p-6 my-10 md:my-auto">
        <header className="text-center mb-6">
        </header>
        <main className="text-center">
          <div className="rounded-lg overflow-hidden bg-gray-200">
            <img
              ref={resultRef}
              alt="Cargando..."
              className="max-w-full h-auto block"
            />
          </div>
          <p className="text-black-400 text-lg mt-4">{status}</p>
        </main>
        <footer className="text-center mt-6">
          <button
            onClick={togglePause}
            className="bg-[#E07A5F] text-white px-6 py-3 text-lg rounded-md hover:bg-[#81B29A] hover:text-gray-900 transition-colors"
          >
            {isPaused ? "Reanudar" : "Pausar"}
          </button>
        </footer>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <ToastContainer />
    </div>
  );
}

export default FoodScanner;