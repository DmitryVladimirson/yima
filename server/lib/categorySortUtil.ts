export function sortRelativesByPosition<C extends Category>(categories: C[]): C[] {
  return categories[0]?.position === undefined
    ? categories.sort((cat1, cat2) => cat1.name.localeCompare(cat2.name))
    : categories.sort((cat1, cat2) => cat1.position! - cat2.position!)
}

export function deepSortRelativesByPosition<C extends Category>(categories: C[]): C[] {
  categories = sortRelativesByPosition(categories)
  for (const category of categories) {
    if (category.children === undefined) {
      continue
    }

    if (category.children.length === 0) {
      continue
    }

    category.children = deepSortRelativesByPosition(category.children)
  }

  return categories
}
