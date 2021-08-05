[![NPM Version][npm-image]][npm-url]

# React Native Modal

<h3>An improved modal implimentation for React Native - by  <a href="https://www.npmjs.com/~idiosync"><img width="100px" height="31px" valign="middle" src="https://storage.googleapis.com/idiosync-web-images/telescope/idiosync_very_small.png"></a></h3>

- Uses pure JS
- Does not use the additional native layer used by react-native's implementation
- Fixes Android bugs associated with touch events
- Uses hooks, rather than adding things to a component's render that aren't displayed
- Has four animation types
- No additional dependencies

## Installation

yarn:

```bash
$ yarn add @idiosync/react-native-modal
```

npm:

```bash
$ npm i @idiosync/react-native-modal
```

## Basic Usage

First, to use this library, you must wrap your entire app in with \<ModalContextLayer\>

```js
const App = () => {
  return (
    // NOTE: if you need to access any context from inside your modal, such as redux
    // you need to place the ModalContextLayer inside the provider for that context 
    <ModalContextLayer>
      {...App goes here...}
    </ModalContextLayer>
  )
}
```

The simplest implementation uses the useModal hook and controls viability
at the component where the hook is being used

```js
import { useModal } from "@idiosync/react-native-modal"

const SomeComponent = () => {
  const [modalIsVisible, setModalIsVisible] = useState(false)

  useModal(
    {
      // all config params are optional apart from renderModal
      renderModal: () => <MyModal onClose={() => setModalIsVisible(false)} someProp={someProp} />,
      onBackgroundPress: () => setModalIsVisible(false),
      animationTypeIn: AnimationType.SLIDE_TOP,
    },
    modalIsVisible,
    [someProp] // dependencies array to trigger rerenders. Empty array is passed by default
  )

  return (
    <OpenButton onPress={() => setModalIsVisible(true) />
  )
}
```

When using the useModalTrigger hook, the viability is handled automatically
and functions are returned to open and close the modal

```js
const SomeComponent = () => {
  // the onClose function is received via the render function
  // and passed into the modal component
  const { openModal, closeModal } = useModalTrigger({
    renderModal: ({ onClose }) => <MyModal onClose={onClose} />,
  })

  return (
    <>
      <OpenButton onPress={openModal} />
      <CloseButton onPress={closeModal} />
    </>
  )
```

Finally - a situation often arises in which a component has a series of
modals, all of which open based on a state, or a set of variables.
This can be streamlined with useModalSwitch

```js
const SomeComponent = () => {
  const [currentModal, setCurrentModal] = useState(MODAL_1)

  // The hook accepts an array or arrays. The nested arrays
  // contain the render function, the condition that specifies isVisible
  // and the modal options
  useModalSwitch([
    [
    { renderModal: () => <Modal1 onClose={() => setCurrentModal(MODAL_2)} /> },
      currentModal === MODAL_1,
    ],
    [
      {
        renderModal () => <Modal2 onClose={() => setCurrentModal(MODAL_3)} someParam={someParam} />,
        ...options,
        [someParam] // depencencies
      },
      currentModal === MODAL_2,
    ],
    [
      { renderModal:() => <Modal3 onClose={() => setCurrentModal(NONE)} /> },
      currentModal === MODAL_3,
    ]
  ])

  return (
    <SomeOtherComponent onShowModal={() => setModalIsVisible(true) />
  )
}
```

## Hook Interfaces

### useModal

Arguments:

- _config_ - config object for you modal - must include your renderModal function
- _isVisible_ - boolean that specifies whether the modal should be rendered
- _dependencies_ - An array of dependecied for shallow checking. When these change, the modal rerenders. They will often be the same as your modals properties 

Returned interface:

- _removeModal_ - Instantly removes modal with no out animation

### useModalTrigger

Arguments:

- _config_ - config object for you modal - must include your renderModal function
- _dependencies_ - An array of dependecied for shallow checking. When these change, the modal rerenders. 

Returned interface:

- _openModal_ - Triggers modal to start animating in
- _closeModal_ - Triggers modal to start animating out
- _removeModal_ - Instantly removes modal with no out animation

### useModalSwitch

Arguments:

- _modalConfigArray_ - An array of arrays, each with 2 / 3 elements
- [0] - _config_ - config object for you modal - must include your renderModal function
- [1] - _isVisible_ - boolean that specifies whether the modal should be rendered
- [2] - _options_ (optional) - Modal options

## Config

- _renderModal_- Render function which is passed an interface, and returns your bespoke modal component 
- _onBackgroundPress_(optional) - Callback triggered by the background being pressed
- _animationTypeIn_(optional) - Animation type used when modal appears
- _animationTypeOut_(optional) - Animation type used when modal disappears
- _backgroundFadeDuration_(optional) - The time taken for the background to animate
- _backgroundFadeOutDelay_(optional) - Time after which the background animates out once modal is closed
- _animationTimeIn_(optional) - Time taken to animate in
- _animationTimeOut_(optional) - Time taken to animate out
- _onModalClosed_(optional) - Called when modal start to animate out
- _onModalRemoved_(optional) - Called when animation out is completed, and modal is removed
 

## Animation Types

Animations types found on the AnimationType enum

- _FADE_ - Fade in or out
- _SLIDE_TOP_ - Slide in from, or out to the top of the screen
- _SLIDE_BOTTOM_ - Slide in from, or out to the bottom of the screen
- _SLIDE_LEFT_ - Slide in from, or out to the left of the screen
- _SLIDE_RIGHT_ - Slide in from, or out to the right of the screen

[npm-image]: https://img.shields.io/npm/v/@idiosync/react-native-modal
[npm-url]: https://www.npmjs.com/package/@idiosync/react-native-modal
