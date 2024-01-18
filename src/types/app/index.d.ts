export type Theme = {
  customized?: boolean;
};

export interface SSRBootstrap {
  theme: Theme;
}

export type SSRContext = {
  bootstrap?: SSRBootstrap;
};
