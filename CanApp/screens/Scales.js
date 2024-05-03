import { ScrollView, StyleSheet, Text, View } from "react-native";

export default Scales = () => {
    return (
        <ScrollView>
            <View style={styles.ScalesItem}>
                <Text>Tên cân:</Text>
            </View>

            <View style={styles.ScalesItem}>
                <Text>Tên cân:</Text>
            </View>

            <View style={styles.ScalesItem}>
                <Text>Tên cân:</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    ScalesItem: {
        height: 100,
        backgroundColor: 'lightblue',
        margin: 13,
        borderRadius: 10
    }
});