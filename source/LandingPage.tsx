import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import axios from 'axios';
import {REACT_APP_HS_ACCESS_TOKEN} from '@env';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HerosTab from './HerosTab/HerosTab.jsx';
import MinionsTab from './MinionsTab/MinionsTab.jsx';
import QuestsTab from './QuestsTab/QuestsTab.jsx';
import RewardsTab from './RewardsTab/RewardsTab.jsx';

const Tab = createBottomTabNavigator();

export default function App() {
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
      headers: {Authorization: `Bearer ${REACT_APP_HS_ACCESS_TOKEN}`},
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

    // async function runDBUpdate(client, cards) {
    //   try {
    //     await client.connect();

    //     await client.db('bg_card_tracker').command({ ping: 1 });

    //     console.log(
    //       'Pinged your deployment. You successfully connected to MongoDB!'
    //     );
    //   } finally {
    //     await client.close();
    //   }
    // }

    // const updateMongoDB = (cards) => {
    //   const uri = `mongodb+srv://${REACT_APP_MONGO_DB_USERNAME}:${REACT_APP_MONGO_DB_PASSWORD}@bgcardtracker.v3cvsal.mongodb.net/?retryWrites=true&w=majority&appName=BGCardTracker`;

    //   // const client = new MongoClient(uri, {
    //   //   serverApi: {
    //   //     version: ServerApiVersion.v1,
    //   //     strict: true,
    //   //     deprecationErrors: true,
    //   //   },
    //   // });
    //   const user = useUser();
    //   // const mongodb = user.mongoClient(uri, {
    //   //     serverApi: {
    //   //     version: ServerApiVersion.v1,
    //   //     strict: true,
    //   //     deprecationErrors: true,
    //   //   },
    //   // });
    //   const mongodb = user.mongoClient()
    //   runDBUpdate(client, cards).catch(console.dir);
    // }

    const fetchCards = async () => {
      try {
        setIsLoading(true);

        console.log('fetching');
        console.log('token', REACT_APP_HS_ACCESS_TOKEN);

        const response = await axios.get(url, config);

        console.log('card response', response);

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
    <NavigationContainer>
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
    </NavigationContainer>
  );
}
