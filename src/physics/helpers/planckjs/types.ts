import {BodyDef, FixtureOpt} from "planck-js";

export type Buffers = {
    positions: Float32Array;
    angles: Float32Array;
};

export enum FixtureShape {
    Circle = 'Circle',
    Box = 'Box',
}

export type Fixtures = {
    shape: FixtureShape,
    args: any[],
    fixtureOptions: Partial<FixtureOpt>,
}[]

export type AddBodyDef = {
    body: BodyDef,
    fixtures: Fixtures
}