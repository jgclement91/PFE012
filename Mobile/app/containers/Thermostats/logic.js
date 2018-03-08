import { createLogic } from 'redux-logic';
import * as Constants from './constants';
import * as Actions from './actions';
import { AjaxUtils, StorageUtils } from '../../../utils';

export const requestThermostatsList = createLogic({
  type: Constants.requestThermostatsList,
  latest: true,
  process({ getState, action }, dispatch, done) {
    // TODO: remove after testing
    const newThermo = [];
    for(let i = 0; i < 5; i++){
      newThermo.push({
        id: i,
        name: `Thermo #${i}`,
        currentTemp: 20 + i,
        targetTemp: 18 + i,
        currentHumidity: 30 + i
      });
    }
    // end test
    const request = AjaxUtils.createPostRequest('state/request', {// TODO: find url
      username: getState().connection.username,
      token: getState().connection.token,
      peripheralId: 1
    });
    AjaxUtils.timeout(5000, request())
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        AjaxUtils.detectAndThrowServerError(data);
        if (data.Token == 'BAD_AUTHENTICATION') {
          dispatch(Actions.errorThermostatsList('Les informations sont invalides.'));
          dispatch(Actions.receiveThermostatsList(newThermo)); // TODO: Remove
        } else {
          let list = newThermo;
          if (data.deviceId) {
            list = [
              {
                id: data.deviceId,
                name: 'Thermo salon',
                currentTemp: data.currentTemperature,
                targetTemp: data.requestedTemperature,
                currentHumidity: data.currentHumidity,
              }
            ];
          }
          dispatch(Actions.receiveThermostatsList(list));
        }
      })
      .catch(() => {
        dispatch(Actions.errorThermostatsList('Une erreur est survenu lors de la connection avec le server.'));
        dispatch(Actions.receiveThermostatsList(newThermo)); // TODO: Remove
      })
      .then(() => done());
  }
});

export const requestModifyThermostat = createLogic({
  type: Constants.requestModifyThermostat,
  latest: true,
  process({ getState, action }, dispatch, done) {
    const loopRequest = (ids) => {
      if (ids.length > 0) {
        const id = ids[0];
        const remainingIds = ids.slice(1);
        const request = AjaxUtils.createPostRequest('state/change', {// TODO: find url
          username: getState().connection.username,
          token: getState().connection.token,
          peripheralId: id,
          value: action.targetTemp,
        });
        return AjaxUtils.performRequest(request, (data) => {
          dispatch(Actions.successfulModifyThermostat(data.value));
          if (remainingIds.length == 0) {
            dispatch(NavigationActions.goToRoute('Main'));
          }
        }, Actions.errorModifyThermostat, dispatch)
        .then(() => loopRequest(remainingIds));
      }
    };

    loopRequest(action.ids).then(() => done());
  }
});

export const requestCreateThermostat = createLogic({
  type: Constants.requestCreateThermostat,
  latest: true,
  process({ getState, action }, dispatch, done) {
    const request = AjaxUtils.createPostRequest('device/create', {// TODO: find url
      username: getState().connection.username,
      token: getState().connection.token,
      name: action.name,
      bluetoothAddress: action.bluetoothAddress,
      type: 'thermostat'
    });
    AjaxUtils.timeout(5000, request())
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        AjaxUtils.detectAndThrowServerError(data);
        if (data.Token == 'BAD_AUTHENTICATION') {
          dispatch(Actions.errorCreateThermostat('Les informations sont invalides.'));
        } else {
          dispatch(Actions.successfulCreateThermostat(data.value));
        }
      })
      .catch(() => {
        dispatch(Actions.errorCreateThermostat('Une erreur est survenu lors de la connection avec le server.'));
      })
      .then(() => done());
  }
});

export const startThermostatsListFetchInterval = createLogic({
  type: Constants.startThermostatsListFetchInterval,
  latest: true,
  transform({ getState, action, dispatch }, next) {
    let interval = getState().thermostats.list.interval;
    if (!interval) {
      interval = setInterval(() => {
        dispatch(Actions.requestThermostatsList());
      }, 2000);
    }
    next({
      ...action,
      interval
    });
  }
});
