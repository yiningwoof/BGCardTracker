import React from 'react';
import Expandable from './Expandable';
import TypeCluster from './TypeCluster';
import {ICard} from '../LandingPage';

const types = [
  {
    value: 20,
    label: 'Beast',
  },
  {
    value: 15,
    label: 'Demon',
  },
  {
    value: 24,
    label: 'Dragon',
  },
  {
    value: 18,
    label: 'Elemental',
  },
  {
    value: 14,
    label: 'Murloc',
  },
  {
    value: 92,
    label: 'Naga',
  },
  {
    value: 17,
    label: 'Mech',
  },
  {
    value: 23,
    label: 'Pirate',
  },
  {
    value: 43,
    label: 'Quilboar',
  },
  {
    value: 11,
    label: 'Undead',
  },
  {
    value: -1,
    label: 'No Type',
  },
  {
    value: 26,
    label: 'All Type',
  },
];
export default function TierExpandable({
  title,
  cards,
}: {
  title: string;
  cards: ICard[];
}) {
  const ChildCards = () => {
    return types.map(type => (
      <TypeCluster
        type={type.label}
        key={type.label}
        cards={
          type.value === -1
            ? cards.filter(card => !card.minionTypeId)
            : cards.filter(card => {
                return (
                  (card.minionTypeId && card.minionTypeId === type.value) ||
                  (card.multiTypeIds && card.multiTypeIds.includes(type.value))
                );
              })
        }
      />
    ));
  };

  return (
    <Expandable title={title}>
      <ChildCards />
    </Expandable>
  );
}
