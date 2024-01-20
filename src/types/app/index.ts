import { Logger } from '@bogeychan/elysia-logger/src/types';
import fs from 'fs';
export type UseCallbacks<T> = {
  add(handler: T): void;
  reset(): void;
  list(): T[];
};
export async function readFile(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path,
      {
        encoding: 'utf8',
        flag: 'r',
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}
export enum CacheKeys {
  Bootstrap = 'bootstrap',
  FeatureSwitch = 'feature_switch',
  ThirdPartyAppsVersion = 'third_party_apps_version',
  PaymentComponentVersion = 'payment_component_version',
}
export function useCallbacks<T>(): UseCallbacks<T> {
  let handlers: T[] = [];

  function add(handler: T): () => void {
    handlers.push(handler);
    return () => {
      const i = handlers.indexOf(handler);
      if (i !== -1) {
        handlers.splice(i, 1);
      }
    };
  }

  function reset() {
    handlers = [];
  }

  return {
    add,
    list: () => handlers,
    reset,
  };
}

export type Shop = {
  id: number;
  name: string;
  domain: string;
  email: string;
  phone: string;
  address: Address;
  currency: Currency;
  default_currency: Currency;
  locale: Locale;
  platform: Platform;
  size_chart: boolean;
  print_base: Printbase;
  robots_txt?: string;
  sub_domain?: string;
  full_domain?: string;
  logo: string;
  logo_alternative: string;
  package_id: number;
  profile?: SocialProfile;
  country_code?: string;
  buyer_ab_test?: string;
  use_translation?: boolean;
};

type ExternalDomainState = {
  whitelist: Array<string>;
};

export type SecureMonitorState = {
  enable: boolean;
  external_domain: ExternalDomainState;
};

export type CSPState = {
  enable: boolean;
  report_only: boolean;
  policy: string;
  nonce_format: string;
  report_to: string;
  report_uri: string;
};

export type SecureState = {
  csp_checkout: CSPState;
  monitor: SecureMonitorState;
  public_key: string;
};

export type Theme = {
  customized?: boolean;
};

export interface SSRBootstrap {
  theme: Theme;
  secure: SecureState;
  shop: Shop;
  cdn: Cdn;
  navigation: Navigation;
}

export type SSRContext = {
  id: string;
  host: string;
  url: string;
  baseUrl: string;
  state?: RootState;
  isRender: boolean;
  cookie: any;
  userAgent: string;
  isPreview: boolean;
  isPlayground: boolean;
  previewId: number;
  templateId: number;
  isPreviewTemplate: boolean;
  isDebug: boolean;
  modules?: Array<any>;
  bootstrap?: SSRBootstrap;
  theme?: VuePlugin;
  endpoint: string;
  themeManifest?: any;
  featureSwitch?: FeatureSwitch;
  storeClass: 'default' | 'clone';
  query: unknown;
  logger?: Logger;
  isGoogleBot: boolean;
  landingManifest?: any;
  landing?: VuePlugin;
  isCN: boolean;
  headClient?: HeadClient;
  addPreloadImage?: () => void;
  locale?: string;
  feature?: string;
  globalMarket?: string;
  globalMarketCurrency?: string;
  getInlineStyles?: (state: RootState) => InlineCss;
  dynamicComponents?: Array<DynamicComponentContext>;
  forwardHeaders: Record<string, string | Array<string>>;
  vm?: NodeVM;
  base: string;
  route_as_home_domain?: string;
  isCheckout: boolean;
  localePath?: string;
  isPreviewSitePage?: boolean;
  xRayId: string;
  xLang?: string;
  isLighthouse: boolean;
};

export type StoreClass = 'default' | 'clone';

export type SetCacheOptions = {
  type: string;
};

export interface Cache {
  isReady(): Promise<void>;

  get(key: string): Promise<string>;
  hget(key: string, field: string): Promise<string>;

  set(
    key: string,
    value: string,
    ttl?: number,
    options?: SetCacheOptions
  ): void;
  hset(
    key: string,
    field: string,
    value: string,
    ttl?: number,
    options?: SetCacheOptions
  ): void;
  expire(key: string, ttl: number): void;

  del(key: string): void;
  hdel(key: string, field: string): void;
}
