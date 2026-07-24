import type React from "react"
import { CreativeStudio, Sidebar, Title } from "../SidebarSection"
import { DropDownBar } from "../DropDownMenu"
import useWindowSize from "../../lib/hook/useWindowSize"
import CompassIcon from "../icons/CompassIcon"
import CompassComponent from "../map-section/CompassComponent"



const HomePageWrapper = ({children}:{children?:React.ReactNode}) => {
	const {isDesktop}= useWindowSize()
  return (
    <main className="c-main  || font-mono relative w-full h-full min-h-dvh ">
			<div className="c-home-wrapper || bg-icy-blue w-full mobile:h-full h-dvh">
				<div className="mobile:grid mobile:static w-full h-full relative">
					
                       { isDesktop?
					   <aside className="overflow-clip grid grid-cols-[var(--scroll-aside-padding-40)_var(--scroll-aside-width)_1fr_var(--scroll-aside-width)_var(--scroll-aside-padding-40)] grid-rows-[var(--scroll-aside-padding-40)_var(--scroll-aside-padding-40)_1fr_1fr_calc(var(--scroll-aside-padding-40))] bg-sr-green-50 h-screen desktop-only col-1 row-1 relative z-20 pointer-events-none">
						   <Title/>
							<Sidebar/>
							<CreativeStudio/>

							<CompassComponent/>

</aside>
					   :<>
					   <div className="mobile-only c-footer-mobile_home p-2 fixed bottom-0 left-0 z-40 pointer-events-none flex items-center w-full justify-between after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-75 after:bg-linear-to-t after:from-forest-green after:to-transparent after:z-10 after:backdrop-blur-[5px] after:mask-t-from-20% mobile:hidden">
							<div className="relative z-20 flex">

						<CreativeStudio/>
						<div className="w-20 h-20 -ml-2 my-auto">
							<CompassComponent/>
						</div>
							</div>
						</div>
						<DropDownBar/>
					   </>
					   }
						
		<section className="c-home_grid || absolute top-0 left-0 mobile:col-1 mobile:row-1 mobile:grid mobile:grid-cols-(--scroll-home-grid) w-full h-screen min-h-dvh page-home-module__mOmtjG__c-home_grid">
				{children}
		</section>
				</div>

			</div>
		</main>
  )
}

export default HomePageWrapper