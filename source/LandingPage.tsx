import React, {useCallback, useState, useEffect} from 'react';
import {useUser, useRealm, useQuery} from '@realm/react';
import axios from 'axios';
// import {REACT_APP_HS_ACCESS_TOKEN} from '@env';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HerosTab from './HerosTab/HerosTab';
import MinionsTab from './MinionsTab/MinionsTab';
import QuestsTab from './QuestsTab/QuestsTab';
import RewardsTab from './RewardsTab/RewardsTab';

import {Card} from './CardSchema';

const Tab = createBottomTabNavigator();

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [minionCards, setMinionCards] = useState([]);
  const [heroCards, setHeroCards] = useState([]);
  const [questCards, setQuestCards] = useState([]);
  const [rewardCards, setRewardCards] = useState([]);
  const [hasError, setErrorFlag] = useState(false);

  const realm = useRealm();
  const cards = useQuery(Card).sorted('_id');
  const user = useUser();

  const createCard = useCallback(
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
      console.log('_id', _id);
      console.log('name', name);
      console.log('minionTypeId', minionTypeId);
      console.log('health', health);
      console.log('text', text);
      console.log('image', image);
      console.log('cropImage', cropImage);

      // realm.write(() => {
      //   realm.delete(cards);
      // });

      realm.write(() => {
        console.log('writing to realm......');

        return new Card(realm, {
          _id,
          name,
          owner_id: user?.id,
          minionTypeId,
          health,
          text,
          image,
          cropImage,
        });
      });
    },
    [realm, user],
  );

  useEffect(() => {
    const abortController = new AbortController();
    const url =
      'https://us.api.blizzard.com/hearthstone/cards?locale=en_US&gameMode=battlegrounds&pageSize=1000';

    const config = {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_HS_ACCESS_TOKEN}`,
      },
      signal: abortController.signal,
    };

    const minions = cards => {
      return cards.filter(card => card.cardTypeId === 4);
    };

    const heros = cards => {
      return cards.filter(card => card.cardTypeId === 3);
    };

    const quests = cards => {
      return cards.filter(card => card.battlegrounds.quest === true);
    };

    const rewards = cards => {
      return cards.filter(card => card.battlegrounds.reward === true);
    };

    const fetchCards = async () => {
      try {
        setIsLoading(true);

        console.log('fetching');
        console.log('token', process.env.REACT_APP_HS_ACCESS_TOKEN);
        console.log('process.env', process.env);

        const response = await axios.get(url, config);

        console.log('first card', response.data.cards[0]);

        const firstCard = response.data.cards[0];

        createCard({
          _id: firstCard.id,
          name: firstCard.name,
          minionTypeId: firstCard.minionTypeId,
          health: firstCard.health,
          text: firstCard.health,
          image: firstCard.image,
          cropImage: firstCard.cropImage,
        });

        if (response.status === 200) {
          // console.log('response', response);
          const cards = response.data.cards;

          setMinionCards(minions(cards));
          setHeroCards(heros(cards));
          setQuestCards(quests(cards));
          setRewardCards(rewards(cards));
          setIsLoading(false);

          // updateMongoDB(cards);
          return;
        } else {
          throw new Error('Failed to fetch cards');
        }
      } catch (error) {
        if (abortController.signal.aborted) {
        } else {
          setErrorFlag(true);
          setIsLoading(false);
        }
      }
    };

    fetchCards();

    return () => abortController.abort('Data fetching cancelled');
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#b3e0dc',
        },
        tabBarIconStyle: {
          color: 'red',
        },
      }}>
      <Tab.Screen
        name="Heros"
        options={{
          // tabBarLabelPosition: 'below-icon',
          tabBarIconStyle: {
            color: 'red',
          },
        }}
        children={() => <HerosTab cards={heroCards} />}
      />
      <Tab.Screen
        name="Minions"
        children={() => <MinionsTab cards={minionCards} />}
      />
      <Tab.Screen
        name="Quests"
        children={() => <QuestsTab cards={questCards} />}
      />
      <Tab.Screen
        name="Rewards"
        children={() => <RewardsTab cards={rewardCards} />}
      />
    </Tab.Navigator>
  );
}
