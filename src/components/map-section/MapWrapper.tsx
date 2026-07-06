
const MapWrapper = ({children}:{children:React.ReactNode}) => {
  return (
    <div className="grid col-2 row-1 mobile:select-none">
        {children}
    </div>
  )
}

export  {MapWrapper}