// Configuration for your app
require('./src/graphql/extractFragmentTypes')

const env_dev =  require('./.env/env.dev.js')
const env_prod =  require('./.env/env.prod.js')

const ManifestPlugin = require('webpack-manifest-plugin');


module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'globalComponents',
      'apollo',
      'global-router-guards',
      'vue-youtube',
      'FCMPushNotifications',
    ],

    css: [
      'app.styl'
    ],

    extras: [
      'roboto-font',
      'material-icons', // optional, you are not bound to it
      // 'ionicons-v4',
      // 'mdi-v3',
      'fontawesome-v5',
      // 'eva-icons'
    ],

    framework: {
      // all: true, // --- includes everything; for dev only!
      // iconSet: 'fontawesome-v5',
      components: [
        'QLayout',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QCarousel',
        'QCarouselControl',
        'QCarouselSlide',
        'QDialog',
        'QPageContainer',
        'QPage',
        'QFab',
        'QFabAction',
        'QPageSticky',
        'QScrollArea',
        'QScrollObserver',
        'QSpace',
        'QStepper',
        'QStep',
        // 'QStepperNavigation',
        // 'QVideo',
        // 'QTabs',
        // 'QTab',
        // 'QRouteTab',
        'QBtn',
        // 'QBtnGroup',
        // 'QCheckbox',
        // 'QToolbar',
        // 'QFooter',
        // 'QHeader',
        'QImg',
        'QSpinnerPuff',
        // 'QSpinnerIos',
        'QSpinnerTail',
        'QIcon',
        // 'QList',
        // 'QItem',
        // 'QItemSection',
        // 'QItemLabel'
      ],

      directives: [
        // 'Ripple'
        'ClosePopup',
        'TouchSwipe',
      ],

      // Quasar plugins
      plugins: [
        // 'Notify'
      ],
      lang: 'de' // Quasar language
    },

    supportIE: false,

    build: {
      env: ctx.dev
      ? { // so on dev we'll have
        MODUS: env_dev.MODUS,
        ROOT_API: env_dev.ROOT_API,
        USER_PASSWORD: env_dev.USER_PASSWORD,
        TOKEN_ID: env_dev.TOKEN_ID,
        CHALLENGE_ID: env_dev.CHALLENGE_ID,
      }
      : { // and on build (production):
        MODUS: env_prod.MODUS,
        ROOT_API: env_prod.ROOT_API,
        USER_PASSWORD: env_prod.USER_PASSWORD,
        TOKEN_ID: env_prod.TOKEN_ID,
        CHALLENGE_ID: env_prod.CHALLENGE_ID,
      },
      
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        cfg.plugins.push(               
          new ManifestPlugin({
            fileName: 'asset-manifest.json',
          })
        ),
        cfg.module.rules.push({
          test: /\.(gql|graphql)$/,
          loader: 'graphql-tag/loader'
        })
      }
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    cordova: {
      id: 'org.bewirken.challenge.app',
      version: '0.0.1'
      // noIosLegacyBuildFlag: true // uncomment only if you know what you are doing
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
