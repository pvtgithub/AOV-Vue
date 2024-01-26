import axios from 'axios'

const urlDomain = "http://10.1.1.119:3000"
const urlBase = `${urlDomain}`
const token = ""

export default axios.create({
    baseURL: urlBase,
    headers: {"Authorization": "Bearer " + `${token}`}
})