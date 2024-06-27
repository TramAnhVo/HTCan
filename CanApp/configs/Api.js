import axios from "axios"

const HOST = "http://192.168.1.19:8000"
// const HOST = "https://candientu.pythonanywhere.com/"

export const endpoints = {
    'scale': (userId) => `/api/users/${userId}/scales/`, // hiển thị user đó có bao nhiêu cân
    'scales': (scaleId) => `/api/scales/${scaleId}`, // hiển thị chi tiết thông tin cân

    'weights': `/api/weights/`,  // tìm kiếm theo tên khách hàng và tên sản phẩm 
    'weight': (weightId) => `/api/weights/${weightId}`, // hiển thị thông tin chi tiết của 1 phiếu cân
    'weight-detail': (scaleId) => `/api/scales/${scaleId}/weight_lists/`,

    'StatsWeightMonth': (canId) => `/stats/count-weight-month/${canId}`, // số liệu cho biểu đồ tháng 
    'StatsWeightWeek': (canId, offset) => `/stats/count-weight-day-of-week/${canId}/${offset}`, // số liệu cho biểu đồ tuần

    'weightDetailMonth': (month, type, scaleId) => `/stats/weight-detail-month/${month}/${type}/${scaleId}`,  // có bao nhiêu phiếu cân trong 1 tháng 
    'weightDetailWeek': (year, month, day,type, scaleId ) => `/stats/weight-detail-week/${year}/${month}/${day}/${type}/${scaleId}`,

    'WeightWeekDetail': (year, month, day, type) => `/stats/count-weight-of-day/${year}/${month}/${day}/${type}`, // tìm kiếm theo ngày cụ thể 
    'SreachMonthYear': (year, month, type) => `/stats/count-weight-Month-Year/${year}/${month}/${type}`, // tìm kiếm theo năm tháng (cụ thể là tháng nào năm năo)
    'SreachForTime': (time, type) => `/stats/count-weight-days/${time}/${type}`, // tìm kiếm theo mốc thời gian xác định (từ ngày nào cho đến hiện tại)
    'SreachCategory': (num) => `/stats/count-weight-category/${num}/`, // tìm kiếm theo nhập hàng hay xuất hàng 
    'SreachFromDate': (yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo, type) => `/stats/count-weight-from-time/${yearFrom}/${monthFrom}/${dayFrom}/${yearTo}/${monthTo}/${dayTo}/${type}/`, // tìm kiếm từ ngày đến ngày

    'login': '/o/token/',
    'current-user': '/api/users/current-user/', // trạng thái user đã đăng nhập
    'register': '/api/users/',
    'update-user': (userId) => `/api/users/${userId}/`, // cập nhật thông tin user
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