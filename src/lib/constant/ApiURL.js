const IS_BETA = process.env.CALL === 'beta';
const SUB_DOMAIN = IS_BETA ? 'beta-' : '';

export const API_PATH = `https://${SUB_DOMAIN}api.emforce.co.kr`;
export const ANALYTICS_PATH = `https://${SUB_DOMAIN}analytics.emforce.co.kr`;
