import _ from "lodash";

export const routes = {
  spaces: "/DaosPage",
  createSpace: "/setup",
  runSpinGame:"/",
  proposal: "/:daoId/proposal/:proposalId",
  editProposal: "/:daoId/proposal/:proposalId/edit",
  space: "/:daoId",
  spaceAbout: "/:daoId/about",
  spaceSettings: "/:daoId/settings",
  createProposal: "/:daoId/create",
};

export const flatRoutes = _.map(routes, (value) => {
  return { path: value };
});


export const TOOLBAR_WIDTH = 60;
export const ZERO_ADDRESS = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c";

export const TELETGRAM_URL = "https://t.me/TONVoteSupportGroup";
export const WHITEPAPER_URL = 'https://www.orbs.com/white-papers/ton-vote/'
export const ABOUT_URL = "https://www.orbs.com/Orbs-Introduces-TON-vote/";
export const ABOUT_CHARS_LIMIT = 2350;
export const TITLE_LIMIT =   180;




export const MOBILE_WIDTH = 768;




export const ONE_WALLET_ONE_VOTE_URL =
  "https://github.com/orbs-network/ton-vote/blob/main/README.md#supported-strategies";

