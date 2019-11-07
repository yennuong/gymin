import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableHighlight
} from 'react-native';
import styles from '../css/styles';
export default class End extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  };
  render(){
    return(
      <>
      <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
            <View style={styles.main}>
            <View style={styles.header}>
            <Image
              source ={require ('../../images/pushup-banner.png')}
              style={styles.headerImage}
            />
          </View>
          <View style={styles.bodyEx}>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Push up</Text>
                <View style={styles.sectionReps}>
                    <View style={styles.block}>
                        <View style={styles.blockTime}>
                            <Text style={styles.blocklabel}>Time</Text>
                            <Text style={styles.blocknumber}>0:21</Text>
                        </View>
                    </View>
                    <View style={styles.block}>
                        <View style={styles.blockTime}>
                            <Text style={styles.blocklabel}>Reps</Text>
                            <Text style={styles.blocknumber}>0</Text>
                        </View>
                    </View>
                </View>
                <TouchableHighlight style={styles.fullWidthButton} onPress={() => this.props.navigation.navigate('Home')}>
                    <Text style={styles.fullWidthButtonText}>Done</Text>
                </TouchableHighlight>
            </View>
          </View>
            </View>
        </ScrollView>
    </>
    );
  }
}