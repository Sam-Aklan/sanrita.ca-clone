import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";

const App = () => {
	return (
		<div className=" text-white/95 w-full h-full text-2xl font-bold text-center">

		<Canvas
		 gl={{antialias:true,alpha:true}}
        dpr={Math.min(window.devicePixelRatio,2)} 
        camera={{position:[0,0,0]}}
		>
			<Scene/>
		</Canvas>
			
		</div>
	);
};

export default App;
