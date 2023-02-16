export interface ResolvedFieldInfo {
  fieldNodes: FieldNodes[]
}

interface FieldNodes {
  selectionSet: {
    selections: FieldNodes[]
  }
  name: {
    value: string
  }
}

export default function GetResolvedFieldsInEdgesAndNodes(info: ResolvedFieldInfo): Set<string> {
  const selectionSet = info?.fieldNodes[0]?.selectionSet?.selections

  const edgeFields = selectionSet.find((selection) => selection.name.value === 'edges')
  const nodeFields = edgeFields?.selectionSet.selections.find(
    (selection) => selection.name.value === 'node',
  )
  return new Set(nodeFields?.selectionSet.selections.map((selection) => selection.name.value))
}
