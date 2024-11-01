import axios from "axios"

// const HOST = "http://192.168.1.48:8000"
const HOST = "https://candientu.pythonanywhere.com/"

export const endpoints = {
    'scale': (userId) => `/api/users/${userId}/scales/`, // hiển thị user đó có bao nhiêu cân
    'scales': (scaleId) => `/api/scales/${scaleId}`, // hiển thị chi tiết thông tin cân
    'image': `/api/images/`, // hinh anh quang cao can

    'weightUser':(canId) =>`/weight_user/${canId}`,
    'weights':`/api/weights/`,  // tìm kiếm theo tên khách hàng và tên sản phẩm 
    'weight': (weightId) => `/api/weights/${weightId}`, // hiển thị thông tin chi tiết của 1 phiếu cân

    'StatsWeightMonth': (canId) => `/stats/count-weight-month/${canId}`, // số liệu cho biểu đồ tháng 
    'StatsWeightWeek': (canId, offset) => `/stats/count-weight-day-of-week/${canId}/${offset}`, // số liệu cho biểu đồ tuần

    'weightDetailMonth': (month, scaleId) => `/stats/weight-detail-month/${month}/${scaleId}`,  // có bao nhiêu phiếu cân trong 1 tháng 
    'weightDetailYear': (year, scaleId) => `/stats/weight-detail-year/${year}/${scaleId}`,
    'WeightWeekDetail': (year, month, day, canId) => `/stats/count-weight-of-day/${year}/${month}/${day}/${canId}`, // tìm kiếm theo ngày cụ thể 
    
    'SreachMonthYear': (year, month, type) => `/stats/count-weight-Month-Year/${year}/${month}/${type}`, // tìm kiếm theo năm tháng (cụ thể là tháng nào năm năo)
    'SreachFromDate': (yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo, canId) => `/stats/count-weight-from-time/${yearFrom}/${monthFrom}/${dayFrom}/${yearTo}/${monthTo}/${dayTo}/${canId}`, // tìm kiếm từ ngày đến ngày

    'GeneralWeek': (canId) => `/stats/general-week/${canId}`,
    'GeneralMonth': (month, canId) => `/stats/general-month/${month}/${canId}`,
    'GeneralDay': (year, month, day, canId) => `/stats/general-day/${year}/${month}/${day}/${canId}`,
    'GeneralFromDate': (yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo, canId) => `/stats/general-from-day/${yearFrom}/${monthFrom}/${dayFrom}/${yearTo}/${monthTo}/${dayTo}/${canId}`,

    'GeneralCustomer': (year, month, day, canId, custCode) => `/stats/get-customer-weight/${year}/${month}/${day}/${canId}/${custCode}`,
    'GeneralProduct': (year, month, day, canId, prodCode) => `/stats/get-product-weight/${year}/${month}/${day}/${canId}/${prodCode}`,

    'login': '/o/token/',
    'current-user': '/api/users/current-user/', // trạng thái user đã đăng nhập
    'register': '/api/users/',
    'check-username': '/check-username/',
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