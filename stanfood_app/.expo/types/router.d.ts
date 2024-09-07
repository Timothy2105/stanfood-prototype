/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(modal)/filter` | `/_sitemap` | `/filter`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
