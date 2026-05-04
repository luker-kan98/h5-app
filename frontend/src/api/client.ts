import axios from 'axios'

const apiBaseURL =
  import.meta.env.VITE_API_BASE_URL ??
  (typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:8000`
    : '')

const client = axios.create({ baseURL: apiBaseURL })

export default client
