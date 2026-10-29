/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

export type { Route, Path } from './schema.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [[0,"/"]],
    types: placeholder as Registry['home']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/auth/signin',
    tokens: [[0,"auth"],[0,"signin"]],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/auth/signin',
    tokens: [[0,"auth"],[0,"signin"]],
    types: placeholder as Registry['session.store']['types'],
  },
  'panel': {
    methods: ["GET","HEAD"],
    pattern: '/panel',
    tokens: [[0,"panel"]],
    types: placeholder as Registry['panel']['types'],
  },
  'users.index': {
    methods: ["GET","HEAD"],
    pattern: '/pengguna',
    tokens: [[0,"pengguna"]],
    types: placeholder as Registry['users.index']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [[0,"logout"]],
    types: placeholder as Registry['session.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
