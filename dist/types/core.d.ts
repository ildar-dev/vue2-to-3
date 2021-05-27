import { VueDataKeys } from './parser';
export declare type PropsType = '';
export declare type Noop = () => void;
export declare type MethodsType = Record<string, any>;
declare type DefaultData<V> = Record<string, any> | ((this: V) => Record<string, any>);
declare type DefaultProps = Record<string, any>;
declare type DefaultMethods<V> = {
    [key: string]: (this: V, ...args: any[]) => any;
};
declare type DefaultComputed = {
    [key: string]: any;
};
export interface ComputedOptions<T> {
    get?(): T;
    set?(value: T): void;
    cache?: boolean;
}
export declare type Accessors<T> = {
    [K in keyof T]: (() => T[K]) | ComputedOptions<T[K]>;
};
export declare type RecordPropsDefinition<T> = {
    [K in keyof T]: PropValidator<T[K]>;
};
export declare type PropValidator<T> = PropOptions<T> | PropType<T>;
export interface PropOptions<T = any> {
    type?: PropType<T>;
    required?: boolean;
    default?: T | null | (() => T | null | undefined);
    validator?(value: T): boolean;
}
export declare type Prop<T> = {
    (): T;
} | {
    new (...args: never[]): T & Record<string, any>;
} | {
    new (...args: string[]): () => void;
};
export declare type PropType<T> = Prop<T> | Prop<T>[];
export declare type ArrayPropsDefinition<T> = (keyof T)[];
export declare type PropsDefinition<T> = ArrayPropsDefinition<T> | RecordPropsDefinition<T>;
export declare type WatchHandler<T> = (val: T, oldVal: T) => void;
export interface WatchOptions {
    deep?: boolean;
    immediate?: boolean;
}
export interface WatchOptionsWithHandler<T> extends WatchOptions {
    handler: WatchHandler<T>;
}
export interface ComponentOptions<V, Data = DefaultData<V>, Methods = DefaultMethods<V>, Computed = DefaultComputed, PropsDef = PropsDefinition<DefaultProps>, Props = DefaultProps> {
    data?: Data;
    props?: PropsDef | Props;
    computed?: Accessors<Computed>;
    methods?: Methods;
    watch?: Record<string, WatchOptionsWithHandler<any> | WatchHandler<any> | string>;
    beforeCreate?(this: V): void;
    created?(): void;
    beforeDestroy?(): void;
    destroyed?(): void;
    beforeMount?(): void;
    mounted?(): void;
    beforeUpdate?(): void;
    updated?(): void;
    components?: any;
    inject?: any;
    provide?: any;
    name?: string;
}
export declare type KeysType = keyof ComponentOptions<any>;
export declare type InstanceDeps = Record<any, VueDataKeys>;
export {};
