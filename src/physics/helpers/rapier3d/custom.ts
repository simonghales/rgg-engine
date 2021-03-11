import {AddBodyDef} from "./types";

export type CustomBodyModifiers = {
    [key: string]: (body: any) => void,
}

export const customData: {
    customBodyModifiers: CustomBodyModifiers,
} = {
    customBodyModifiers: {},
}

export const getCustomBodyModifier = (bodyDef: AddBodyDef) => {
    if (bodyDef.customBody && customData.customBodyModifiers[bodyDef.customBody]) {
        return customData.customBodyModifiers[bodyDef.customBody]
    }
    return undefined
}