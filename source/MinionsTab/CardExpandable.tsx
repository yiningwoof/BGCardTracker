import React from 'react';
import {View, Image, Text} from 'react-native';
import Expandable from './Expandable';

export default function CardExpandable({title, card}) {
  const Child = () => {
    return (
      <View key={card.id}>
        <Image
          source={card.battlegrounds.image}
          style={{width: 300, height: 400}}></Image>
        <Text>{card.name}</Text>
      </View>
    );
  };

  return (
    <Expandable
      title={title}
      isCardExpandable={true}
      imageBackgroundSrc={card.cropImage}>
      <Child />
    </Expandable>
  );
}
