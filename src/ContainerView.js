import React from "react";
import PropTypes from "prop-types";
import {
    StatusBar,
    StyleSheet,
    View,
    SafeAreaView,
    Animated,
    Text,
    RefreshControl,
    ActivityIndicator,
    Platform,
    TouchableOpacity,
} from "react-native";
import commonStyles from "./styles/commonStyles";
import colors from "./styles/colors";
import StickyParallaxHeader from "./stickyParallaxHeader/StickyParallaxHeader";
import Icon from "react-native-vector-icons/Feather";

/** PROPS:
 *  children,
 *  screenTitle,
 *  onDataRefresh,
 *  refreshing,
 *  pending,
 *  color
 */

export default class ContainerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scroll: new Animated.Value(0),
        };
    }

    componentWillUnmount() {
        /** Removing the Listener  */
        const { scroll } = this.state;
        scroll.removeAllListeners();
    }

    componentDidMount() {
        const { scroll } = this.state;
        if (this.props.isSticky) {
            scroll.addListener(({ value }) => (this._value = value));
        }
    }

    /** used for sticky header component*/
    renderForeground() {
        const { scroll } = this.state;
        const titleOpacity = scroll.interpolate({
            inputRange: [0, 0, 20],
            outputRange: [1, 1, 0],
            extrapolate: "clamp",
        });

        return (
            <Animated.View
                style={{ ...styles.foreground, opacity: titleOpacity }}
            >
                <View>
                    {this.renderBackButton()}
                    <Text style={styles.h1}>
                        {this.truncateWithEllipses(this.props.screenTitle, 40)}
                    </Text>
                </View>
            </Animated.View>
        );
    }

    truncateWithEllipses(text, max) {
        return text.substr(0, max - 1) + (text.length > max ? "..." : "");
    }

    renderHeader() {
        const { scroll } = this.state;
        const opacity = scroll.interpolate({
            inputRange: [0, 10, 40],
            outputRange: [0, 0, 1],
            extrapolate: "clamp",
        });

        return (
            <Animated.View style={{ opacity }}>
                <View
                    style={{
                        ...styles.headerWrapper,
                        backgroundColor: this.props.containerColor,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                    }}
                >
                    <View>{this.renderBackButton()}</View>

                    <Text
                        style={{
                            ...styles.headerTitle,
                            flex: 1,
                            marginLeft: this.props.isBackButton ? 30 : 0,
                            textAlign: this.props.isBackButton
                                ? "left"
                                : "center",
                        }}
                    >
                        {this.truncateWithEllipses(this.props.screenTitle, 30)}
                    </Text>
                </View>
            </Animated.View>
        );
    }

    renderBackButton() {
        if (this.props.isBackButton) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        alert("empty nav");
                        if (
                            this.props.navigation &&
                            this.props.navigation.goBack
                        ) {
                            this.props.navigation.goBack();
                        }
                    }}
                    style={{
                        marginTop: Platform.OS === "android" ? 0 : 0,
                        zIndex: 1000,
                        width: 90,
                        paddingHorizontal: 0,
                        marginHorizontal: 0,
                        marginLeft: -12,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingHorizontal: 0,
                            marginHorizontal: 0,
                        }}
                    >
                        <Icon
                            style={{
                                marginLeft: -8,
                            }}
                            name="chevron-left"
                            size={30}
                            color={colors.blue}
                        />
                        <Text
                            style={{
                                color: colors.blue,
                                marginLeft: -5,
                                fontWeight: "400",
                                textAlign: "left",
                                fontSize: 17,
                            }}
                        >
                            {"Назад"}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }

        return null;
    }

    renderNotStickyContent() {
        return (
            <View>
                <View style={{ ...styles.foreground, height: 90 }}>
                    <View>{this.renderBackButton()}</View>
                    <Text style={styles.h1}>{this.props.screenTitle}</Text>
                </View>

                {this.props.children}
            </View>
        );
    }

    /** render lists, images, texts and etc. (content)*/
    renderStickyContent() {
        if (this.props.pending && !this.props.refreshing) {
            return (
                <View
                    style={{
                        //  opacity: this.state.fadeAnimation,
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                    }}
                >
                    <ActivityIndicator size="large" color="#555" />
                </View>
            );
        }
        return (
            <StickyParallaxHeader
                transparentHeader // the reason not opacity
                refreshControl={
                    <RefreshControl
                        refreshing={this.props.refreshing}
                        onRefresh={this.props.onDataRefresh}
                    />
                }
                foreground={this.renderForeground()}
                header={this.renderHeader()}
                parallaxHeight={76} //scrollable header
                headerHeight={88}
                snapToEdge={false}
                headerSize={() => {}}
                scrollEvent={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: {
                                    y: this.state.scroll,
                                },
                            },
                        },
                    ],
                    { useNativeDriver: false },
                )}
            >
                {this.props.children}
            </StickyParallaxHeader>
        );
    }

    render() {
        return (
            <SafeAreaView
                style={{
                    ...commonStyles.mainContainer,
                    backgroundColor: this.props.containerColor
                        ? this.props.containerColor
                        : colors.backgroundColor,
                }}
            >
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />
                <View
                    style={{
                        ...styles.container,
                        paddingTop: Platform.OS === "android" ? 44 : 0,
                    }}
                >
                    {this.props.isSticky
                        ? this.renderStickyContent()
                        : this.renderNotStickyContent()}
                </View>
            </SafeAreaView>
        );
    }
}

ContainerView.defaultProps = {
    children: null,
    screenTitle: "Title",
    onDataRefresh: () => {},
    refreshing: false,
    pending: false,
    containerColor: colors.backgroundColor,
    isSticky: true,
    isBackButton: false,
    navigation: {
        goBack: () => {},
    },
};

ContainerView.propTypes = {
    children: PropTypes.node,
    screenTitle: PropTypes.string,
    onDataRefresh: PropTypes.func,
    refreshing: PropTypes.bool,
    pending: PropTypes.bool,
    containerColor: PropTypes.string,
    isSticky: PropTypes.bool,
    isBackButton: PropTypes.bool,
    navigation: PropTypes.object,
};
const styles = StyleSheet.create({
    container: {
        ...commonStyles.container,
    },
    foreground: {
        paddingLeft: 16,
        paddingRight: 16,
        justifyContent: "center",
    },
    h1: {
        color: "black",
        fontSize: 28,
        fontWeight: "700",
        textAlign: "left",
    },
    headerWrapper: {
        backgroundColor: colors.backgroundColor,
        width: "100%",
        paddingHorizontal: 16,
        paddingTop: 0,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.softGray,
    },
    headerTitle: {
        fontSize: 16,
        color: "black",
        margin: 0,
        textAlign: "center",
        fontWeight: "700",
    },
});
