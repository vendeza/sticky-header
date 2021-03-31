import React, { Component } from "react";
import {
    bool,
    func,
    node,
    number,
    string,
    oneOfType,
    oneOf,
    element,
} from "prop-types";
import {
    Dimensions,
    ScrollView,
    View,
    Animated,
    Easing,
    ViewPropTypes,
    Image,
} from "react-native";
import { constants } from "./constants";
import styles from "./styles";
import { getSafelyScrollNode, setRef } from "./utils";

const {
    divide,
    Value,
    createAnimatedComponent,
    event,
    timing,
    ValueXY,
} = Animated;
const AnimatedScrollView = createAnimatedComponent(ScrollView);


class StickyParallaxHeader extends Component {
    constructor(props) {
        super(props);
        const { initialPage } = this.props;
        const { width } = Dimensions.get("window");
        const scrollXIOS = new Value(initialPage * width);
        const containerWidthAnimatedValue = new Value(width);

        containerWidthAnimatedValue.__makeNative();
        const scrollValue = divide(scrollXIOS, containerWidthAnimatedValue);
        this.state = {
            scrollValue,
            containerWidth: width,
            currentPage: initialPage,
            isFolded: false,
        };
        this.scrollY = new ValueXY();
    }

    componentDidMount() {
        this.scrollY.addListener(({ value }) => (this._value = value));
        this.props.onRef?.(this);
    }



    componentWillUnmount() {
        this.scrollY.removeAllListeners();
        this.props.onRef?.(null);
    }

    spring = () => {
        const scrollNode = getSafelyScrollNode(this.scroll);
        scrollNode.scrollTo({ x: 0, y: 40, animated: true });

        return setTimeout(() => {
            setTimeout(() => {
                scrollNode.scrollTo({ x: 0, y: 25, animated: true });
            }, 200);
            scrollNode.scrollTo({ x: 0, y: 0, animated: true });
        }, 300);
    };

    onScrollEndSnapToEdge = (height) => {
        const { snapStartThreshold, snapStopThreshold, snapValue } = this.props;
        const scrollHeight = snapStopThreshold || height;
        const snap = snapValue || height;
        const { snapToEdge, refreshControl } = this.props;

        const scrollNode = getSafelyScrollNode(this.scroll);
        const scrollValue = this.scrollY.__getValue();
        const { y } = scrollValue;
        const snapToEdgeAnimatedValue = new ValueXY(scrollValue);
        const snapToEdgeThreshold = snapStartThreshold || height / 2;
        const id = snapToEdgeAnimatedValue.addListener((value) => {
            scrollNode.scrollTo({ x: 0, y: value.y, animated: false });
        });

        if (y < -20 && !constants.isAndroid && !refreshControl) {
            this.spring(y);
        }

        if (snapToEdge) {
            if (y > 0 && y < snapToEdgeThreshold) {
                return constants.isAndroid
                    ? this.setState(
                          {
                              isFolded: false,
                          },
                          scrollNode.scrollTo({ x: 0, y: 0, animated: true }),
                      )
                    : timing(snapToEdgeAnimatedValue, {
                          toValue: { x: 0, y: 0 },
                          duration: 400,
                          easing: Easing.out(Easing.cubic),
                          useNativeDriver: true,
                      }).start(() => {
                          snapToEdgeAnimatedValue.removeListener(id);
                          this.setState({
                              isFolded: false,
                          });
                      });
            }
            if (y >= snapToEdgeThreshold && y < scrollHeight) {
                return constants.isAndroid
                    ? this.setState(
                          {
                              isFolded: true,
                          },
                          scrollNode.scrollTo({
                              x: 0,
                              y: scrollHeight,
                              animated: true,
                          }),
                      )
                    : timing(snapToEdgeAnimatedValue, {
                          toValue: { x: 0, y: snap },
                          duration: 400,
                          easing: Easing.out(Easing.cubic),
                          useNativeDriver: true,
                      }).start(() => {
                          snapToEdgeAnimatedValue.removeListener(id);
                          this.setState({
                              isFolded: true,
                          });
                      });
            }
        }

        return null;
    };


    onLayout = (e) => {
        const { x, y, width, height } = e.nativeEvent.layout;
        const { headerSize } = this.props;
        const headerLayout = {
            x,
            y,
            width,
            height,
        };
        headerSize(headerLayout);
    };

    goToPage = (pageNumber) => {
        const { containerWidth, currentPage } = this.state;
        const offset = pageNumber * containerWidth;
        if (currentPage !== pageNumber) {
            this.setState({
                currentPage: pageNumber,
            });
        }
        if (this.scrollView) {
            this.scrollView.scrollTo({
                x: offset,
                y: 0,
                animated: true,
            });
        }
    };

    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const { onEndReached } = this.props;

        if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 20
        ) {
            return onEndReached && onEndReached();
        }

        return null;
    };

    isCloseToTop = ({ contentOffset }) => {
        const { onTopReached } = this.props;
        if (contentOffset.y <= 0) {
            return onTopReached && onTopReached();
        }

        return null;
    };

    /** top header*/
    renderHeader = () => {
        const {
            header,
            headerHeight,
            backgroundColor,
            transparentHeader,
        } = this.props;

        const headerStyle = header.props.style;
        const isArray = Array.isArray(headerStyle);
        const arrayHeaderStyle = {};
        if (isArray) {
            headerStyle.map((el) => Object.assign(arrayHeaderStyle, el));
        }

        return (
            <View
                style={
                    (styles.toolbarWrapper,
                    {
                        // height: headerHeight,
                        backgroundColor: isArray
                            ? arrayHeaderStyle.backgroundColor
                            : backgroundColor || headerStyle?.backgroundColor,
                        ...(transparentHeader && styles.transparentHeader),
                    })
                }>
                {header}
            </View>
        );
    };



    renderForeground = (backgroundHeight) => {
        const {
            foreground,
            backgroundImage,
        } = this.props;

        return (
            <View
                style={{
                    height: backgroundHeight,
                    ...(backgroundImage && styles.transparentBackground),
                }}>
                {foreground}
            </View>
        );
    };

    render() {
        const {
            children,
            contentContainerStyles,
            header,
            headerHeight,
            parallaxHeight,
            bounces,
            scrollEvent,
            keyboardShouldPersistTaps,
            scrollRef,
            refreshControl,
        } = this.props;
        const { currentPage, isFolded } = this.state;
        const scrollHeight = Math.max(parallaxHeight, headerHeight * 2);
        const headerStyle = header.props.style;
        const isArray = Array.isArray(headerStyle);
        const arrayHeaderStyle = {};
        if (isArray) {
            headerStyle.map((el) => Object.assign(arrayHeaderStyle, el));
        }

        const scrollViewMinHeight =
            Dimensions.get("window").height + parallaxHeight - headerHeight;

        const shouldUseBgColor =
            contentContainerStyles && contentContainerStyles.backgroundColor;



        return (

            <View style={styles.container}>
                {header && this.renderHeader()}
                <AnimatedScrollView
                    bounces={bounces}
                    overScrollMode="never"
                    refreshControl={refreshControl}
                    bouncesZoom
                    decelerationRate="fast"
                    nestedScrollEnabled
                    ref={(c) => {
                        this.scroll = c;
                        setRef(scrollRef, c);
                    }}
                    contentContainerStyle={{
                        minHeight: scrollViewMinHeight,
                        backgroundColor: shouldUseBgColor,
                    }}
                    onScrollEndDrag={() =>
                        this.onScrollEndSnapToEdge(scrollHeight)
                    }
                    scrollEventThrottle={1}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                    onScroll={event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {
                                        y: this.scrollY.y,
                                    },
                                },
                            },
                        ],
                        {
                            useNativeDriver: true,
                            listener: (e) => {
                                this.isCloseToBottom(e.nativeEvent);
                                this.isCloseToTop(e.nativeEvent);
                                scrollEvent(e);
                            },
                        },
                    )}>
                    <View
                        style={{ height: parallaxHeight }}
                        onLayout={(e) => this.onLayout(e)}>
                        <View
                            style={[
                                styles.overScrollPadding,
                                {
                                    backgroundColor: isArray
                                        ? arrayHeaderStyle.backgroundColor
                                        : headerStyle?.backgroundColor,
                                },
                            ]}
                        />

                        {this.renderForeground(scrollHeight)}
                    </View>

                    <View>{children}</View>
                </AnimatedScrollView>
            </View>
        );
    }
}

StickyParallaxHeader.propTypes = {
    background: node,
    backgroundColor: string,
    backgroundImage: Image.propTypes.source,
    bounces: bool,
    children: node,
    contentContainerStyles: ViewPropTypes.style,
    foreground: node,
    header: node,
    headerHeight: number,
    headerSize: func.isRequired,
    initialPage: number,
    onEndReached: func,
    parallaxHeight: number,
    scrollEvent: func,
    snapToEdge: bool,
    snapStartThreshold: oneOfType([bool, number]),
    snapStopThreshold: oneOfType([bool, number]),
    snapValue: oneOfType([bool, number]),
    transparentHeader: bool,
    onRef: func,
    onTopReached: func,
    keyboardShouldPersistTaps: oneOf([
        "never",
        "always",
        "handled",
        false,
        true,
        undefined,
    ]),
    refreshControl: element,
};

StickyParallaxHeader.defaultProps = {
    bounces: true,
    contentContainerStyles: {},
    headerHeight: 92,
    backgroundColor: "",
    initialPage: 0,
    parallaxHeight: 0,
    snapToEdge: true,

    snapStartThreshold: false,
    snapStopThreshold: false,
    snapValue: false,
    transparentHeader: false,
    onRef: null,
    scrollRef: null,
    keyboardShouldPersistTaps: undefined,
    refreshControl: undefined,
};

export default function (props) {
    const ref = React.useRef(null);
    if (ref) {
        //useScrollToTop(ref);
    }


    return <StickyParallaxHeader {...props} scrollRef={ref} />;
}
