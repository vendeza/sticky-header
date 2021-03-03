import React from "react";
import { View, Text, Image } from "react-native";
import ContainerView from "./src/ContainerView";

const content = (item, index) => {
    return (
        <View key={index} style={{ flexDirection: "column", marginTop: 36 }}>
            <View
                key={index}
                style={{
                    height: 100,
                    backgroundColor: "#ffffff",
                    justifyContent: "center",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowColor: "#a7a7a7",
                    shadowRadius: 18,
                    shadowOpacity: 0.4,
                    borderRadius: 8,
                }}
            >
                <Image
                    style={{
                        height: undefined,
                        width: undefined,

                        borderRadius: 8,
                        flex: 1,
                        resizeMode: "cover",
                    }}
                    source={item.img}
                />
            </View>
            <View style={{}}>
                <Text
                    style={{
                        color: "#606060",
                        fontSize: 16,
                        fontWeight: "500",
                        marginTop: 16,
                    }}
                >
                    {"Just content "}
                </Text>
            </View>
        </View>
    );
};
const App: () => React$Node = () => {
    const color = "#ffffff";
    const elements = [
        { img: require("./assets/GambitQeen.png") },
        { img: require("./assets/darkKnight.png") },
        { img: require("./assets/People.png") },
        { img: require("./assets/Photo.png") },
        { img: require("./assets/Colors.png") },
        { img: require("./assets/GambitQeen.png") },
        { img: require("./assets/darkKnight.png") },
        { img: require("./assets/People.png") },
        { img: require("./assets/Photo.png") },
        { img: require("./assets/Colors.png") },
    ];
    return (
        <ContainerView
            screenTitle={"Test sticky header"}
            containerColor={"#f7f9fd"}
            headerColor={color}
            isBackButton={true}
        >
            <View style={{ padding: 10, paddingTop: 0 }}>
                {elements.map((item, index) => {
                    return content(item, index);
                })}
            </View>
        </ContainerView>
    );
};

export default App;
