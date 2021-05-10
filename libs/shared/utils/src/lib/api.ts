import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

const ApiRequest = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

const cache = setupCache({
  maxAge: 24 * 60 * 60 * 1000 // 30 min
})

const StaticRequest = axios.create({
  adapter: cache.adapter
});

export { ApiRequest, StaticRequest };
