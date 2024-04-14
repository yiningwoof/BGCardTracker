import Realm, {BSON} from 'realm';

export const BattlegroundsSchema = {
  name: 'Battlegrounds',
  embedded: true,
  properties: {
    tier: 'number?',
    hero: 'bool?',
    quest: 'bool?',
    reward: 'bool?',
    image: 'string?',
  },
};

export class Card extends Realm.Object<Card> {
  _id!: BSON.ObjectId;
  name?: string;
  minionTypeId?: number;
  health?: number;
  attack?: number;
  text?: string;
  image?: string;
  cropImage?: string;
  multiClassIds?: {type: 'list'; objectType: number};
  battlegrounds?: 'Battlegrounds';
  owner_id!: string;
}
