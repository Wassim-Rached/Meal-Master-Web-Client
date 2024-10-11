import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  backendUrl: 'https://meals-master.azurewebsites.net',
};
