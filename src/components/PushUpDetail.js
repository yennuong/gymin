import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text
} from 'react-native';
import Detecter from '../lib/Detecter';
import styles from '../css/styles';

export default class PushUpDetail extends Component {
  static navigationOptions = {
    header: null,
  };
  render(){
    return(
      <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
          <View style={styles.main}>
            <View style={styles.sectionContainerEx}>
                <View style={styles.headerDetecter}>
                  <Detecter/>
                </View>
            </View>
          </View>
      </ScrollView>
      </>
    );
  }
}
