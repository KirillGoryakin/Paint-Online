import ReactDOM from 'react-dom/client';
import { App } from './components/App';

import './assets/css/index.css';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: `cursive, sans-serif`,
    body: `cursive, sans-serif`,
  },
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);