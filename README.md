# metamask-provider-simulator

A custom provider which implements all metamask inpage api.

You can use it for auto testing(puppeter), or develop a custom wallet client.

Usage:
```
import {
  initProvider
} from 'metamaskSimulateProvider'

const myProvider = initProvider(
  rpcUrl, 
  chainid, 
  privateKey
);
```


# run example
```
yarn serve
```


# how to modify/develop this project
## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
