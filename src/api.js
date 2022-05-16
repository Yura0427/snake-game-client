import axios from "axios";

const BASE_URL = 'http://localhost:5000/'

export const createCandidate = async (candidate) => {
    const {data} = await axios.post(`${BASE_URL}api/candidate`, candidate)
    return data
}
export const fetchCandidate = async () => {
    const {data} = await axios.get(`${BASE_URL}api/candidate`)
    return data
}
