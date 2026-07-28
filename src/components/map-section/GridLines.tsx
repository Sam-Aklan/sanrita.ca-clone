
const GridLines = () => {
  return (
    <article className="c-home_grid-lines || grid col-1 row-1 relative z-10 w-full h-full pointer-events-none opacity-(--scroll-gridlines-opacity) desktop-only overflow-hidden">
        {/* vertical lines */}
         <div className="c-home_grid_v-lines || col-1 row-1 grid grid-cols-4 grid-rows-3  w-[calc(100%-55px*2)] mx-auto h-full">
            <div className="c-home_grid_v-line || row-span-3 col-span-1 flex justify-end opacity-40">
                <span className="inline-block w-px h-[calc(100%-40px)] translate-y-5 bg-forest-green"></span>
                </div>
                <div className="c-home_grid_v-line || row-span-3 col-start-2  flex justify-end opacity-40">
                    <span className="inline-block w-px h-[calc(100%-40px)] translate-y-5 bg-forest-green"></span>
                    </div>
                    <div className="c-home_grid_v-line || row-span-3 col-start-3  flex justify-end opacity-40"><span className="inline-block w-px h-[calc(100%-40px)] translate-y-5 bg-forest-green"></span></div></div>

        {/* horizontal lines */}
         <div className="c-home_grid_h-lines || col-1 row-1 grid grid-cols-4 grid-rows-3 w-[calc(100%-55px*2)] mx-auto h-full">
            <div className="c-home_grid_h-line || col-span-4 row-start-2 flex opacity-40">
                <span className="inline-block w-full h-px bg-forest-green"></span>
            </div>
            <div className="c-home_grid_h-line || col-span-4 row-start-3 flex opacity-40">
                <span className="inline-block w-full h-px bg-forest-green"></span>
            </div>
         </div>

    </article>
  )
}

export default GridLines