const path = require('path');

module.exports = {
  // https://www.i18next.com/overview/configuration-options#logging
  debug: false,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
  },
  localePath: path.resolve('./public/locales'),
  ns: ['common', 'header', 'footer', 'home'],
  resources: {
    en: {
      common: require('./public/locales/en/common.json'),
      header: require('./public/locales/en/header.json'),
      footer: require('./public/locales/en/footer.json'),
      home: require('./public/locales/en/home.json'),
    },
    de: {
      common: require('./public/locales/de/common.json'),
      header: require('./public/locales/de/header.json'),
      footer: require('./public/locales/de/footer.json'),
      home: require('./public/locales/de/home.json'),
    },
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
