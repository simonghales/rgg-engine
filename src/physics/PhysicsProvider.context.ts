import {createContext, useContext} from "react";

type State = {}

export const Context = createContext(null as unknown as State)

export const usePhysicsContext = () => {
    return useContext(Context)
}