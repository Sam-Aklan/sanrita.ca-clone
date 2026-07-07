import { Canvas } from "@react-three/fiber";
import Scene from './components/Scene'
import HomePageWrapper from "./components/HomePageWrapper";
import { MapWrapper } from "./components/map-section/MapWrapper";
import MapPreferalMargins from "./components/map-section/MapPreferalMargins";
import GridLines from "./components/map-section/GridLines";

const App = () => {
	return (
		<div className=" text-white/95 w-full h-full text-2xl font-bold text-center">

		{/* <Canvas
		 gl={{antialias:true,alpha:true}}
        dpr={Math.min(window.devicePixelRatio,2)} 
        camera={{position:[0,0,0]}}
		>
			<Scene/>
		</Canvas> */}
		{/* main content */}
		<HomePageWrapper>
			<MapWrapper>
				<MapPreferalMargins/>
				<GridLines/>
			</MapWrapper>
		</HomePageWrapper>
			
		</div>
	);
};

export default App;
