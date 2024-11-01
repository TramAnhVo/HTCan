import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import CarouselCustomer from '../components/CarouselCustomer';
import Api, { endpoints } from "../configs/Api";

export default GeneralCustomer = ({ route }) => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const { yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo, value } = route.params;

    // Lấy dữ liệu từ API và gom nhóm sản phẩm
    const fetchData = async () => {
        try {
            const response = await Api.get(endpoints['SreachFromDate'](yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo, value));
            const groupedData = groupByProductCode(response.data);
            setGroups(groupedData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Kết thúc loading trong finally
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const groupByProductCode = (data) => {
        const groups = {};
        data.forEach((item) => {
            if (!groups[item.CustCode]) {
                groups[item.CustCode] = {
                    code: item.CustCode, nameProd: item.CustName, tickets: [], count: 0, total: 0,
                    phieuXuat: 0, phieuNhap: 0,
                    dateGroups: {}
                };
            }
            groups[item.CustCode].tickets.push(item);
            groups[item.CustCode].count++;
            groups[item.CustCode].total += item.Netweight;

            if (item.Trantype === 'Xuất hàng') {
                groups[item.CustCode].phieuXuat++;
            } else if (item.Trantype === 'Nhập hàng') {
                groups[item.CustCode].phieuNhap++;
            }

            if (!groups[item.CustCode].dateGroups[item.Date_in]) {
                groups[item.CustCode].dateGroups[item.Date_in] = {
                    count: 0, total: 0,
                    phieuXuat: 0, totalOut: 0,
                    phieuNhap: 0, totalIn: 0,
                    productGroups: {}
                };
            }

            groups[item.CustCode].dateGroups[item.Date_in].count++;
            groups[item.CustCode].dateGroups[item.Date_in].total += item.Netweight;
            if (item.Trantype === 'Xuất hàng') {
                groups[item.CustCode].dateGroups[item.Date_in].phieuXuat++;
                groups[item.CustCode].dateGroups[item.Date_in].totalOut += item.Netweight;
            } else if (item.Trantype === 'Nhập hàng') {
                groups[item.CustCode].dateGroups[item.Date_in].phieuNhap++;
                groups[item.CustCode].dateGroups[item.Date_in].totalIn += item.Netweight;
            }

            if (!groups[item.CustCode].dateGroups[item.Date_in].productGroups[item.ProdName]) {
                groups[item.CustCode].dateGroups[item.Date_in].productGroups[item.ProdName] = {
                    count: 0, total: 0,
                    phieuXuat: 0, totalOut: 0,
                    phieuNhap: 0, totalIn: 0,
                };
            }

            // Update product group information
            groups[item.CustCode].dateGroups[item.Date_in].productGroups[item.ProdName].count++;
            groups[item.CustCode].dateGroups[item.Date_in].productGroups[item.ProdName].total += item.Netweight;
            if (item.Trantype === 'Xuất hàng') {
                groups[item.CustCode].dateGroups[item.Date_in].productGroups[item.ProdName].phieuXuat++;
                groups[item.CustCode].dateGroups[item.Date_in].productGroups[item.ProdName].totalOut += item.Netweight;
            } else if (item.Trantype === 'Nhập hàng') {
                groups[item.CustCode].dateGroups[item.Date_in].productGroups[item.ProdName].phieuNhap++;
                groups[item.CustCode].dateGroups[item.Date_in].productGroups[item.ProdName].totalIn += item.Netweight;
            }
        });

        // Sắp xếp các sản phẩm theo thứ tự tăng dần dựa trên mã sản phẩm
        const sortedGroups = Object.values(groups).sort((a, b) => {
            const codeA = a.code.slice(2);
            const codeB = b.code.slice(2);
            return parseInt(codeA) - parseInt(codeB);
        });
        return sortedGroups;
    };

    const formatDate = (day, month, year) => {
        return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (groups.length > 0 && (
                <View style={{ flex: 1 }}>
                    <View style={styles.barTime}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 15, fontWeight: '700', color: 'white' }}>Từ ngày </Text>
                            <Text style={{ fontSize: 15, fontWeight: '700', color: 'white' }}>{formatDate(dayFrom, monthFrom, yearFrom)}</Text>
                        </View>

                        <AntDesign name="arrowright" size={20} color="white" />

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 15, fontWeight: '700', color: 'white' }}>Đến ngày </Text>
                            <Text style={{ fontSize: 15, fontWeight: '700', color: 'white' }}>{formatDate(dayTo, monthTo, yearTo)}</Text>
                        </View>
                    </View>

                    <CarouselCustomer
                        data={groups}
                        canId={value}
                    />
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },

    groupContainer: {
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 15,
        borderRadius: 10,
        borderWidth: 1
    },

    groupTitle: {
        color: 'blue',
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 8,
    },

    ticketContainer: {
        backgroundColor: '#fff',
        padding: 8,
        marginVertical: 4,
        elevation: 2,
    },

    detailButton: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },

    barTime: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#009966',
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
    }
});