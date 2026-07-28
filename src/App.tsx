import { Canvas } from "@react-three/fiber";
import Scene from './components/Scene'
import HomePageWrapper from "./components/HomePageWrapper";

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
		{/* main content */}
		<HomePageWrapper>
			
		</HomePageWrapper>
			
		</div>
	);
};

export default App;
