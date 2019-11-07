/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Challenges from './src/components/Challenges';
import PushUp from './src/components/PushUp';
import PushUpDetail from './src/components/PushUpDetail';
import End from './src/components/End';


// console.disableYellowBox = true;

const HomeStack = createStackNavigator({
    Home: Challenges,
    Details: PushUp,
    DetailsItem: PushUpDetail,
    End: End
});

export default createAppContainer(HomeStack);