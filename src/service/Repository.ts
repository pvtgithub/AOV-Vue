import axios from 'axios'

const urlDomain = "http://localhost:3000"
const urlBase = `${urlDomain}`
const token = ""

export default axios.create({
    baseURL: urlBase,
    headers: {"Authorization": "Bearer " + `${token}`}
})