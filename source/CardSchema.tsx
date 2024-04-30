import Realm from 'realm';

export class Card extends Realm.Object<Card> {
  _id!: number;
  name!: string;
  minionTypeId?: number;
  cardTypeId?: number;
  health?: number;
  attack?: number;
  text?: string;
  image?: string;
  cropImage?: string;
  multiTypeIds?: {type: 'list'; objectType: number};
  battlegrounds?: Battleground;
  owner_id!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Card',
    primaryKey: '_id',
    properties: {
      _id: 'int',
      name: 'string',
      minionTypeId: 'int?',
      cardTypeId: 'int?',
      multiTypeIds: {type: 'list', objectType: 'int', default: []},
      health: 'int?',
      attack: 'int?',
      text: 'string?',
      image: 'string?',
      cropImage: 'string?',
      owner_id: 'string',
      battlegrounds: 'Battleground?',
    },
  };
}

export class Battleground extends Realm.Object<Battleground> {
  _id!: number;
  tier?: number;
  hero?: boolean;
  quest?: boolean;
  reward?: boolean;
  image?: string;
  duosOnly?: boolean;
  solosOnly?: boolean;

  static schema: Realm.ObjectSchema = {
    name: 'Battleground',
    primaryKey: '_id',
    properties: {
      _id: 'int',
      tier: 'int?',
      hero: 'bool?',
      quest: 'bool?',
      reward: 'bool?',
      image: 'string?',
      duosOnly: 'bool?',
      solosOnly: 'bool?',
    },
  };
}
