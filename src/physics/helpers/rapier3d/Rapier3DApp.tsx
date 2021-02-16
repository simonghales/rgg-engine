// import React, {useEffect, useState} from "react"
// // const RAPIER = import('@dimforge/rapier3d');
//
// // @ts-ignore
// global.document = {
//     // @ts-ignore
//     createElement: () => {}
// }
//
// // RAPIER.then(() => {
// //     console.log('SOMETHING?')
// // })
//
// const useRapier3dPhysics = () => {
//
//     const [world, setWorld] = useState(null)
//
//     useEffect(() => {
//         console.log('load rapier physics')
//
//         import('@dimforge/rapier3d').then((RAPIER) => {
//             console.log('loaded rapier physics...', RAPIER)
//         }).catch((error) => {
//             console.error(error)
//         })
//
//     }, [])
//
// }
//
// const Rapier3DApp: React.FC = () => {
//
//     useRapier3dPhysics()
//
//     return null
// }
//
// export default Rapier3DApp