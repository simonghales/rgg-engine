import React, {createContext, useContext} from "react"
import {Object3D} from "three";

type State = {
    prepareObject: (object: Object3D, props: any) => void,
}

const Context = createContext<State>(null as unknown as State)

export const usePhysicsConsumerHelpers = () => useContext(Context)

const PhysicsConsumerHelpers: React.FC<{
    prepareObject: (object: Object3D, props: any) => void,
}> = ({children, prepareObject}) => {
    return (
        <Context.Provider value={{prepareObject}}>
            {children}
        </Context.Provider>
    )
}

export default PhysicsConsumerHelpers