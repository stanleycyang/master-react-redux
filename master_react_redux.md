# Mastering React Redux

> **Redux** is a popular unidirectional framework to use with **ReactJS**. It uses a data structure to maintain the application's current state. My goal is to teach you the fundamental concepts of Redux in a clear and concise manner.

## Objectives

- Understanding the unidirectional data flow
- Installing React Redux dependencies
- Write an action creator
- Understanding the state in Redux
- Changing the state via reducers
- Dispatching synchronous and asynchronous actions
- Using middleware in redux
- Applying the subscriber

## What is [Redux](https://github.com/rackt/redux)?

> Redux is a predictable state container for JavaScript apps.
	
> It helps you write applications that behave consistently, run in different environments (client, server, and native), and are easy to test. On top of that, it provides a great developer experience, such as live code editing combined with a time traveling debugger.

Source: [Redux Github](https://github.com/rackt/redux)

In order to understand Redux, we will need to understand the Flux way of implementation and the unidirectional data flow.

## Unidirectional data flow

![Unidirectional data flow](https://facebook.github.io/flux/img/flux-simple-f8-diagram-with-client-action-1300w.png)

*Source: [React Github](https://facebook.github.io/flux/img/flux-simple-f8-diagram-with-client-action-1300w.png)*

All web applications are composed of 3 simple components: 

	1) Presentation (View)
	2) Data
	3) Logic to retrieve data and react to user events

Simply put, the diagram above works as such:

	1) a user clicks on button "A"
	2) a handler on button "A" triggers an action that is dispatched 
	3) the store (A.K.A. the application state) produces a change 
	4) ReactJS does a diff between the current state versus the info that changed and re-renders just that portion of the view

By using Redux with ReactJS, we will see data flow from the top-down (via props) from '**smart**' components to '**dumb**' React components.

**Smart** components:

- Wrap one or more dumb or smart components
- Hold state from the store and passes it as an object to dumb components
- Rarely emit DOM of its own, therefore no need for CSS

**Dumb** components: 

- Have no dependencies on the rest of the app
- Receive data and callbacks exclusively from props
- Rarely have their own state
- Has its own styles (CSS) and DOM

**Benefits of this Approach**

- Separation of concerns.
- Modular and reusable code. Dumb components can be used with different state source

Now that we have gained a high level overview, let's dive into how Redux works.

> **Note:** To follow along, create a directory called **mastering-redux** and inside it, make an **index.js**. After you have done this, run **npm install -S redux react-redux**

## Actions

An **action** in Redux is simply an object which contains the **type** property. An action will look something like this:

```js
{
	type: 'AN_ACTION'
}
```

## Action Creators

In Redux, an action creator is simply a function that returns an action, as follows:

```js
function actionCreator() {
	return {
		type: 'AN_ACTION'		
	}
}

console.log(actionCreator())
// Output: { type: 'AN_ACTION' }
```

It is a convention to include the type to allow Redux to know how to handle the action. You can also pass additional data within the object, as such:

```js
function passInfo (info1, info2) {
	return {
		type: 'PASS_INFO_ACTION',
		someData: info1,
		someOtherData: info2
	}
}

console.log(passInfo('Hello', 'World'))

/* Output
 * { type: 'PASS_INFO_ACTION',
 *   someData: 'Hello',
 *   someOtherData: 'World' }
 */
```

Later on, we will see action creators return functions to perform asynchronous tasks.

## Store

Actions inform us that something happened and also passes the data that needs to be updated. In Redux, a **store** is a container which provides a place to store all the data for the duration of the component lifecycle. 

A store looks likes this: 

```js
import { createStore } from 'redux'
var store = createStore(() => {})
```

Notice how I am putting a function (`() => {}`) within the store? It is because `createStore` expects a function which will allow it to modify the state. 

## Reducers

Now that we understand the Store holds the data of our application, we now arrive at reducers. A reducer in Redux simply modifies the current store (or state) when called.

Let's look at the simple store again:

```js
// A simple reducer
const reducer = function (state, action) {
  console.log(`The reducer was called with state ${state}`)
  console.log(action)
}

// A simple store
import { createStore } from 'redux'
const store = createStore(reducer)

// Output: Reducer was called with args [ undefined, { type: '@@redux/INIT' } ]
```

In this example, we see that our reducer is actually called even though no actions were dispatched. That's because to initialize the state of the application, Redux actually dispatches an `init` action `({type: '@@redux/INIT' })`.

In this `init` call, a reducer is given the parameters **state** and **action**. 

The **state** reflects the data currently maintained in this application.

The **action** reflects the action which has been dispatched to modify the state.

Let's get more in-depth on the topic of **reducers** to fully understand its usage:

```js

import { createStore } from 'redux'

// Initialize, this time we provide a state
const reducer = function (state = {}, action) {

	console.log('a reducer was called with the state', state, 'and action', action)
	
	// Wait for actions to dispatch, then change the state
	switch (action.type) {
		case 'SIMPLE_ACTION':
			return {
				...state,
				data: action.data
			}
		// IMPORTANT! Always have a default returning the state.
		default:
			return state
	}
}

const store = createStore(reducer)
// Output: a reducer was called with state {} and action { type: '@@redux/INIT' }

console.log('store state after initialization:', store.getState())
// Output: redux state after initialization: {}

```

In this reducer, we will initialize with a state (an empty object). 

Within a reducer, it will wait for an action to dispatch and handle it based on the case. In this example, we only have the case of `SIMPLE_ACTION`. 

It is important to always remember the default case! If you don't you will end up having your state return `undefined`.	

If you have multiple reducers,  you can simply combine them like the following example:

```js
import { createStore, combineReducers } from 'redux'

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

const reducer = combineReducers({
	one: reducerOne,
	two: reducerTwo
})

const store = createStore(reducer)
console.log('store state after initialization', store.getState())

// Output:
//reducerOne was called with state {} and action { type: '@@redux/INIT' }
// reducerOne was called with state {} and action { type: '@@redux/PROBE_UNKNOWN_ACTION_w.r.m.s.p.b.n.8.k.t.9' }
// reducerTwo was called with state {} and action { type: '@@redux/INIT' }
// reducerTwo was called with state {} and action { type: '@@redux/PROBE_UNKNOWN_ACTION_6.d.p.m.k.q.y.f.1.o.r' }
// reducerOne was called with state {} and action { type: '@@redux/INIT' }
// reducerTwo was called with state {} and action { type: '@@redux/INIT' }
// store state after initialization { one: {}, two: {} }
```

The ability to combine reducers allows the programmer to modularize and organize their code in a more coherent fashion. 

Let's take a look at this output:

```
{} and action { type: '@@redux/PROBE_UNKNOWN_ACTION_6.d.p.m.k.q.y.f.1.o.r' }
```

This is a sanity check performed by combineReducers to assure that a reducer will always return a state that is defined. 

Our new current state will look something like this:

```js
{
	one: {}, // slice returned by reducerOne
	two: {} // slice return by reducerTwo
}
```

Now that we have set up a basic state and gained a basic understanding of Redux, we can now tie it together by dispatching actions.

## Dispatch

We have created a store, reducers, and actions in the previous examples. It's time to put it all together and really see Redux in action!

Essentially, a dispatch 

In this next example, we're going to see how Redux handles [synchronous and asynchronous](http://www.cs.unc.edu/~dewan/242/s06/notes/ipc/node9.html) functions. If you are following along, you will need to run `npm install -S redux-thunk`. 

### What is a [thunk?!](https://github.com/gaearon/redux-thunk)

In short, it delays the evaluation of the code until its called. 

```js
// calculation of 1 + 2 is immediate
// x === 3
let x = 1 + 2;

// calculation of 1 + 2 is delayed
// foo can be called later to perform the calculation
// foo is a thunk!
let foo = () => 1 + 2;
```

We will also be `applyMiddleware` functionality from `redux`. This will allow us to apply the `redux-thunk` as a middleware to our store.

Go ahead and run write this code snippet:

```js
import { createStore, combineReducers, applyMiddleware } from 'redux'

// We need the thunk to delay the evaluation in async functions
import thunk from 'redux-thunk'

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

```

You should get an output that looks like this:

	userReducer was called with state {} and action { type: '@@redux/INIT' }
	userReducer was called with state {} and action { type: '@@redux/PROBE_UNKNOWN_ACTION_n.b.g.n.2.d.9.r.u.d.i' }
	booksReducer was called with state [] and action { type: '@@redux/INIT' }
	booksReducer was called with state [] and action { type: '@@redux/PROBE_UNKNOWN_ACTION_u.3.4.5.m.c.a.y.v.i' }
	userReducer was called with state {} and action { type: '@@redux/INIT' }
	booksReducer was called with state [] and action { type: '@@redux/INIT' }
	{ user: {}, books: [] }
	userReducer was called with state {} and action { type: 'SET_NAME', name: 'Stanley Yelnats' }
	booksReducer was called with state [] and action { type: 'SET_NAME', name: 'Stanley Yelnats' }
	store has been changed to { user: { name: 'Stanley Yelnats' }, books: [] }
	store has been changed to { user: { name: 'Stanley Yelnats' }, books: [] }
	userReducer was called with state { name: 'Stanley Yelnats' } and action { type: 'ADD_BOOK', book: 'Harry Potter' }
	booksReducer was called with state [] and action { type: 'ADD_BOOK', book: 'Harry Potter' }

Looking at this code, you can see that our store was initialized with our 2 reducers (userReducer and booksReducer).

**userReducer** was called with a state of an empty object *{}*.

**booksReducer** was called with a state of an empty array *[]*.

The synchronous method **setName** was called right away, modifying the name to '*Stanley Yelnats*'. It flows through both reducers to see if it finds a case within the switch statement which will modify the state.

Then the asynchronous method **addBook** was called. It in and added '*Harry Potter*' to the books value.

## Subscribe

At this point, we are very close to finishing the Flux loop. We need something to "watch" over our Redux store to check for updates. Fortunately, we can simply do the following:

```js
store.subscribe(function () {
	// retrieve latest store state here
	console.log(store.getState())
})
```

Let's try it out and add the `subscribe` functionality to our previous example:

```js
...

brandNewStore.subscribe(function() {
	console.log('brandNewStore has been updated. Latest store state: ', brandNewStore.getState())
})

...
```

Run your script again and at this point, you will see an output like this:

	brandNewStore has been updated. Latest store state:  { user: { name: 'Stanley Yelnats' }, books: [ 'Harry Potter' ] }

At this point, we now have a fully grasp of Redux and the Flux loop! 

In a future tutorial, I will cover how Redux works with ReactJS to really create a powerful yet modular application. Stay tuned!