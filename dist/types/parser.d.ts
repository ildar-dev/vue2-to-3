import { WatchOptionsWithHandler } from './core';
import { vue2ConnectionsValues } from '../helpers';
export declare type FieldName = {
    name: string;
};
export declare type WatcherItem<T = any> = Pick<WatchOptionsWithHandler<T>, 'handler'> & FieldName;
export declare enum EPropertyType {
    Method = "Method",
    Data = "Data",
    Hook = "Hook",
    Computed = "Computed",
    Provide = "Provide",
    Inject = "Inject",
    Watch = "Watch"
}
export declare type TId = string;
export declare type ConnectionsType = Array<TId>;
export declare type VueDataKeys = typeof vue2ConnectionsValues[number];
export interface IComponentVariable {
    value?: any;
    id: TId;
    name: string;
    type: EPropertyType;
    connections?: ConnectionsType;
}
export interface IComponent {
    components?: string[];
    name: string;
    props?: string[];
    properties: IComponentVariable[];
}
export declare type InitialIComponent = Partial<IComponent>;
