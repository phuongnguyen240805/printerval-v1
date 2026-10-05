'use client';

export interface Product {
  id: string;
  handle: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  thumbnail_logo: string;
}

export interface Story {
  id: string;
  thumbnail_poster: string;
  videoUrl: string;
  product: Product;
}

const VIDEO_FALLBACKS = [
  'https://videos.pexels.com/video-files/5309381/5309381-uhd_1440_2560_25fps.mp4',
  'https://videos.pexels.com/video-files/4453258/4453258-uhd_1440_2560_25fps.mp4',
  'https://videos.pexels.com/video-files/7688533/7688533-uhd_1440_2560_30fps.mp4',
  'https://videos.pexels.com/video-files/6561284/6561284-uhd_1440_2560_24fps.mp4',
  'https://videos.pexels.com/video-files/5896379/5896379-hd_1080_1920_24fps.mp4',
];

const RAW_STORIES = [
  ['1006513', 'thumbnail-1791193088111.png', 'sports betting, sports betting sport gamblers, T-shirt', 16.95, 'sports-betting-sports-betting-sport-gamblers-t-shirt-p5626255'],
  ['1006512', 'thumbnail-1791193070645.png', 'StarTrekStar-fleet Command Hologram T-Shirts', 14.95, 'startrekstar-fleet-command-hologram-t-shirts-p207390775'],
  ['1006509', 'thumbnail-1791192922666.png', 'Skeleton Ice Hockey T Shirt Halloween Funny Skull Gifts Tees 3294 Hoodies', 31.95, 'skeleton-ice-hockey-t-shirt-halloween-funny-skull-gifts-tees-3294-hoodies-p641696679'],
  ['1006505', 'thumbnail-1791192761882.png', 'RAMAKRISHNA Hoodies', 31.95, 'ramakrishna-hoodies-p2715253047'],
  ['1006504', 'thumbnail-1791192746455.png', 'Funyuns Onion T-Shirts', 16.95, 'funyuns-onion-t-shirts-p2265564702'],
  ['1006503', 'thumbnail-1791192709739.png', 'Halloween Mickoy Friends Costume Boxes Manches Longues Hoodies', 31.95, 'halloween-mickoy-friends-costume-boxes-manches-longues-hoodies-p585174113'],
  ['1006501', 'thumbnail-1791192618311.png', 'Ringo Starr and His All-Starr Band 2026 Tour Dates T-Shirt', 16.95, 'ringo-starr-and-his-all-starr-band-2026-tour-dates-t-shirt-p2729453705'],
  ['1006499', 'thumbnail-1791192548814.png', 'Tina Turner RIP 1939-2023 Shirt, Tina Turner Musical Souvenir Shirt', 17.95, 'tina-turner-rip-1939-2023-shirt-p42359578'],
  ['1006497', 'thumbnail-1791192478337.png', 'Art Join Starfleet Poster, Home Decor', 12.95, 'art-join-starfleet-poster-home-decor-p323786316'],
  ['1006496', 'thumbnail-1791192452792.png', 'Netflix logo T-Shirts', 16.95, 'netflix-logo-t-shirts-p50077100'],
] as const;

const MOCK_STORIES: Story[] = RAW_STORIES.map((story, index) => {
  const [id, image, name, price, handle] = story;
  const poster = `/assets/home-reference/story/${image}`;

  return {
    id,
    thumbnail_poster: poster,
    videoUrl: VIDEO_FALLBACKS[index % VIDEO_FALLBACKS.length]!,
    product: {
      id: `story-product-${id}`,
      handle,
      name,
      price,
      images: [poster],
      thumbnail_logo: poster,
    },
  };
});

export function useStoryData() {
  return { stories: MOCK_STORIES, isLoading: false };
}
