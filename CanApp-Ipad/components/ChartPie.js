import React from "react";
import { Dimensions, View } from "react-native";
import { PieChart } from "react-native-chart-kit";

export default CharPie = ({countIn, countOut}) => {
    const data = [
        {
            name: "Phiếu nhập",
            population: countIn,
            color: "rgba(131, 167, 234, 1)",
            legendFontColor: "black",
            legendFontSize: 15,
            legendConfig: {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            },
        },
        {
            name: "Phiếu xuất",
            population: countOut,
            color: "#33CC99",
            legendFontColor: "black",
            legendFontSize: 15,
            legendConfig: {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            },
        },
    ];

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    };

    return (
        <View>
            <PieChart
                data={data}
                width={Dimensions.get("window").width - 30}
                height={380}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"40"}
            />
        </View>
    )
}