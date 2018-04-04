import {axiosBackend} from "./index";
import * as ActionConstants from "../constants/ActionConstants";
import {omit, startsWith, endsWith} from 'lodash';

const URL_PREFIX = 'rest/history';

export function logAction(action, author, timestamp) {
    if (!startsWith(action.type, 'LOAD') && !endsWith(action.type, 'PENDING') && !startsWith(action.type, 'SET') && !startsWith(action.type, 'UNLOAD')) {
        const payload = JSON.stringify(omit(action, 'type'));
        axiosBackend.post(URL_PREFIX, {author, timestamp, type: action.type, payload: payload !== '{}' ? payload : null});
    }
}

export function loadActions(pageNumber, authorUsername = null, actionType = null) {
    let urlSuffix = `?page=${pageNumber}`;
    if (authorUsername){
        urlSuffix = `${urlSuffix}&author=${authorUsername}`;
    } else if (actionType) {
        urlSuffix = `${urlSuffix}&type=${actionType}`;
    }
    return function (dispatch) {
        dispatch({type: ActionConstants.LOAD_ACTIONS_HISTORY_PENDING});
        axiosBackend.get(`${URL_PREFIX}${urlSuffix}`).then((response) => {
            dispatch({type: ActionConstants.LOAD_ACTIONS_HISTORY_SUCCESS, actionsHistory: response.data});
        }).catch((error) => {
            dispatch({type: ActionConstants.LOAD_ACTIONS_HISTORY_ERROR, error: error.response.data});
        });
    }
}

export function loadActionByKey(key) {
    return function (dispatch) {
        dispatch({type: ActionConstants.LOAD_ACTION_HISTORY_PENDING});
        axiosBackend.get(`${URL_PREFIX}/${key}`).then((response) => {
            dispatch({type: ActionConstants.LOAD_ACTION_HISTORY_SUCCESS, actionHistory: response.data});
        }).catch((error) => {
            dispatch({type: ActionConstants.LOAD_ACTION_HISTORY_ERROR, error: error.response.data});
        });
    }
}