export class LocalStorage {
    static setItem (key, value) {
        localStorage.setItem(key, JSON.stringify(value))
    }

    static getItem (key) {
        return JSON.parse(localStorage.getItem(key))
    }

    static removeItem (key) {
        localStorage.removeItem(key)
    }
}

export class SessionStorage {
    static setItem (key, value) {
        sessionStorage.setItem(key, JSON.stringify(value))
    }

    static getItem (key) {
        return JSON.parse(sessionStorage.getItem(key))
    }

    static removeItem (key) {
        sessionStorage.removeItem(key)
    }
}
