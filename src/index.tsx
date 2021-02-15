import * as React from 'react';
import { createWorkerApp } from './createWorkerApp';
import Physics from './physics/Physics';
import PlanckApp from "./physics/helpers/planckjs/PlanckApp";
import PhysicsConsumer from './physics/PhysicsConsumer';
import PhysicsConsumerSyncMeshes from './physics/PhysicsConsumerSyncMeshes';
import { usePhysicsConsumerContext } from './physics/PhysicsConsumer.context';
import { usePlanckAppContext } from './physics/helpers/planckjs/PlanckApp.context';
import { useBody, useBodyApi, useOnFixedUpdate } from './physics/helpers/planckjs/hooks';
import { FixtureShape } from './physics/helpers/planckjs/types';

// Delete me
export const Thing = () => {
  return <div>the snozzberries taste like snozzberries</div>;
};


export {
  createWorkerApp,
  Physics,
  PlanckApp,
  PhysicsConsumer,
  PhysicsConsumerSyncMeshes,
  usePhysicsConsumerContext,
  usePlanckAppContext,
  useBody,
  useBodyApi,
  useOnFixedUpdate,
  FixtureShape,
}