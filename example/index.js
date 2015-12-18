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

import { createStore } from 'redux'
const store = createStore(() => {})

/*
 * A simple store + reducer
 */

const reducer = function (state, action) {
  console.log(`The reducer was called with state ${state}`)
  console.log(action)
}

const simpleStore = createStore(reducer)
