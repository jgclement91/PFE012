import * as React from 'react';
import { connect } from 'react-redux';
import { map, filter } from 'lodash';
import List from '../PeripheralList';
import ListItem from '../../components/Thermostats/ListItem';
import type { thermostat } from './reducer';
import * as Actions from './actions';
import * as NavigationActions from '../Navigation/actions';

type Props = {
  requestThermostatsList: () => void,
  onCreate: () => {},
  onModify: (itemIdList: Array<number>, thermostats: Array<thermostat>) => {},
  error: string,
  isFetching: boolean,
  thermostats: Array<thermostat>
};

type State = {
};

const mapStateToProps = (state, ownProps) => ({
  error: state.thermostats.list.error,
  isFetching: state.thermostats.list.isFetching,
  thermostats: state.thermostats.list.list,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestThermostatsList: () => {
    dispatch(Actions.requestThermostatsList());
  },
  onCreate: () => {
    dispatch(NavigationActions.goToCreateThermostat);
  },
  onModify: (itemIndexList, thermostats) => {
    // transform list indexes into peripheral ids
    const selectedItems = filter(thermostats, (item, id) => itemIndexList.includes(id));
    const selectedIds = map(selectedItems, i => i.id);
    dispatch(NavigationActions.goToModifyThermostat(selectedIds));
  }
});

@connect(mapStateToProps, mapDispatchToProps)
export default class Thermostats extends React.Component<Props, State> {
  componentWillMount() {
    this.props.requestThermostatsList();
  }

  render() {
    let { thermostats, onCreate, onModify, onItemPress } = this.props;
    let listItems = map(thermostats, (item, i) => {
      const props = {
        name: item.name,
        currentTemp: item.currentTemp,
        targetTemp: item.targetTemp,
        currentHumidity: item.currentHumidity,
        key: i
      }
      return <ListItem {...props}/>;
    });

    const listProperties = {
      title: 'Thermostats',
      listId: 'Thermostats',
      onCreate,
      onModify: (itemIndexList) => onModify(itemIndexList, thermostats),
      onItemPress: (itemIndex) => onModify([itemIndex], thermostats)
    }
    return (
      <List {...listProperties}>
        {listItems}
      </List>
    );
  }
}
