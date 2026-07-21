type PinData = {
  id: number
  title: string
  u: number
  v: number
  z?: number
  radius?: number
  color?: string
  image?:string
}


const pins: PinData[] = [
  { id: 1, title: 'port', u: 0.588, v: 0.46, z: .25, radius: 0.1, color: 'blue' },
  { id: 2, title: 'harbour', u: 0.14, v: 0.39, z: 0.10, radius: 0.1, color: 'cyan', image:"./pics/fisher.jpg" },
  { id: 3, title: 'city', u: 0.7, v: 0.73, z: 0.35, radius: 0.1, color: 'pink', image:"./pics/hut.jpg" },
  { id: 4, title: 'mountain', u: 0.54, v: 0.245, z: 0.05, radius: 0.1, color: 'red', image:"./pics/viliage.jpg" },
  { id: 5, title: 'diving', u: 0.31, v: 0.16, z: -0.002, radius: 0.1, color: 'green', },
]

export {pins}