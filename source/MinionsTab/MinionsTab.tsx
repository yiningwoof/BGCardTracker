import React from 'react';
import {StyleSheet, ScrollView, View, Text} from 'react-native';
import TierExpandable from './TierExpandable';

export default function MinionsTab({cards}) {
  return (
    <ScrollView style={styles.scrollView}>
      {cards.length === 0 ? (
        <Text>No cards found.</Text>
      ) : (
        <View>
          {[1, 2, 3, 4, 5, 6, 7].map(tier => (
            <TierExpandable
              title={`Tier ${tier}`}
              cards={cards.filter(card => card.battlegrounds.tier === tier)}
              isTier={true}
              key={tier}
            />
          ))}
        </View>
      )}
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
  toggle: {
    width: 100,
    height: 30,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    color: '#fff',
  },
});
