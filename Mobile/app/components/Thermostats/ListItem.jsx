// @flow
import React, { Component } from 'react';
import { View, Text } from 'native-base';
import shallowequal from 'shallowequal';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  name: string,
  currentTemp: string,
  targetTemp: string,
  currentHumidity: string
};

type State = {
};

export default class ThermoListItem extends Component<Props, State> {
  shouldComponentUpdate(nextProps, nextState){
    return !shallowequal(this.props, nextProps);
  }

  render() {
    const { name, currentTemp, targetTemp, currentHumidity } = this.props;
    return (
      <View>
        <Text>{name}</Text>
        <Text note>Temp. courante/cible (°C): {currentTemp}/{targetTemp}</Text>
        <Text note>Humidité courante: {currentHumidity}%</Text>
      </View>
    );
  }
}
