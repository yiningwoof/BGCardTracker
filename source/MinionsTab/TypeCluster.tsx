import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import CardExpandable from './CardExpandable';
import {ICard} from '../LandingPage';

export default function TypeCluster({
  type,
  cards,
}: {
  type: string;
  cards: ICard[];
}) {
  return (
    <View>
      <Text style={styles.header}>{type}</Text>
      {cards.length ? (
        cards.map(card => (
          <CardExpandable title={card.name} card={card} key={card._id} />
        ))
      ) : (
        <Text>No cards</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#d2be97',
    fontSize: 16,
    padding: 4,
    textAlign: 'center',
  },
});
