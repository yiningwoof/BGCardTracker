import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import ExpandableView from '../Tools/ExpandableView';

export default function Expandable({
  title,
  children,
  isCardExpandable,
  imageBackgroundSrc,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    text: {
      fontSize: 42,
    },
    toggleNarrow: {
      width: '100%',
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: '#987554',
    },
    toggleWide: {
      width: '100%',
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: '#987554',
    },
    toggleTextWhite: {
      color: '#fff',
      fontWeight: 'bold',
    },
    toggleTextBlack: {
      color: '#664229',
      fontWeight: 'bold',
    },
  });

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setIsExpanded(!isExpanded);
        }}
        style={isCardExpandable ? styles.toggleNarrow : styles.toggleWide}>
        {isCardExpandable ? (
          <ImageBackground
            source={{
              uri: imageBackgroundSrc,
            }}
            style={{
              height: 40,
              width: '100%',
              opacity: 0.8,
              position: 'absolute',
            }}>
            {/* <LinearGradient
              colors={['black', '#303030', 'transparent']}
              style={{flex: 1, justifyContent: 'center'}}
              start={[0, 1]}
              end={[1, 0]}
              locations={[0.1, 0.5, 1]}
            /> */}
          </ImageBackground>
        ) : (
          <ImageBackground
            source={{
              uri: 'https://t4.ftcdn.net/jpg/04/75/46/65/360_F_475466521_gxMuzd4517K96Q8aEPlZK2DFBlopvH8w.jpg',
            }}
            style={{
              height: 60,
              width: '100%',
              opacity: 0.8,
              position: 'absolute',
              overflow: 'hidden',
              borderWidth: 2,
              borderColor: '#664229',
            }}
          />
        )}
        <Text
          style={
            isCardExpandable ? styles.toggleTextWhite : styles.toggleTextBlack
          }>
          {title}
        </Text>
      </TouchableOpacity>
      <ExpandableView
        expanded={isExpanded}
        isCardExpandable={isCardExpandable}
        children={children}
      />
    </View>
  );
}
