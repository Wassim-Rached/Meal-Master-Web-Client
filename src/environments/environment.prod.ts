import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  backendUrl: 'meals-master.azurewebsites.net',
};
