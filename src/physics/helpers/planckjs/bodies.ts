import {BodyDef, Box, Circle, Shape, World} from "planck-js";
import {Fixtures, FixtureShape} from "./types";

const createFixtureShape = (shape: FixtureShape, args: any[]): Shape | null => {
    switch (shape) {
        case FixtureShape.Circle:
            return Circle(...args)
        case FixtureShape.Box:
            // @ts-ignore
            return Box(...args)
    }
    return null
}

export const createBody = (world: World, bodyDef: BodyDef, fixtures: Fixtures) => {
    const body = world.createBody(bodyDef)
    fixtures.forEach(({shape, args, fixtureOptions}) => {
        const fixtureShape = createFixtureShape(shape, args)
        if (fixtureShape) {
            body.createFixture(fixtureShape, fixtureOptions)
        }
    })
    return body
}