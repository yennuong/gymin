import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableHighlight
} from 'react-native';
//import VideoPlayer from 'react-native-video-controls';
import styles from '../css/styles';
export default class PushUp extends Component {
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
          <View style={styles.header}>
            <Image
              source ={require ('../../images/pushup-banner.png')}
              style={styles.headerImage}
            />
            <TouchableHighlight style={styles.back} onPress={() => this.props.navigation.navigate('Home')}>
              <Image
                source ={require ('../../images/back.png')}
                style={styles.backicon}
              />
            </TouchableHighlight>
          </View>
          <View style={styles.lessonBody}>
            <View style={styles.sectionContainer}>
                <Text style={styles.lessonTitle}>Push up</Text>
                <Text style={styles.line}></Text>
                <View style={styles.howWork}>
                    <Text style={styles.howWorkTitle}>How it work</Text>
                    <View>
                        <Text style={styles.howWorkDesc}>- Place your phone upright against a wall, then step back 2 meters</Text>
                        <Text style={styles.howWorkDesc}>- The app tracks key points on the body using phone’s back camera</Text>
                        <Text style={styles.howWorkDesc}>- Volume up to listen realtime audio feedback</Text>
                    </View>
                </View>
                <View style={styles.sectionVideo}>
                </View>
            <TouchableHighlight style={styles.fullWidthButton} onPress={() => this.props.navigation.navigate('DetailsItem')}>
                <Text style={styles.fullWidthButtonText}>Start workout</Text>
            </TouchableHighlight>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
    );
  }
}