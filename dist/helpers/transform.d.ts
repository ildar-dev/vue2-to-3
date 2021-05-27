import { IComponentVariable } from '../types';
export declare const transformObjectToArrayWithName: (object: Record<string, unknown>) => Array<Omit<IComponentVariable, 'connections' | 'type'>>;
export declare const transformObjectToArray: (object: Record<string, unknown>) => Array<any>;
