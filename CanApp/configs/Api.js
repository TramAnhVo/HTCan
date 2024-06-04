import axios from "axios"

const HOST = "http://192.168.1.25:8000"

export const endpoints = {
    'scale': (userId) => `/users/${userId}/scales/`,
    'weights': `/weight-list/`,
    'weight': (weightId) => `/weight-list/${weightId}`,
    'weight-detail': (scaleId) => `/scale/${scaleId}/weight_lists/`,

    'SumCountWeightToday': (scaleId) => `/stats/count-PhieuCan-day/${scaleId}`,
    'StatsWeightMonth': (canId) => `/stats/count-PhieuCan-month/${canId}`,
    'StatsWeightWeek': (canId) => `/stats/count-PhieuCan-day-of-week/${canId}`,

    'WeightWeekDetail': (year, month, day) =>`/stats/count-PhieuCan-of-day/${year}/${month}/${day}`,
    'SreachMonthYear': (year, month) =>`/stats/count-PhieuCan-Month-Year/${year}/${month}/`,
    'SreachForTime': (time) =>`/stats/count-PhieuCan-days/${time}/`,

    'login': '/o/token/',
    'current-user': '/users/current-user/',
    'register': '/users/',
    'update-user': (userId) => `/users/${userId}/`,
}

export const authApi = (accessToken) => axios.create({
    baseURL: HOST,
    headers: {
        "Authorization": `bearer ${accessToken}`
    }
})

export default axios.create({
    baseURL: HOST
})