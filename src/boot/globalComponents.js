export default async ({ Vue }) => {

  const requireComponent = require.context(
    // The relative path of the components folder
    '../components/base',
    // Whether or not to look in subfolders
    false,
    // The regular expression used to match base component filenames
    /Base[A-Z]\w+\.(vue|js)$/
  )
  
  requireComponent.keys().forEach(fileName => {
    // Get component config
    const componentConfig = requireComponent(fileName)
  
    // Get PascalCase name of component
    const componentName = toPascalCase(
      toCamelCase(
        // Strip the leading `./` and extension from the filename
        fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
      )
    )
    
    // Register component globally
    Vue.component(componentName, componentConfig.default || componentConfig)
  })


  function toPascalCase(str) {
    return `${str}`
      .replace(new RegExp(/[-_]+/, 'g'), ' ')
      .replace(new RegExp(/[^\w\s]/, 'g'), '')
      .replace(
        new RegExp(/\s+(.)(\w+)/, 'g'),
        ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
      )
      .replace(new RegExp(/\s/, 'g'), '')
      .replace(new RegExp(/\w/), s => s.toUpperCase());
  }
    
    function toCamelCase(str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
      }).replace(/\s+/g, '');
    }
}

