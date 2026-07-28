import type React from "react"
import { CreativeStudio, Sidebar, Title } from "./SidebarSection"
import { DropDownBar } from "./DropDownMenu"


const HomePageWrapper = ({children}:{children?:React.ReactNode}) => {
  return (
    <main className="c-main  || font-mono relative w-full h-full min-h-dvh ">
			<div className="c-home-wrapper || bg-icy-blue w-full h-full ">
				<div className="grid w-full h-full">
					<aside className="overflow-clip grid grid-cols-[var(--scroll-aside-padding-40)_var(--scroll-aside-width)_1fr_var(--scroll-aside-width)_var(--scroll-aside-padding-40)] grid-rows-[var(--scroll-aside-padding-40)_var(--scroll-aside-padding-40)_1fr_1fr_calc(var(--scroll-aside-padding-40))] bg-sr-green-50 h-screen desktop-only col-1 row-1 relative z-20 pointer-events-none">
                        <Title/>
						<Sidebar/>
						<CreativeStudio/>
						<DropDownBar/>
					</aside>
		<section className="c-home_grid || absolute top-0 left-0 col-1 row-1 grid grid-cols-(--scroll-home-grid) w-full h-screen min-h-dvh page-home-module__mOmtjG__c-home_grid">
				{children}
		</section>
				</div>

			</div>
		</main>
  )
}

export default HomePageWrapper