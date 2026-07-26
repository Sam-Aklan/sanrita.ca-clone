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


const disktopPins: PinData[] = [
  { id: 1, title: 'port', u: 0.588, v: 0.46, z:.9, radius: 0.1, color: 'blue' },
  { id: 2, title: 'harbour', u: 0.14, v: 0.39, z:.3, radius: 0.1, color: 'cyan', image:"./pics/fisher.jpg" },
  { id: 3, title: 'city', u: 0.7, v: 0.73, z: 1.5, radius: 0.1, color: 'pink', image:"./pics/hut.jpg" },
  { id: 4, title: 'mountain', u: 0.54, v: 0.245, z: .6, radius: 0.1, color: 'red', image:"./pics/viliage.jpg" },
  { id: 6, title: 'harbour', u: 0.14, v: 0.6, z:.3, radius: 0.1, color: 'black', image:"./pics/fisher.jpg" },
  { id: 7, title: 'mountain', u: 0.9, v: 0.2, z: 1., radius: 0.1, color: 'black', image:"./pics/viliage.jpg" },
  { id: 5, title: 'diving', u: 0.335, v: 0.13, z: .6, radius: 0.1, color: 'green', },
]
const mobilePins: PinData[] = [
 { id: 1, title: 'port', u: 0.605, v: 0.45, z:1., radius: 0.1, color: 'blue' },
  { id: 2, title: 'harbour', u: 0.14, v: 0.39, z:.2, radius: 0.1, color: 'cyan', image:"./pics/fisher.jpg" },
  { id: 3, title: 'city', u: 0.7, v: 0.73, z: 1.5, radius: 0.1, color: 'pink', image:"./pics/hut.jpg" },
  { id: 4, title: 'mountain', u: 0.54, v: 0.23, z: .5, radius: 0.1, color: 'red', image:"./pics/viliage.jpg" },
  { id: 5, title: 'diving', u: 0.31, v: 0.145, z: .45, radius: 0.1, color: 'green', },
   { id: 6, title: 'harbour', u: 0.14, v: 0.6, z:.3, radius: 0.1, color: 'black', image:"./pics/fisher.jpg" },
  { id: 7, title: 'mountain', u: 0.9, v: 0.2, z: 1., radius: 0.1, color: 'black', image:"./pics/viliage.jpg" },
]

export {disktopPins, mobilePins}