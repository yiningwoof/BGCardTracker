import Realm, {BSON} from 'realm';

export const BattlegroundsSchema = {
  name: 'Battlegrounds',
  embedded: true,
  properties: {
    tier: 'int?',
    hero: 'bool?',
    quest: 'bool?',
    reward: 'bool?',
    image: 'string?',
  },
};

export class Card extends Realm.Object<Card> {
  _id!: number;
  name!: string;
  minionTypeId?: number;
  health?: number;
  attack?: number;
  text?: string;
  image?: string;
  cropImage?: string;
  multiClassIds?: {type: 'list'; objectType: number};
  battlegrounds?: 'Battlegrounds';
  owner_id!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Card',
    primaryKey: '_id',
    properties: {
      _id: {type: 'int'},
      name: 'string',
      minionTypeId: 'int?',
      health: 'int?',
      attack: 'int?',
      text: 'string?',
      image: 'string?',
      cropImage: 'string?',
      owner_id: 'string',
    },
  };
}
