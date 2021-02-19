# adonis-jest

Jest preset for Adonis 5 support.

## Installation

```console
npm install adonis-jest
```

## Usage

Set `preset: 'adonis-jest'` in your Jest configuration:

```js
module.exports = {
  preset: 'adonis-jest',
};
```

Create the file `jest.setup.ts` with the following contents:

```ts
import { setupTestApplication } from 'adonis-jest';

setupTestApplication(__dirname);
```

For now, only a basic application can be setup. In the future, there will be
a way to setup a complete web server.
