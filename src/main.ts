import {Aurelia} from 'aurelia-framework'
import environment from './environment';
import {I18N} from 'aurelia-i18n';
import Backend from 'i18next-xhr-backend';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources')
      .plugin('aurelia-i18n', (instance) => {
        let aliases = ['t', 'i18n'];
        instance.i18next.use(Backend);
        return instance.setup({
          backend: {
            loadPath: './locales/{{lng}}/{{ns}}.json',
          },
          ns:['common','navigation'],
          attributes: aliases,
          lng: 'de',
          fallbackLng: 'de',
          debug: false
        });
      });

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
