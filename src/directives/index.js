const modules = import.meta.globEager(`./*.js`)

export default app => {
    Object.values(modules).map(item => item.default).forEach(directive => {
        if (directive.name) {
            app.directive(directive.name, directive)
        }
    })
}