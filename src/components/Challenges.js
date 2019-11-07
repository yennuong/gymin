import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableHighlight,
  requireNativeComponent
} from 'react-native';
import styles from '../css/styles'
// const CounterView = requireNativeComponent("MovementRobot");

export default class Challenges extends Component {
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
            <View style={styles.headerTitle}>
                <Text style={styles.headerText}>Challenges</Text>
            </View>
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                  <View style={styles.sectionItem}>
                      <Image
                      source ={require ('../../images/bg_item.png')}
                      style={styles.backgroundImage}
                      />
                      <View style={styles.sectionContent}>
                          <Text style={styles.sectionItemTitle}>Push Up Challenge</Text>
                          <Text style={styles.sectionItemDesc}>
                            Complete your push-ups any time and any place, as long as you meet the daily target.
                          </Text>
                          <View style={[styles.colRow, styles.sectionTime]}>
                              <View style={[styles.colLeft, styles.blockMember]}>
                                <Image
                                  source ={require ('../../images/member.png')}
                                  style={styles.iconMember}
                                />
                                <Text style={styles.countMember}>100</Text>
                              </View>
                              <Text style={[styles.colRight, styles.blockDays]}> 10 days left</Text>
                          </View>
                        <TouchableHighlight style={styles.fullWidthButton}onPress={() => this.props.navigation.navigate('Details')}>
                            <Text style={styles.fullWidthButtonText}>Join</Text>
                        </TouchableHighlight>
                      </View>
                  </View>
              </View>
            </View>
          </View>
        </ScrollView>
        </>
    );
  }
}