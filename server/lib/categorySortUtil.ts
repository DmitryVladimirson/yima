export function sortRelativesByPosition<C extends Category>(categories: C[]): C[] {
  return categories.sort((cat1, cat2) => {
    if (cat1.position === undefined && cat2.position === undefined) {
      return cat1.name.localeCompare(cat2.name)
    }

    if (cat1.position === undefined) {
      return 1
    }

    if (cat2.position === undefined) {
      return -1
    }

    return cat1.position - cat2.position
  })
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
