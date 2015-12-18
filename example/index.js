/*
 * Action Creators
 */

function actionCreator () {
  return {
    type: 'AN_ACTION'
  }
}

console.log(actionCreator())
// Output: { type: 'AN_ACTION' }

/*
 * Action creator which passes data
 */

function passInfo (info1, info2) {
  return {
    type: 'PASS_INFO_ACTION',
    someData: info1,
    someOtherData: info2
  }
}

console.log(passInfo('Hello', 'World'));

/*
 * Output:
 * { type: 'PASS_INFO_ACTION',
 *   someData: 'Hello',
 *   someOtherData: 'World' }
*/


/*
 * A simple store
 */

import { createStore, combineReducers } from 'redux'
const store = createStore(() => {})

/*
 * A simple store + reducer
 */

const reducer = function (state, action) {
  console.log(`The reducer was called with state ${state}`)
  console.log(action)
}

const anotherStore = createStore(reducer)

/*
 * More in-depth reducer example
 */

const simpleReducer = function (state = {}, action) {
  console.log('a reducer was called with the state', state, 'and action', action)

  switch (action.type) {
    case 'SIMPLE_ACTION':
      return {
        ...state,
        data: action.data
      }
    default:
      return state
  }
}

const simpleStore = createStore(simpleReducer)


const reducerOne = function (state = {}, action) {
  console.log('reducerOne was called with state', state, 'and action', action)
  switch (action.type) {
    default:
      return state
  }
}

const reducerTwo = function (state = {}, action) {
  console.log('reducerTwo was called with state', state, 'and action', action)
  switch (action.type) {
    default:
      return state
  }
}

const combinedReducer = combineReducers({
  one: reducerOne,
  two: reducerTwo
})

const newStore = createStore(combinedReducer)
console.log('store state after initialization', newStore.getState())
