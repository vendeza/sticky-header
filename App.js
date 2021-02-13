/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
} from 'react-native';

import {
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import ContainerView from './src/ContainerView';

const content = (item) => {
    return (
        <View key={item}
              style={{
            height: 100,
            backgroundColor: '#e9e9e9',
            borderWidth: 1,
            borderColor: '#ccc',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 30,
        }}><Text style={{fontSize: 20, fontWeight: '500'}}>{'Just content '+item}</Text></View>
    );
};
const App: () => React$Node = () => {
    return (
        <ContainerView
            screenTitle={'Test sticky header'}
            containerColor={'white'}
            isBackButton={true}
            // navigation={this.props.navigation}
        >
            {[1,2,3,4,5].map((item)=>{
                return content(item)
            })}
        </ContainerView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
});

export default App;
