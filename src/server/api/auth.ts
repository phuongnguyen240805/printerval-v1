import { type GetServerSidePropsContext } from 'next';

/**
 * Mock auth session for Cloudflare Workers compatibility
 * Returns null as next-auth has been removed
 */

export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return null;
};
