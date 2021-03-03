import { Platform, StyleSheet } from "react-native";
import colors from "./colors";

const trace = false;
const headerStyles = StyleSheet.create({
    headerTitle: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        flex: 1,
        width: "100%",
        borderBottomWidth: 0,
        backgroundColor: trace ? "green" : colors.lightBlue,
        paddingRight: 0,
    },
    headersubTitleText: {
        //   width: "100%",
        fontSize: 16,
        color: colors.gray,
        marginTop: 28,
    },
    headerTitleText: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "left",
    },
    headerStyle: {
        shadowColor: "transparent",
        borderColor: "#222",
        backgroundColor: trace ? "red" : colors.backgroundColor,
        borderBottomWidth: 0,
        height: Platform.OS == "ios" ? 20 : 80,
        opacity: 1,

        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
    },
    headerTitleStyle: {
        height: Platform.OS == "ios" ? 50 : 50,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: trace ? "blue" : colors.lightBlue,
        fontWeight: "bold",
        fontSize: 24,
        color: "black",
        borderBottomWidth: 0,
    },
});

export default headerStyles;
