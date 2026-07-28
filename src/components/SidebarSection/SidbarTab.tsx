import type { Dispatch, JSX, SetStateAction,  } from "react"
import { cn } from "../../lib/utils"

const SidbarTab = ({keyLabel,isLink=false,isActive,IconNode,setActive}:{
  keyLabel:string, 
  IconNode:JSX.Element,
  isActive:boolean,
  setActive: Dispatch<SetStateAction<string>>,
  isLink?:boolean}) => {
  if(isLink){
    return(
      <a href="#"  onClick={()=>setActive(keyLabel)}>
        <div className="c-icon || inline-block group uppercase">
          <div className="relative overflow-hidden before:absolute before:-top-10 before:-left-[200px] before:w-30 before:h-[60px] before:filter-[blur(3px)] before:z-30 before:bg-adventure-yellow before:opacity-70 before:rotate-40  before:transition-none group-hover:before:transition-all before:duration-800 before:ease-out   group-hover:before:left-[calc(100%+20px)] before:bg-icy-blue before:undefined">

            <div className="flex items-center gap-12">
              <div>
                {IconNode}
              </div>
              <div className={cn("w-fit text-forest-green relative  after:absolute after:-bottom-0 after:left-0 after:w-0 after:h-px after:bg-forest-green after:transition-all after:duration-250 after:ease-out group-hover:after:w-full text-[12px]", isActive?"after:w-full":"after:w-0")}>
                {keyLabel}
              </div>
            </div>

          </div>

        </div>
      </a>
    )
  }else{
    return <div className="c-icon || inline-block group capitalize" onClick={()=>setActive(keyLabel)}>
      <div className="relative overflow-hidden before:undefined">
        <div className="flex items-center gap-12">
          <div>
            {IconNode}
          </div>
          <div className="w-fit text-forest-green relative text-[10px]">{keyLabel}</div>
        </div>
      </div>

    </div>
  }
}

export default SidbarTab