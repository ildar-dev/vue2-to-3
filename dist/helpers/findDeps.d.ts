import { ConnectionsType, InstanceDeps, Noop } from '../types';
export declare const findDepsByString: (vueExpression: string, instanceDeps: InstanceDeps) => ConnectionsType | undefined;
export declare const findDeps: (vueExpression: Noop, instanceDeps: InstanceDeps) => ConnectionsType | undefined;
