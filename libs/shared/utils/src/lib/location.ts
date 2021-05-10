import { StaticRequest } from './api';
import { filter, last } from 'lodash';
import { STATES_MAP } from './states';

export interface ILocation {
  area?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
}

const url = ({ latitude, longitude }) =>
  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

export function getUserLocation(
  onResponse: (loc: ILocation) => void,
  onError: (error) => void
) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      StaticRequest.get(url({ latitude, longitude }))
        .then((res) => {
          const state = res.data.principalSubdivisionCode;
          let city = res.data.city;
          const area = res.data.locality;

          if (!city) {
            city = last(
              filter(
                res.data.localityInfo.administrative,
                (d) => d.geoNameId && d.name !== area
              )
            );
          }

          onResponse({
            city,
            state: state ? STATES_MAP[state] : state,
            area,
            latitude,
            longitude,
          });
        })
        .catch((err) => {
          console.error(err.data);
          onError(err.data);
        });
    },
    (error) => {
      onError(error);
      console.error(error);
    }
  );
}
