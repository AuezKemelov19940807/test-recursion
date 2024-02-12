//mokky.dev
const api = 'https://71b1835fc914a19e.mokky.dev/services'

//title and price
const getTitleAndPrice = (item) => {
  const priceSuffix = item.price === 0 ? '' : ` ${item.price} руб`
  return `${item.name}${priceSuffix}`
}

//fetch data services
const fetchDataFromApi = async () => {
  try {
    const response = await axios.get(api)
    return response.data
  } catch (error) {
    console.error('Error fetching data from API:', error)
    return []
  }
}

//recursion
const buildTreeRecursive = (parentId, parentElement, items) => {
  const children = items.filter((item) => item.head === parentId)

  //sorthead sort
  children.sort((a, b) => a.sorthead - b.sorthead)

  if (children.length === 0) return

  const ul = document.createElement('ul')
  parentElement.appendChild(ul)

  for (let child of children) {
    const li = document.createElement('li')
    li.textContent = getTitleAndPrice(child)
    ul.appendChild(li)

    const hasChildren = items.some((item) => item.head === child.id)
    if (hasChildren) {
      li.classList.add('has-children')
      li.classList.add('hidden')
    }

    buildTreeRecursive(child.id, li, items)
  }
}

document.addEventListener('click', (event) => {
  const target = event.target
  if (target.classList.contains('has-children')) {
    const ul = target.querySelector('ul')
    if (ul) {
      ul.classList.toggle('active')
    }
    target.classList.toggle('active')
  }
})

const createTree = async () => {
  try {
    const items = await fetchDataFromApi()
    const treeElement = document.getElementById('tree')
    buildTreeRecursive(null, treeElement, items)
  } catch (error) {
    console.error('Error creating tree:', error)
  }
}

createTree()
