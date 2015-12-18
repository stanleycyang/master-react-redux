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
- Provider & connect

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

Now that we have set up a basic state and gained a basic understanding of Redux, we can now tie it together with dispatchers.

## Dispatchers

