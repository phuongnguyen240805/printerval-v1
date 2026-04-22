import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaPinterest,
  FaStar,
  FaLinkedin,
  FaRss,
} from 'react-icons/fa';
import {
  SiAmericanexpress,
  SiVisa,
  SiMastercard,
  SiPaypal,
  SiApplepay,
} from 'react-icons/si';


// Feature icons
import { BiGlobe, BiWallet, BiRefresh, BiSupport } from 'react-icons/bi';
import { RegionSelector } from '@/shared/components/RegionSelector';

const socialMedias = [
  { Icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook' },
  { Icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { Icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { Icon: FaYoutube, href: 'https://youtube.com', label: 'Youtube' },
  { Icon: FaTiktok, href: 'https://tiktok.com', label: 'Tiktok' },
  { Icon: FaPinterest, href: 'https://pinterest.com', label: 'Pinterest' },
  { Icon: FaStar, href: 'https://trustpilot.com', label: 'Trustpilot' },
  { Icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { Icon: FaRss, href: '/rss', label: 'RSS' },
];

const paymentMethods = [
  { Icon: SiAmericanexpress, label: 'American Express' },
  { Icon: SiVisa, label: 'Visa' },
  { Icon: SiMastercard, label: 'Mastercard' },
  { Icon: SiMastercard, label: 'Cash App' },
  { Icon: SiPaypal, label: 'PayPal' },
  { Icon: SiApplepay, label: 'Apple Pay' },
];

const features = [
  {
    icon: BiGlobe,
    title: 'Worldwide Shipping',
    description: 'Available as Standard or Express delivery',
  },
  {
    icon: BiWallet,
    title: 'Secure Payments',
    description: '100% Secure payment with 256-bit SSL Encryption',
  },
  {
    icon: BiRefresh,
    title: 'Free Return',
    description: 'Exchange or money back guarantee for all orders',
  },
  {
    icon: BiSupport,
    title: 'Local Support',
    description: '24/7 Dedicated support',
  },
];

export const Footer = () => {
  const footerLinks = {
    company: {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Payment methods', href: '/payment-methods' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Sitemap', href: '/sitemap' },
        { label: 'Blog', href: '/blog' },
        { label: 'Promo code', href: '/promo' },
      ],
    },
    customerSupport: {
      title: 'Customer Support',
      links: [
        { label: 'FAQs', href: '/faqs' },
        { label: 'Help Center', href: '/help' },
        { label: 'Order Tracking', href: '/tracking' },
        { label: 'Shipping & Delivery', href: '/shipping' },
        { label: 'Cancel/Change Order', href: '/cancel-order' },
        { label: 'Refund Policy', href: '/refund' },
        { label: 'Returns & Exchanges Policy', href: '/returns' },
        { label: 'DMCA', href: '/dmca' },
        { label: 'Intellectual Property Policy', href: '/ip-policy' },
      ],
    },
    partnerPortal: {
      title: 'Partner Portal',
      links: [
        { label: 'Sell on Printerval', href: '/footer/sell-your-product' },
        { label: 'Bulk Orders', href: '/bulk-orders' },
        { label: 'Affiliates', href: '/affiliates' },
        { label: 'Refer a Customer', href: '/refer-customer' },
        { label: 'Refer a Creator/Vendor', href: '/refer-creator' },
        { label: 'Help Center', href: '/partner-help' },
      ],
    },
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Features Section */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <feature.icon size={20} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-1 text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                priority
                src="/logo.png"
                alt="Printerval logo"
                width={150}
                height={40}
                quality={100}
              />
            </Link>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed max-w-md">
              Lacoste.com is a global online marketplace, where people come together to make, sell, buy, and collect unique items. There's no Printerval warehouse – just independent sellers selling the things they love. We make the whole process easy, helping you connect directly with makers to find something extraordinary.
            </p>

            {/* Social Media */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Follow us:</h3>
              <div className="flex flex-wrap gap-2">
                {socialMedias.map(({ Icon, href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition hover:bg-gray-300 hover:text-gray-900"
                    aria-label={label}
                  >
                    <Icon size={16} />
                  </Link>
                ))}
              </div>
            </div>



            {/* Support Ticket Button */}
            <button className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-orange-500 bg-white px-4 py-2 text-sm font-medium text-orange-500 transition hover:bg-orange-50">
              <span className="text-lg">💬</span>
              Open A Support Ticket
            </button>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">{footerLinks.company.title}</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-600 transition hover:text-gray-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">{footerLinks.customerSupport.title}</h3>
            <ul className="space-y-2.5">
              {footerLinks.customerSupport.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-600 transition hover:text-gray-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partner Portal & Newsletter */}
          <div className='col-span-2'>
            <h3 className="text-sm font-bold text-gray-900 mb-4">{footerLinks.partnerPortal.title}</h3>
            <div className='flex justify-between'>
              <ul className="space-y-2.5 mb-6">
                {footerLinks.partnerPortal.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-600 transition hover:text-gray-900">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Trust Badges */}
              <div className="space-y-2 mb-6">
                <Image
                  src="/assets/business-trust-seal-trust-lock.webp"
                  alt="Verified Business"
                  width={100}
                  height={50}
                  className="rounded"
                  style={{ width: 'auto', height: 'auto' }}
                />
                <Image
                  src="/assets/privacy-trust-seal-trust-lock.webp"
                  alt="Verified Safe Privacy"
                  width={100}
                  height={50}
                  className="rounded"
                  style={{ width: 'auto', height: 'auto' }}
                />
                <Image
                  src="/assets/DMCA_logo-grn-btn150w.png"
                  alt="DMCA Protected"
                  width={100}
                  height={50}
                  className="rounded"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>

            </div>
            {/* Newsletter */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">Never miss out on a moment</h3>
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                Stay updated with the latest trends, exclusive offers, and exciting updates by signing up for our newsletter. Secret privileges for your purchase will be delivered straight to your inbox.
              </p>
              <div className="relative">
                <input
                  type="email"
                  placeholder="😊 Your email address"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-12 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-500 transition hover:text-orange-600">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                By clicking Subscribe, you agree to our{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>{' '}
                and to receive our promotional emails (opt out anytime).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <RegionSelector />
            </div>

            <div className="text-center text-sm text-gray-600">
              ©Lacoste. All Rights Reserved
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
