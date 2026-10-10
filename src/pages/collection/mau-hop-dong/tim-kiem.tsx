import type { GetServerSideProps } from 'next';

/** Keep existing bookmarks and filter parameters after moving the collection. */
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach(item => params.append(key, item));
    else if (typeof value === 'string') params.set(key, value);
  });
  const search = params.toString();
  return {
    redirect: {
      destination: `/collection/mau-hop-dong${search ? `?${search}` : ''}`,
      permanent: true,
    },
  };
};

export default function LegacyContractSearchPage() {
  return null;
}
