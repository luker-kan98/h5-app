import axios from 'axios'

const apiBaseURL = import.meta.env.VITE_API_BASE_URL ?? ''

const client = axios.create({ baseURL: apiBaseURL })

export default client
