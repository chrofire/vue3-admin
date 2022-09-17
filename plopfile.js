const useCrudTemplate = require('./plop/generators/crudTemplate')
const useCrudApiTemplate = require('./plop/generators/crudApiTemplate')

module.exports = (
    /** @type {import('plop').NodePlopAPI} */
    plop
) => {
    useCrudTemplate(plop)
    useCrudApiTemplate(plop)
}
