export enum CacheKeys {
  Bootstrap = 'bootstrap',
  FeatureSwitch = 'feature_switch',
  ThirdPartyAppsVersion = 'third_party_apps_version',
  PaymentComponentVersion = 'payment_component_version',
}

export enum CacheExpires {
  Default = 60 * 5,
  ThirdPartyAppsVersion = 60 * 60 * 24 * 90,
  Locale = 60 * 60 * 24 * 14,
  TemplateDynamicComponent = 60 * 60 * 24 * 30,
  ShopDynamicComponent = 60 * 30,
}

export enum CookieKeys {
  Digest = 'vsf_digest',
}

export enum StoreClass {
  Default = 'default',
  Clone = 'clone',
}
