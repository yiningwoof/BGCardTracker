import React, {useState, useEffect, useCallback} from 'react';
import {useUser, useRealm} from '@realm/react';
import axios from 'axios';
// import {REACT_APP_HS_ACCESS_TOKEN} from '@env';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HerosTab from './HerosTab/HerosTab';
import MinionsTab from './MinionsTab/MinionsTab';
import QuestsTab from './QuestsTab/QuestsTab';
import RewardsTab from './RewardsTab/RewardsTab';

import {Card, Battleground} from './CardSchema';

export interface IBattleground {
  _id: number;
  tier?: number;
  hero?: boolean;
  quest?: boolean;
  reward?: boolean;
  image?: string;
  duosOnly?: boolean;
  solosOnly?: boolean;
}

export interface ICard {
  _id: number;
  name: string;
  minionTypeId?: number;
  cardTypeId?: number;
  health?: number;
  attack?: number;
  text?: string;
  image?: string;
  cropImage?: string;
  multiTypeIds?: {type: 'list'; objectType: number};
  battlegrounds?: IBattleground;
  owner_id?: string;
}

const Tab = createBottomTabNavigator();

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [allCards, setAllCards] = useState<ICard[]>([]);
  const [minionCards, setMinionCards] = useState<ICard[]>([]);
  const [heroCards, setHeroCards] = useState<ICard[]>([]);
  const [questCards, setQuestCards] = useState<ICard[]>([]);
  const [rewardCards, setRewardCards] = useState<ICard[]>([]);
  const [hasError, setErrorFlag] = useState(false);

  const realm = useRealm();
  // const cards = useQuery(Card).sorted('_id');
  const user = useUser();

  const createCard = useCallback(
    ({
      _id,
      name,
      minionTypeId,
      cardTypeId,
      multiTypeIds,
      health,
      text,
      image,
      cropImage,
      battlegrounds,
    }: ICard) => {
      const relatedBg = realm.objectForPrimaryKey(Battleground, _id); // search for a realm object with a primary key that is an objectId
      if (relatedBg) {
        realm.write(() => {
          realm.create('Card', {
            _id: _id,
            name: name,
            minionTypeId: minionTypeId,
            cardTypeId: cardTypeId,
            multiTypeIds: multiTypeIds,
            health: health,
            text: text,
            image: image,
            cropImage: cropImage,
            battlegrounds: battlegrounds,
            owner_id: user.id,
          });
        });
      } else {
        realm.write(() => {
          realm.create('Card', {
            _id: _id,
            name: name,
            minionTypeId: minionTypeId,
            cardTypeid: cardTypeId,
            multiTypeIds: multiTypeIds,
            health: health,
            text: text,
            image: image,
            cropImage: cropImage,
            owner_id: user.id,
          });
        });
      }
    },
    [realm, user],
  );

  const deleteBattleground = useCallback(
    (id: number) => {
      const bg = realm.objectForPrimaryKey(Battleground, id); // search for a realm object with a primary key that is an objectId
      if (bg) {
        realm.write(() => {
          realm.delete(bg);
        });
        console.log('bg delete successful!');
      }
    },
    [realm],
  );

  const deleteCard = useCallback(
    (id: number) => {
      const card = realm.objectForPrimaryKey(Card, id); // search for a realm object with a primary key that is an objectId
      if (card) {
        realm.write(() => {
          realm.delete(card);
        });
        console.log('card delete successful!');
      }
    },
    [realm],
  );

  const createBattleground = useCallback(
    ({_id, hero, quest, reward, duosOnly, solosOnly, image}: IBattleground) => {
      realm.write(() => {
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

    const minions = (cards: ICard[]): ICard[] => {
      return cards.filter(card => card.cardTypeId === 4);
    };

    const heros = (cards: ICard[]): ICard[] => {
      return cards.filter(card => card.cardTypeId === 3);
    };

    const quests = (cards: ICard[]): ICard[] => {
      return cards.filter(card => card.battlegrounds?.quest === true);
    };

    const rewards = (cards: ICard[]): ICard[] => {
      return cards.filter(card => card.battlegrounds?.reward === true);
    };

    const fetchCards = async () => {
      try {
        setIsLoading(true);

        console.log('fetching');
        console.log('auth token', process.env.REACT_APP_HS_ACCESS_TOKEN);
        console.log('process.env', process.env);

        const response = await axios.get(url, config);

        if (response.status === 200) {
          const cards = response.data.cards;

          const typedCards = cards.map((card: any) => {
            const newBg: IBattleground = {
              _id: card.id,
              tier: card.battlegrounds.tier,
              hero: card.battlegrounds.hero,
              quest: card.battlegrounds.quest,
              reward: card.battlegrounds.reward,
              image: card.battlegrounds.image,
              duosOnly: card.battlegrounds.duosOnly,
              solosOnly: card.battlegrounds.solosOnly,
            };
            const newCd: ICard = {
              _id: card.id,
              name: card.name,
              minionTypeId: card.minionTypeId,
              cardTypeId: card.cardTypeId,
              multiTypeIds: card.multiTypeIds,
              health: card.health,
              attack: card.attack,
              text: card.text,
              image: card.image,
              cropImage: card.cropImage,
              battlegrounds: newBg,
            };
            return newCd;
          });
          setAllCards(typedCards);
          setMinionCards(minions(typedCards));
          setHeroCards(heros(typedCards));
          setQuestCards(quests(typedCards));
          setRewardCards(rewards(typedCards));
          setIsLoading(false);

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
  }, []);

  const batchDelete = useCallback(
    (cards: ICard[]) => {
      cards.forEach(card => {
        const bg = realm.objectForPrimaryKey(Battleground, card._id);
        if (bg) {
          deleteBattleground(card._id);
        }
        const cd = realm.objectForPrimaryKey(Card, card._id);

        if (cd) {
          deleteCard(card._id);
        }
      });
    },
    [deleteBattleground, deleteCard, realm],
  );

  const batchCreate = useCallback(
    (cards: ICard[]) => {
      cards.forEach(card => {
        const bg = realm.objectForPrimaryKey(Battleground, card._id);
        if (!bg) {
          const newBg: IBattleground = {
            _id: card._id,
            hero: card.battlegrounds?.hero,
            quest: card.battlegrounds?.quest,
            reward: card.battlegrounds?.reward,
            duosOnly: card.battlegrounds?.duosOnly,
            solosOnly: card.battlegrounds?.solosOnly,
            image: card.battlegrounds?.image,
          };
          createBattleground(newBg);
        }
        const cd = realm.objectForPrimaryKey(Card, card._id);
        if (!cd) {
          const newCd: ICard = {
            _id: card._id,
            name: card.name,
            minionTypeId: card.minionTypeId,
            cardTypeId: card.cardTypeId,
            multiTypeIds: card.multiTypeIds,
            health: card.health,
            text: card.text,
            image: card.image,
            cropImage: card.cropImage,
          };
          createCard(newCd);
        }
      });
    },
    [createBattleground, createCard, realm],
  );

  useEffect(() => {
    // batchDelete(allCards);
    batchCreate(allCards);
  }, [allCards, batchCreate, batchDelete]);

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
