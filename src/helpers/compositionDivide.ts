import { EPropertyType, IComponent, IComponentVariable, TId } from '../types'

// interface IDFS {
//   value:
//     | {
//         value: any
//         type: EPropertyType
//         connections: IDFS[]
//       }
//     | IComponentVariable
//     | any
//   id: TId
//   visited: boolean
// }

export const getComponents = (componentVue: IComponent): number[][] => {
  // ALHORITM KOSARAJU-SHARIR
  const n = componentVue.properties.length
  const g: number[][] = []
  const gr: number[][] = []
  for (let i = 0; i < n; i++) {
    g[i] = []
    gr[i] = []
  }
  const order: number[] = []
  let component: number[] = []
  const components: number[][] = []

  componentVue.properties.forEach((v, a) => {
    const a1 = +a
    v.connections?.forEach(function(c: TId) {
      const b = componentVue.properties.findIndex((property) => property.id === c)
      if (b == -1) {
        return
      }
      g[a1].push(b)

      gr[b].push(a1)
    })
  })

  const used: Array<boolean> = new Array(n)

  for (let i = 0; i < n; ++i) {
    used[i] = false
  }

  const dfs1 = function(v: number) {
    used[v] = true
    for (let i = 0; i < g[v].length; ++i) {
      if (!used[g[v][i]]) {
        dfs1(g[v][i])
      }
    }
    order.push(v)
  }

  const dfs2 = function(v: number) {
    used[v] = true
    component.push(v)
    for (let i = 0; i < gr[v].length; ++i) {
      if (!used[gr[v][i]]) {
        dfs2(gr[v][i])
      }
    }
  }

  used.forEach((v, i) => !v && dfs1(i))

  used.map((_) => false)

  for (let i = 0; i < n; ++i) {
    const v = order[i] // cancel reverse
    if (!used[v]) {
      dfs2(v)
      components.push(component)
      component = []
    }
  }

  return components
}

export const divide = (componentVue: IComponent, groupSingle = true): IComponent[] => {
  let components = getComponents(componentVue)

  if (groupSingle) {
    const singles: number[] = []
    components.forEach((c) => {
      if (c.length === 1) {
        singles.push(c[0])
      }
    })
    components = components.filter((c) => c.length > 1)
    components.push(singles)
  }

  const componentsVue = components
    .sort((c) => c.length)
    .map((c) => {
      return {
        ...componentVue,
        properties: componentVue.properties.filter((_, index) => c.includes(index))
      }
    })

  return componentsVue.map((component, i) => {
    if (i === componentsVue.length - 1) {
      // general component
      return component
    } else {
      let nameComposition = [...component.properties].sort((p) => p.name.length)[0].name
      nameComposition = nameComposition.charAt(0).toUpperCase() + nameComposition.slice(1)
      return {
        components: [],
        name: `Composition${ componentVue.name }${ nameComposition }`,
        props: [],
        properties: component.properties
      }
    }
  })
}
