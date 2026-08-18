import type { Dispatch, JSX, SetStateAction,  } from "react"
import { cn } from "../../lib/utils"

const SidbarTab = ({keyLabel,isLink=false,isActive,IconNode,setActive,link,isDropDown=false}:{
  keyLabel:string, 
  IconNode:JSX.Element,
  isActive:boolean,
  setActive: Dispatch<SetStateAction<string>>,
  isLink?:boolean,
  link?:string,
  isDropDown?:boolean
}) => {
  if(isLink){
    return(
      <a href={link}  onClick={()=>setActive(keyLabel)} className="sidbar-tab">
        <div className="c-icon || inline-block group uppercase">
          <div className={cn("relative overflow-hidden  ",isDropDown?undefined:"before:-top-10 before:-left-[200px] before:h-[60px] before:z-30 before:bg-adventure-yellow before:opacity-70 before:rotate-40 before:transition-none group-hover:before:transition-all before:duration-800 before:ease-out   group-hover:before:left-[calc(100%+20px)] before:absolute before:w-30 before:filter-[blur(3px)]  before:bg-icy-blue before:undefined")}>

            <div className="flex items-center gap-12">
              <div>
                {IconNode}
              </div>
              <div className={cn("w-fit text-forest-green relative  after:absolute after:-bottom-0 after:left-0 after:w-0 after:h-px after:bg-forest-green after:transition-all after:duration-250 after:ease-out group-hover:after:w-full mobile:text-xs text-[8px]", isActive?"after:w-full":"after:w-0")}>
                {keyLabel}
              </div>
            </div>

          </div>

        </div>
      </a>
    )
  }else{
    return <div className="sidbar-tab c-icon || inline-block group capitalize" onClick={()=>setActive(keyLabel)}>
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