import { Platform, StyleSheet } from "react-native";
import colors from "./colors";

const blockStyles = {
    backgroundColor: colors.lightBlue,
    borderRadius: 14,
    marginBottom: 16,
};

const iconContainer = {
    width: 32,
    height: 32,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
};

const commonStyles = StyleSheet.create({
    blockStyles: {
        ...blockStyles,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    },
    h1: {
        fontSize: 28, // 3 * designSize
        lineHeight: 28,
        fontWeight: "700",
        color: colors.black,
    },
    h2: {
        fontSize: 22, // 3 * designSize
        fontWeight: Platform.OS === "android" ? "700" : "600",
    },
    h3: {
        fontSize: 17, // 3 * designSize
        fontWeight: Platform.OS === "android" ? "700" : "600",
    },
    subTitle: {
        fontSize: 15, // 3 * designSize
        lineHeight: 22,
        fontWeight: "400",
        color: colors.lightGray,
    },
    h4: {
        fontSize: 12, // 3 * designSize
        lineHeight: 18,
        fontWeight: "400",
        color: colors.lightGray,
    },

    listElement: {
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5EA",
        color: colors.blue,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    bubleCount: {
        borderRadius: 12,
        backgroundColor: "#C8C7CC",
        padding: 6,
        paddingLeft: 20,
        paddingRight: 20,
        marginRight: 10,
    },
    textListElement: {
        color: colors.blue,
        fontWeight: "400",
        fontSize: 17,
    },
    textBubleListElement: {
        color: "white",
        fontWeight: "700",
        fontSize: 14,
    },
    boldRedText: {
        fontSize: 20, // 3 * designSize
        lineHeight: 24,
        fontWeight: "700",
        color: colors.red,
        textAlign: "right",
    },
    container: {
        backgroundColor: colors.lightBlue,
        flex: 1,
        flexDirection: "column",
        marginTop: 0,

        // paddingTop: 30,
    },

    title: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginTop: 20,
    },

    breakRow: {
        height: 0,
        flexBasis: "100%",
    },

    iconContainer: {
        ...iconContainer,
    },
    arrivalIconContainer: {
        ...iconContainer,
        backgroundColor: colors.blue,
    },
    exitsIconContainer: {
        ...iconContainer,
        backgroundColor: colors.stoutRed,
    },
    resideIconContainer: {
        ...iconContainer,
        backgroundColor: colors.orange,
    },
    freeIconContainer: {
        ...iconContainer,
        backgroundColor: colors.green,
    },
});

export default commonStyles;
