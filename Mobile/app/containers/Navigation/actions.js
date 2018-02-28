
import { NavigationActions } from "react-navigation";

export const goToMain = NavigationActions.navigate({
    routeName: 'Main'
})
export const goToConnection = NavigationActions.navigate({
    routeName: 'Connection'
})
export const goToCreateThermostat = NavigationActions.navigate({
    routeName: 'CreateThermostat'
})
export const goToModifyThermostat = (itemIdList) => NavigationActions.navigate({
    routeName: 'ModifyThermostat',
    params: {
      itemIdList
    }
})
export const goToRoute = (routeName) => NavigationActions.navigate({
    routeName: routeName
})
