import Vue from 'vue';
import { ComponentOptions, VueDataKeys } from '../types';
export declare type VueConnections = Partial<Record<VueDataKeys, any>>;
declare type ParserResult = {
    data: VueConnections;
    instanceOptions?: ComponentOptions<Vue>;
};
export declare const initialParserResult: ParserResult;
export declare const extractInstanceData: (input: ComponentOptions<any>) => ParserResult;
export {};
