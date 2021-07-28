[![NPM Version][npm-image]][npm-url]

# Telescope

<h3>A cross platform, pure js modal implimentaion - by  <a href="https://www.npmjs.com/~idiosync"><img width="100px" height="31px" valign="middle" src="https://storage.googleapis.com/idiosync-web-images/telescope/idiosync_very_small.png"></a></h3>

- Uses pure JS
- Does not use the additional native layer used by react-native's implimentation
- Fixes Android bugs assosiated with touch events
- Uses hooks, rather than adding things to a component's render that aren't displayed
- Has four animation types

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

The simplist implimentaion uses the useModal hook and controls visability
at the component where the hook is being used

```js
import { useModal } from "@idiosync/react-native-modal"

const SomeComponent = () => {
  const [modalIsVisible, setModalIsVisible] = useState(false)

  // this config is optional
  const optioins = {
    onBackgroundPress: () => setModalIsVisible(false),
    animationTypeIn: AnimationType.SLIDE_TOP,
    animationTypeOut: AnimationType.SLIDE_BOTTOM,
  }

  useModal(
    () => <MyModal onClose={() => setModalIsVisible(false)} />,
    modalIsVisible
    optioins
  )

  return (
    <SomeOtherComponent onShowModal={() => setModalIsVisible(true) />
  )
}
```

[npm-image]: https://img.shields.io/npm/v/@idiosync/react-native-modal
[npm-url]: https://www.npmjs.com/package/@idiosync/react-native-modal
