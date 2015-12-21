/*
 * Note: EXECUTE THIS FILE WITH BABEL-NODE
 * To install, run 'npm i -g babel-cli'
 */

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

import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
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

/*
 * Dispatch
 */

// synchronous
function setName(name) {
  return {
    type: 'SET_NAME',
    name
  }
}

// asynchronous
function addBook(book) {
  return function (dispatch) {
    setTimeout(function () {
      dispatch({
        type: 'ADD_BOOK',
        book
      })
    }, 1000)
  }
}

// Initialize the reducer with the state of an empty object
const userReducer = function (state = {}, action) {
  console.log('userReducer was called with state', state, 'and action', action)

  // Check the type of action is dispatched
  switch (action.type) {
    case 'SET_NAME':
      // Return initial state, and the new name
      return {
        ...state,
        name: action.name
      }
    // Return the state to prevent it from getting set to null
    default:
      return state
  }
}

// Initialize the reducer with the state of an empty array
const booksReducer = function (state = [], action) {
  console.log('booksReducer was called with state', state, 'and action', action)
  // Check the type of action is dispatched
  switch (action.type) {
    case 'ADD_BOOK':
      // Return the initial state, and the newly added book
      return [
        ...state,
        action.book
      ]
    // Return state to prevent it from getting set to null
    default:
      return state
  }
}

// Combine the reducers together
const combineUserAndBooksReducers = combineReducers({
  user: userReducer,
  books: booksReducer
})

// Apply middleware
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)

// Create the store
const brandNewStore = createStoreWithMiddleware(combineUserAndBooksReducers)
console.log(brandNewStore.getState())

// Run sync function
brandNewStore.dispatch(setName('Stanley Yelnats'))
console.log('store has been changed to', brandNewStore.getState())

// Run async function
brandNewStore.dispatch(addBook('Harry Potter'))
console.log('store has been changed to', brandNewStore.getState())

// Subscribe
brandNewStore.subscribe(function () {
  console.log('brandNewStore has been updated. Latest store state: ', brandNewStore.getState())
  // Update the views here
})
