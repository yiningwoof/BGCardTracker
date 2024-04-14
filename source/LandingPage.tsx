import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import axios from 'axios';
// import {REACT_APP_HS_ACCESS_TOKEN} from '@env';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HerosTab from './HerosTab/HerosTab';
import MinionsTab from './MinionsTab/MinionsTab';
import QuestsTab from './QuestsTab/QuestsTab';
import RewardsTab from './RewardsTab/RewardsTab';

const Tab = createBottomTabNavigator();

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [minionCards, setMinionCards] = useState([]);
  const [heroCards, setHeroCards] = useState([]);
  const [questCards, setQuestCards] = useState([]);
  const [rewardCards, setRewardCards] = useState([]);
  const [hasError, setErrorFlag] = useState(false);

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
        console.log('process.env.NODE_ENV', process.env.NODE_ENV);

        const response = await axios.get(url, config);

        if (response.status === 200) {
          console.log('response', response);
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
