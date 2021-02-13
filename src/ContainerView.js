import React from 'react';
import PropTypes from 'prop-types';
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
} from 'react-native';
import commonStyles from './styles/commonStyles';
import colors from './styles/colors';
import StickyParallaxHeader from './stickyParallaxHeader/StickyParallaxHeader';
import Icon from 'react-native-vector-icons/Feather';

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
        // this.navigation = useNavigation();
        this.state = {
            scroll: new Animated.Value(0),
        };


    }

    componentWillUnmount() {
        /** Удаляем Listener  */
        const {scroll} = this.state;
        scroll.removeAllListeners();
    }

    componentDidMount() {
        const {scroll} = this.state;
        if (this.props.isSticky) {
            scroll.addListener(({value}) => (this._value = value));
        }
    }

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
                {this.renderBackButton()}
                <Text style={styles.message}>
                    {this.truncateWithEllipses(this.props.screenTitle, 40)}
                </Text>
            </Animated.View>
        );
    }

    truncateWithEllipses(text, max) {
        return text.substr(0, max - 1) + (text.length > max ? '...' : '');
    }

    renderHeader() {
        const { scroll } = this.state;
        const opacity = scroll.interpolate({
            inputRange: [0, 10, 40],
            outputRange: [0, 0, 1],
            extrapolate: "clamp",
        });

        // }
        //  alert(title);
        return (
            <Animated.View style={{ opacity }}>
                <View
                    style={{
                        ...styles.headerWrapper,
                        backgroundColor: this.props.containerColor,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                    }}
                >
                    {this.renderBackButton()}
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
                        alert('empty nav')
                        if(this.props.navigation && this.props.navigation.goBack) {
                            this.props.navigation.goBack();
                        }
                    }}
                    style={{
                        marginTop: Platform.OS === 'android' ? 0 : 10,
                        zIndex: 1000,
                        width: 90,
                        paddingHorizontal: 0,
                        marginHorizontal: 0,
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 0,
                            marginHorizontal: 0,
                        }}
                    >
                        <Icon
                            style={{
                                marginLeft: -8,
                            }}
                            name="chevron-left"
                            size={34}
                            color={colors.blue}
                        />
                        <Text
                            style={{
                                color: colors.blue,
                                marginLeft: -8,
                                fontWeight: '400',
                                textAlign: 'left',
                                fontSize: 17,
                            }}
                        >
                            {'Назад'}
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
                <View style={{...styles.foreground, height: 90}}>
                    <View>{this.renderBackButton()}</View>
                    <Text style={styles.message}>{this.props.screenTitle}</Text>
                </View>

                {this.props.children}
            </View>
        );
    }

    renderStickyContent() {
        if (this.props.pending && !this.props.refreshing) {
            return (
                <View
                    style={{
                        //  opacity: this.state.fadeAnimation,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                    }}
                >
                    <ActivityIndicator size="large" color="#555"/>
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
                parallaxHeight={76}
                headerHeight={88}
                snapToEdge={false}
                //   bounces={false}

                headerSize={() => {
                }}
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
                    {useNativeDriver: false},
                )}
                contentContainerStyles={{marginTop: 0}}
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
                    //  showHideTransition
                    barStyle="dark-content"
                    // backgroundColor={this.props.containerColor}
                />
                <View
                    style={{
                        ...styles.container,
                        // backgroundColor: this.props.containerColor,
                        paddingTop: Platform.OS === 'android' ? 44 : 0,
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
const goBack = () => {
};
ContainerView.defaultProps = {
    children: null,
    screenTitle: 'Title',
    onDataRefresh: () => {
    },
    refreshing: false,
    pending: false,
    containerColor: colors.backgroundColor,
    isSticky: true,
    isBackButton: false,
    navigation: {goBack:()=>{}},
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
    navigation: PropTypes.function,
};
const styles = StyleSheet.create({
    container: {
        ...commonStyles.container,
    },
    content: {
        height: 0,
        marginTop: 50,
    },
    foreground: {
        height: 80,
        paddingLeft: 16,
        paddingRight: 16,

        justifyContent: 'center',
    },
    message: {
        color: 'black',
        paddingTop: 4,
        //backgroundColor: "red",
        paddingBottom: 7,
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'left',
    },
    headerWrapper: {
        //  height: 100,
        backgroundColor: colors.backgroundColor,
        width: '100%',
        paddingHorizontal: 16,
        paddingTop: 0,
        paddingBottom: 0,
        borderBottomWidth: 1,
        borderBottomColor: colors.softGray,
    },
    headerTitle: {
        fontSize: 16,
        color: 'black',
        margin: 12,
        textAlign: 'center',
        fontWeight: '700',
    },
});
