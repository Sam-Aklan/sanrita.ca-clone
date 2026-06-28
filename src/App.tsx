import { Canvas } from "@react-three/fiber";
import Scene from './components/Scene'

const App = () => {
	return (
		<div className=" text-white/95 w-full h-full text-2xl font-bold text-center bg-yellow-300">

		{/* <Canvas
		 gl={{antialias:true,alpha:true}}
        dpr={Math.min(window.devicePixelRatio,2)} 
        camera={{position:[0,0,0]}}
		>
			<Scene/>
		</Canvas> */}
		<div className="w-full h-full image-container flex justify-center items-center">
			<div className="w-100 md:w-75 h-auto image-wrapper">
				<img src="./man-wild.jpg" alt="" className="w-full h-full" />
			</div>

		</div>
			
		</div>
	);
};

export default App;
