import {
  EPropertyType,
  IComponent,
  IComponentVariable,
  TId
} from '../helpers/types'

// export enum EPropertyType {
//   Method,
//   Data,
//   Hook,
//   Computed,
//   Provide,
//   Inject,
//   Watch
// }

// export interface IComponentVariable {
//   value: any
//   type: EPropertyType
//   connections?: string[]
// }

// export interface IComponent {
//   components?: string[]
//   name: string
//   props?: string[]
//   properties: IComponentVariable[]
// }

// export type InitialIComponent = Partial<IComponent>

interface IDFS {
  value:
    | {
        value: any
        type: EPropertyType
        connections: IDFS[]
      }
    | IComponentVariable
    | any
  id: TId
  visited: boolean
}

export const getComponents = (componentVue: IComponent): number[][] => { // ALHORITM KOSARAJU-SHARIR
  const n = componentVue.properties.length;
  let g: number[][] = new Array();
  let gr: number[][] = new Array();
  for(let i = 0; i < n; i++) {
    g[i] = new Array();
    gr[i] = new Array();
  }
  let order: number[] = [];
  let component: number[] = [];
  const components: number[][] = [];

  // console.log(componentVue.properties);
  
  componentVue.properties.forEach((v, a) => {
    let a1 = +a;
    v.connections?.forEach(function (c: TId) {
      const b = componentVue.properties.findIndex(_ => _.id === c);
      g[a1].push(b);

      gr[b].push(a1);
    })
  })
  
  

  let used = new Array();
  for(let i = 0; i < n; i++) {
    used[i] = false
  }



  const dfs1 = function (v: number) {
    used[v] = true;
    for(let i=0; i < g[v].length; ++i) {
      if (!used[g[v][i]]) {
        dfs1(g[v][i])
      }
    }
    order.push(v);
  }

  const dfs2 = function (v: number)  {
    used[v] = true;
    component.push(v);
    for(let i=0; i < gr[v].length; ++i) {
      if (!used[gr[v][i]]) {
        dfs2(gr[v][i])
      }
    }
  }

  for(let i = 0; i < n; ++i) {
    if (!used[i]) {
      dfs1(i);
    }
  }

  for(let i = 0; i < n; i++) {
    used[i] = false
  }

  for(let i = 0; i<n; ++i) {
    const v = order[i]; // cancel reverse
    if (!used[v]) {
      dfs2(v);
      components.push(component);
      component = [];
    }
  }

  return components;
}

export const divide = (componentVue: IComponent): IComponent[] => {
  console.log(componentVue);
  const components = getComponents(componentVue)
    .sort((c) => c.length)
    .map(c => {
    return {
      ...componentVue,
      properties: componentVue.properties.filter((_p, index) => c.includes(index)),
    }
  });

  return components
    .map((_, i) => {
      if (i === 0) {
        // general component
        return _;
      } else {
        return {
          components: [],
          name: `Composition${componentVue.name}${i}`,
          props: [],
          properties: _.properties
        }
      }
    })
}

