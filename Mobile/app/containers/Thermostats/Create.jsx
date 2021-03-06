import * as React from 'react';
import { connect } from 'react-redux';
import CreateThermostatComponent from '../../components/Peripheral/Create';
import * as Actions from './actions';

type Props = {
  submitPeripheral: (name: string, bluetoothAddress: string) => void,
  error: string,
  isFetching: boolean,
};

type State = {
};

const mapStateToProps = (state, ownProps) => ({
  error: state.thermostats.create.error,
  isFetching: state.thermostats.create.isFetching,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  submitPeripheral: (name, bluetoothAddress) => {
    dispatch(Actions.requestCreateThermostat(name, bluetoothAddress));
  },
});

@connect(mapStateToProps, mapDispatchToProps)
export default class CreateThermostat extends React.Component<Props, State> {

  render() {
    return (
      <CreateThermostatComponent {...this.props} />
    )
  }
}
