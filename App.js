
import React from "react";
import {

    View,
    Text,
} from "react-native";


import ContainerView from "./src/ContainerView";

const content = (item) => {
    return (
        <View
            key={item}
            style={{
                height: 100,
                backgroundColor: "#e9e9e9",
                borderWidth: 1,
                borderColor: "#ccc",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 30,
            }}
        >
            <Text style={{ fontSize: 20, fontWeight: "500" }}>
                {"Just content " + item}
            </Text>
        </View>
    );
};
const App: () => React$Node = () => {
    return (
        <ContainerView
            screenTitle={"Test sticky header"}
            containerColor={"white"}
            isBackButton={true}
            // navigation={this.props.navigation}
        >
            {[1, 2, 3, 4, 5,6,7].map((item) => {
                return content(item);
            })}
        </ContainerView>
    );
};


export default App;
