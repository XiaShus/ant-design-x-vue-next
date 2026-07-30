import type { Component } from 'vue';

export interface PathValue {
  path: string;
}

/** Literal string value object (v0.8 specific) */
export interface LiteralStringValue {
  literalString: string;
}

export interface ActionContext {
  [key: string]: PathValue | any;
}

export interface ActionEvent {
  name: string;
  context?: ActionContext;
}

export interface ActionConfig {
  event?: ActionEvent;
}

export interface BaseComponent_v0_9 {
  id: string;
  component: string;
  child?: string;
  children?: string[];
  [key: string]: any;
}

/** v0.8 children field: array or explicitList object */
export interface ExplicitList {
  explicitList: string[];
}

export interface ComponentWrapper_v0_8 {
  id: string;
  component: {
    [componentType: string]: {
      child?: string;
      children?: string[] | ExplicitList;
      [key: string]: any;
    };
  };
}

interface CreateSurfaceCommand {
  version: 'v0.9';
  createSurface: {
    surfaceId: string;
    catalogId: string;
  };
}

interface UpdateComponentsCommand {
  version: 'v0.9';
  updateComponents: {
    surfaceId: string;
    components: BaseComponent_v0_9[];
  };
}

interface UpdateDataModelCommand {
  version: 'v0.9';
  updateDataModel: {
    surfaceId: string;
    path: string;
    value: any;
  };
}

interface DeleteSurfaceCommand_v0_9 {
  version: 'v0.9';
  deleteSurface: {
    surfaceId: string;
  };
}

export type A2UICommand_v0_9 =
  | CreateSurfaceCommand
  | UpdateComponentsCommand
  | UpdateDataModelCommand
  | DeleteSurfaceCommand_v0_9;

export type XAgentCommand_v0_9 = A2UICommand_v0_9;

interface SurfaceUpdateCommand {
  surfaceUpdate: {
    surfaceId: string;
    components: ComponentWrapper_v0_8[];
  };
}

interface DataModelUpdateCommand {
  dataModelUpdate: {
    surfaceId: string;
    contents: Array<{
      key: string;
      valueString?: string;
      valueMap?: Array<{
        key: string;
        valueString: string;
      }>;
    }>;
  };
}

interface BeginRenderingCommand {
  beginRendering: {
    surfaceId: string;
    root: string;
  };
}

interface DeleteSurfaceCommand_v0_8 {
  deleteSurface: {
    surfaceId: string;
  };
}

export type A2UICommand_v0_8 =
  | SurfaceUpdateCommand
  | DataModelUpdateCommand
  | BeginRenderingCommand
  | DeleteSurfaceCommand_v0_8;

export type XAgentCommand_v0_8 = A2UICommand_v0_8;

export type A2UICommand = A2UICommand_v0_8 | A2UICommand_v0_9;

export interface ActionPayload {
  name: string;
  surfaceId: string;
  context: Record<string, any>;
}

export type ComponentName = `${Uppercase<string>}${string}`;

export interface BoxProps {
  components?: Record<string, Component<any>>;
  /**
   * Command queue — append new commands; Box processes them in order.
   * Supports A2UI v0.8 and v0.9 (auto-detected by `version` / command shape).
   */
  commands?: A2UICommand[];
  /**
   * Allowlist of catalog URLs/ids. Remote fetch is denied unless listed
   * (or catalogId starts with `local://`).
   */
  allowedCatalogIds?: string[];
  onAction?: (payload: ActionPayload) => void;
}

export interface CatalogComponent {
  type: 'object';
  properties?: Record<string, any>;
  required?: string[];
  [key: string]: any;
}

export interface Catalog {
  $schema?: string;
  $id?: string;
  title?: string;
  catalogId?: string;
  components?: Record<string, CatalogComponent>;
  [key: string]: any;
}

export interface ComponentTree {
  type: string;
  props: Record<string, any>;
  children?: string[];
}
