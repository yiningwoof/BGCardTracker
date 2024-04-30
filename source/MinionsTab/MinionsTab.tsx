import React, {useCallback} from 'react';
import {useUser, useRealm} from '@realm/react';
import {StyleSheet, ScrollView, View, Text, Button} from 'react-native';
import TierExpandable from './TierExpandable';
import {Card} from '../CardSchema';
import {ICard} from '../LandingPage';

export default function MinionsTab({cards}: {cards: ICard[]}) {
  const realm = useRealm();
  // const cards = useQuery(Card).sorted('_id');
  const user = useUser();

  const onSavingCard = useCallback(
    ({
      _id,
      name,
      minionTypeId,
      health,
      text,
      image,
      cropImage,
    }: {
      _id: number;
      name: string;
      minionTypeId: number;
      health: number;
      text: string;
      image: string;
      cropImage: string;
    }) => {
      // if the realm exists, create an Item
      realm.write(() => {
        console.log('writing to realm');

        return new Card(realm, {
          _id: _id,
          name: name,
          minionTypeId: minionTypeId,
          health: health,
          text: text,
          image: image,
          cropImage: cropImage,
          owner_id: user?.id,
        });
      });
    },
    [realm, user],
  );

  const onSavingBattleground = ({
    _id,
    hero,
    quest,
    reward,
    duosOnly,
    solosOnly,
    image,
  }: {
    _id: number;
    hero: boolean;
    quest: boolean;
    reward: boolean;
    duosOnly: boolean;
    solosOnly: boolean;
    image: string;
  }) => {
    realm.write(() => {
      console.log('writing to realm......');

      console.log(
        'realm sync session active?',
        realm.syncSession?.state === 'active',
      );

      console.log('realm sync session', realm.syncSession);

      console.log('realm sync session state', realm.syncSession?.state);

      // return new Card(realm, {
      //   _id,
      //   name,
      //   // owner_id: user?.id,
      //   minionTypeId,
      //   health,
      //   text,
      //   image,
      //   cropImage,
      //   owner_id: user.id,
      // });
      realm.create('Battleground', {
        _id: _id,
        hero: hero,
        quest: quest,
        reward: reward,
        duosOnly: duosOnly,
        solosOnly: solosOnly,
        image: image,
        owner_id: user.id,
      });
    });
  };

  return (
    <ScrollView style={styles.scrollView}>
      {cards.length === 0 ? (
        <>
          <Text>No cards found.</Text>
          <Button
            title="Save Card"
            onPress={() =>
              onSavingBattleground({
                _id: 1,
                hero: true,
                quest: false,
                reward: false,
                duosOnly: false,
                solosOnly: false,
                image: 'image',
              })
            }>
            save
          </Button>
        </>
      ) : (
        <View>
          {[1, 2, 3, 4, 5, 6, 7].map(tier => (
            <TierExpandable
              title={`Tier ${tier}`}
              cards={cards.filter(card => card.battlegrounds?.tier === tier)}
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
