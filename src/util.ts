export function mapNodeList<E extends Element, T>(
  list: NodeListOf<E>,
  mapper: (ele: E) => T,
): T[] {
  const ary: T[] = []
  list.forEach((node) => {
    ary.push(mapper(node))
  })

  return ary
}
