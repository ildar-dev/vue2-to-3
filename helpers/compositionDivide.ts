export enum EPropertyType {
  Method,
  Data,
  Hook,
  Computed,
  Provide,
  Inject,
  Watch
}

export interface IComponentVariable {
  value: any
  type: EPropertyType
  connections?: string[]
}

export interface IComponent {
  components?: string[]
  name: string
  props?: string[]
  properties: IComponentVariable[]
}

export type InitialIComponent = Partial<IComponent>

interface IDFS {
  value:
    | {
        value: any
        type: EPropertyType
        connections: IDFS[]
      }
    | IComponentVariable
    | any
  id: number
  visited: boolean
}

export const divide = (componentVue: IComponent): IComponent[] => {
  const propertiesFlat = componentVue.properties.map((_, id) => ({ value: _, id, visited: false }))
  const properties: IDFS[] = propertiesFlat.map((_) => ({
    ..._,
    value: {
      ..._.value,
      connections: _.value.connections.map((c) => propertiesFlat.find((flat) => flat.value === c))
    }
  }))
  const propertiesT: IDFS[] = properties.map((_) => {
    const result = _
    result.value.connections = []
    return { ...result }
  })

  properties.forEach((p) => {
    // transpolation
    p.value.connections.forEach((c) => {
      propertiesT.find((_) => _.id === c.id).value.connections.push(p)
    })
  })

  const order: IDFS[] = []
  let component: IDFS[] = []
  const components: IDFS[][] = []

  const dfs1 = (property: IDFS) => {
    properties[property.id].visited = true
    property.value.connections.forEach((c) => {
      const finded = properties.find((_) => (_.id = c.id))
      if (finded && !finded?.visited) {
        dfs1(finded)
      }
      order.push(property)
    })
  }

  const dfs2 = (propertyT: IDFS) => {
    properties[propertyT.id].visited = true
    component.push(propertyT)
    propertyT.value.connections.forEach((c) => {
      const finded = propertiesT.find((_) => (_.id = c.id))
      if (finded && !finded?.visited) {
        dfs2(finded)
      }
    })
  }

  properties.forEach((_) => {
    if (!_.visited) {
      dfs1(_)
    }
  })

  order.reverse().forEach((_) => {
    if (!_.visited) {
      dfs2(_)
      components.push([...component])
      component = []
    }
  })

  return components
    .sort((_) => _.length)
    .map((_, i) => {
      if (i === 0) {
        // general component
        return {
          ...componentVue,
          properties: _.map((p) => p.value)
        }
      } else {
        return {
          components: [],
          name: `Composition${componentVue.name}${i}`,
          props: [],
          properties: _.map((p) => p.value)
        }
      }
    })
}
