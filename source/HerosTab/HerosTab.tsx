import React from 'react';
import {ICard} from '../LandingPage';

import {StyleSheet, ScrollView, Text, View, Image} from 'react-native';

export default function HerosTab({cards}: {cards: ICard[]}) {
  return (
    <ScrollView style={styles.scrollView}>
      {cards.map(card => (
        <View key={card._id}>
          <Image
            source={{uri: card.battlegrounds?.image}}
            style={{width: 300, height: 400}}
          />
          <Text>{card.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
});
