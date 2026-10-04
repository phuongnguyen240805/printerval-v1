"use client"
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { IconType } from 'react-icons';
import { FiHeart, FiShoppingBag, FiAlignJustify, FiX } from 'react-icons/fi';
import { SearchBar } from '@/packages/search/components/SearchBar';
import { TopBar } from './TopBar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { HeartHandshakeIcon, MapIcon, Package, Sparkles, User, UserCircle } from 'lucide-react';
import { GiFountainPen, GiPaintBrush } from 'react-icons/gi';
import { Badge } from '../../ui/badge';
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@/shared/ui/drawer";
import { Button } from '@/shared/ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger } from '@/shared/ui/navigation-menu';
import Sidebar from './SideBar';
import { navLinks, campaign, categories, blog, NavLink } from './data';
import { api } from '@/utils/api';
import { keysToRemove } from '@/pages/user/account';
import { WaterNavigation } from './WaterNavigation';

export const Header = ({ liquidGlass = true }: { liquidGlass?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [hoveredNavLink, setHoveredNavLink] = useState<NavLink | null>();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  let cartId: string = "";
  let wishlist: number = 0;
  if (typeof window !== "undefined") {
    cartId = localStorage.getItem("cart_id") || "";
    const wishlistString = localStorage.getItem("wishlist");
    const wishlistArray = wishlistString ? JSON.parse(wishlistString) : [];
    wishlist = wishlistArray.length;
  }

  const getToken = () => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("authToken") ?? localStorage.getItem("authToken") ?? undefined;
    }
    return undefined;
  };

  const accessToken = getToken();

  // get user
  const { data: customer, isLoading, error } = api.medusa.userDetail.useQuery(
    { accessToken: accessToken as string },
    {
      // Chỉ chạy query khi có token và đang ở client
      enabled: !!accessToken,
      retry: false,
      // Tránh fetch lại liên tục khi chuyển tab
      refetchOnWindowFocus: false,
    }
  );

  const user = useMemo(() => {
    if (!customer) return null;

    return {
      name: customer.first_name
        ? `${customer.first_name} ${customer.last_name || ''}`.trim()
        : customer.email,
      email: customer.email,
      // Medusa metadata thường là object
      avatar: (customer.metadata?.avatar as string) || undefined
    };
  }, [customer]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("medusa_user", JSON.stringify(customer));

      // Đồng bộ Cart ID theo Key riêng của User này
      const userCartKey = `medusa_cart_id_${customer?.id}`;
      const cartIdFromMetadata = customer?.metadata?.active_cart_id;

      if (cartIdFromMetadata) {
        localStorage.setItem(userCartKey, cartIdFromMetadata as string);
      }
    }
  }, [user, customer]);

  const handleShowMenu = (navLink: NavLink) => setHoveredNavLink(navLink);
  const handleCloseMenu = () => setHoveredNavLink(null);

  const sideNavLinks = useMemo<[string, IconType, number][]>(() => [
    ['/wishlist', FiHeart, wishlist],
    ['/cart', FiShoppingBag, cartCount],
  ], [cartCount, wishlist]);

  useEffect(() => {
    if (liquidGlass) return;
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          setIsHeaderVisible(false);
        } else {
          setIsHeaderVisible(true);
        }
        setLastScrollY(currentScrollY);
      }
    };
    window.addEventListener('scroll', controlHeader, { passive: true });
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY, liquidGlass]);

  const getSolidStyle = (name: string) => {
    switch (name) {
      case 'Create Your Own':
        return "bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent hover:brightness-25";
      case 'Order Tracking': return "text-black-600 hover:text-orange-500 hover:brightness-125";
      case 'Happy New Year': return "text-black-600 hover:text-orange-500 hover:brightness-125";
      case 'Product': return "text-black-600 hover:text-orange-500 hover:brightness-125";
      case 'Explore Designs': return "text-black-600 hover:text-orange-500 hover:brightness-125";
      case 'Free E-Cart': return "text-black-600 hover:text-orange-500 hover:brightness-125";
      case 'Blog': return "text-black-600 hover:text-orange-500 hover:brightness-125";
      default: return "text-black-600 hover:text-orange-500 hover:brightness-125";
    }
  };

  // logout handler
  const handleLogout = () => {
    // Thực hiện xóa
    keysToRemove.forEach(key => localStorage.removeItem(key));
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  return (
    <>
      {/* ✅ Sidebar nằm NGOÀI <header> để không bị z-index hay transform của header ảnh hưởng */}
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} />

      <header className={`${liquidGlass ? 'home-glass-header' : ''} sticky top-0 z-40 w-full transition-transform duration-300 ease-in-out ${isHeaderVisible || liquidGlass ? 'translate-y-0' : '-translate-y-full'}`}>
        <TopBar blogs={campaign} />

        {/* KHỐI HEADER CHÍNH */}
        <div className={`${liquidGlass ? 'home-glass-header-surface' : ''} relative w-full border-b border-black/5 z-30 shadow-sm`}
          style={{
            backgroundColor: '#fce4ec', // Màu nền hồng nhạt
            minHeight: '100px'
          }}
        >
          {/* Con thỏ bên trái (Ăn mì) */}
          <div className="home-header-art absolute left-0 bottom-0 h-full w-auto select-none pointer-events-none z-10 hidden min-[1400px]:block">
            <img
              src="https://res.cloudinary.com/dm1wqczhm/image/upload/v1774869889/tho1_pszhws.png"
              alt="rabbit-left"
              className="h-full object-contain object-left"
            />
          </div>

          {/* Con thỏ bên phải (Cầm áo) */}
          <div className="home-header-art absolute right-0 bottom-0 h-full w-auto select-none pointer-events-none z-10 hidden min-[1400px]:block">
            <img
              src="https://res.cloudinary.com/dm1wqczhm/image/upload/v1774869517/tho22_qeespt.png"
              alt="rabbit-right"
              className="h-full object-contain object-right"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="home-header-row flex items-center justify-between gap-4 lg:gap-8">

              {/* 1. Menu Icon Mobile & Logo */}
              <div className="flex items-center gap-4 w-auto">
                <button
                  onClick={() => setSidebar(true)}
                  className="xl:hidden p-1 -ml-1 flex items-center justify-center transition-opacity hover:opacity-60 focus:outline-none"
                  aria-label="Open Menu"
                >
                  <FiAlignJustify color="#111111" size={36} strokeWidth={1.5} className="cursor-pointer" />
                </button>

                <Link href="/" className="flex flex-shrink-0 items-center transition-opacity hover:opacity-80">
                  <Image className="home-header-logo w-auto h-20 md:h-20 object-contain" priority src="/logo.png" alt="Brand Logo" width={100} height={30} quality={100} />
                </Link>
              </div>

              {/* 2. Desktop Categories Dropdown */}
              <div className='hidden xl:block flex-shrink-0'>
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger className="flex items-center gap-2 font-Inter font-semibold text-[#111111] hover:text-gray-600 text-base text-[16px] transition-colors focus:outline-none">
                    {open ? <FiX size={30} /> : <FiAlignJustify size={17} />}
                    <span className="hidden sm:inline">Categories</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className={`${liquidGlass ? 'home-glass-popover' : '!bg-white'} rounded-xl overflow-hidden p-0 shadow-lg w-72 max-h-[500px] border border-gray-100`}>
                    <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent">
                      {categories?.map((item, index) => (
                        <DropdownMenuItem key={index} className="p-0 focus:bg-gray-50">
                          <Link
                            href={`/collection/${item.handle}`}
                            className="flex items-center gap-3 p-3 font-Inter w-full text-sm text-[#111111] transition-colors hover:bg-gray-50"
                            onClick={handleCloseMenu}
                          >
                            <Image
                              alt={item.name}
                              src={(item as any)?.product_category_image?.[0]?.url || '/placeholder.png'}
                              width={40}
                              height={40}
                              className="rounded-md w-10 h-10 object-cover border border-gray-100"
                            />
                            <span className="truncate">{item.name}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* 3. Search Bar */}
              <div className='home-header-search flex-grow max-w-2xl relative z-[100] hidden md:block'>
                <SearchBar liquidGlass={liquidGlass} />
              </div>

              {/* 4. Right Icons (User, Wishlist, Cart) */}
              <div className="home-header-actions flex items-center justify-end gap-5 flex-shrink-0">
                {user ? (
                  <>
                    <div className="hidden md:block">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-2 hover:opacity-80 transition-all focus:outline-none">
                          {/* Icon user */}
                          <User size={18} className="text-black" />
                          {/* Tên user */}
                          <span className=" font-Inter text-[16px] max-w-[100px] truncate">
                            {user.name}
                          </span>
                          {/* Icon dropdown */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className={`${liquidGlass ? 'home-glass-popover' : ''} w-56 mt-2 rounded-xl p-2 border-gray-100 shadow-lg`}>
                          <DropdownMenuItem asChild className="rounded-lg mb-1 cursor-pointer">
                            <Link href="/user/account" className="flex items-center gap-3 text-sm"><UserCircle size={16} /> User profile</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="rounded-lg mb-1 cursor-pointer">
                            <Link href="/orders" className="flex items-center gap-3 text-sm"><MapIcon size={16} /> Address book</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="rounded-lg mb-1 cursor-pointer">
                            <Link href="/orders" className="flex items-center gap-3 text-sm"><Package size={16} /> My orders</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="rounded-lg mb-1 cursor-pointer">
                            <Link href="/orders" className="flex items-center gap-3 text-sm"><HeartHandshakeIcon size={16} /> Loyalty program</Link>
                          </DropdownMenuItem>
                          <div className="h-px bg-gray-100 my-1"></div>
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600 rounded-lg flex items-center gap-3 text-sm hover:bg-red-50 hover:text-red-700"
                            onClick={() => {
                              handleLogout()
                              // sessionStorage.removeItem('authToken');
                              // localStorage.removeItem('authToken');
                              // window.location.href = '/signin';
                            }}
                          >
                            <GiFountainPen size={16} /> Logout
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Mobile User Drawer */}
                    <div className="md:hidden">
                      <Drawer>
                        <DrawerTrigger className='bg-[#111111] rounded-full flex justify-center items-center w-8 h-8 relative focus:outline-none'>
                          <User size={16} color='white' />
                        </DrawerTrigger>
                        <DrawerContent className={`${liquidGlass ? 'home-glass-popover' : 'bg-white'} p-4`}>
                          <div className="flex flex-col gap-2 mt-4">
                            <Link href="/user/account" className="w-full cursor-pointer flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-sm font-Inter"><UserCircle size={18} /> User profile</Link>
                            <Link href="/orders" className="w-full cursor-pointer flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-sm font-Inter"><MapIcon size={18} /> Address book</Link>
                            <Link href="/orders" className="w-full cursor-pointer flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-sm font-Inter"><Package size={18} /> My orders</Link>
                            <Link href="/orders" className="w-full cursor-pointer flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-sm font-Inter"><HeartHandshakeIcon size={18} /> Loyalty program</Link>
                            <div className='p-3 text-red-600 cursor-pointer flex items-center gap-3 hover:bg-red-50 rounded-lg text-sm font-Inter mt-2 border-t border-gray-100'
                              onClick={() => {
                                sessionStorage.removeItem('authToken');
                                localStorage.removeItem('authToken');
                                window.location.href = '/';
                              }}>
                              <GiFountainPen size={18} /> Logout
                            </div>
                          </div>
                          <DrawerClose className='absolute top-4 right-4'>
                            <Button variant="ghost" size={'icon'} className="rounded-full bg-gray-100"><FiX size={20} /></Button>
                          </DrawerClose>
                        </DrawerContent>
                      </Drawer>
                    </div>
                  </>
                ) : (
                  <Link href="/signin" aria-label="Sign in" className="relative flex items-center justify-center">
                    <User className="text-[#111111] transition-opacity hover:opacity-60 hidden md:block" size={22} />
                    <div className="rounded-full md:hidden flex gap-1.5 bg-[#111111] text-white text-[16px] items-center px-3 py-1.5 font-Inter">
                      <User size={14} /> Login
                    </div>
                  </Link>
                )}

                {/* Wishlist & Cart Icons */}
                {sideNavLinks.map(([url, Icon, number]) => {
                  const iconColor = 'text-black-600';
                  const badgeGlossy = "bg-[#F67273] ";

                  return (
                    <Link key={url} href={url} aria-label={url === '/cart' ? 'Shopping cart' : 'Wishlist'} className='relative flex items-center'>
                      <Icon className={`${iconColor} transition-transform duration-300 hover:text-orange-400`} size={22} />
                      {number > 0 && (
                        <Badge className={` pointer-events-none absolute overflow-hidden rounded-full text-[12px] font-Inter w-5 h-5 p-0 -top-1.5 -right-2 flex justify-center items-center text-white ${badgeGlossy} z-10`}>
                          <span className="relative z-10 ">{number}</span>
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {liquidGlass && (
            <div className="home-glass-mobile-search md:hidden px-4 pb-3 relative z-[100]">
              <SearchBar liquidGlass />
            </div>
          )}

          {/* NAVBAR DESKTOP */}
          <WaterNavigation enabled={liquidGlass} className="home-header-desktop-nav hidden lg:block max-w-7xl mx-auto">
            <ul className="flex items-center justify-center gap-6 ">
              {navLinks.map((item, index) => {
                const solidClasses = getSolidStyle(item.name);
                const textClasses = `font-Inter text-[16px] tracking-wide transition-all duration-300 ${solidClasses}`;

                if (item.collapsible) {
                  return (
                    <li className="flex-shrink-0 transition-transform duration-300 hover:scale-110" key={index}
                      onMouseEnter={() => handleShowMenu(item)}
                      onMouseLeave={handleCloseMenu}>
                      <NavigationMenu>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger data-water-item={liquidGlass ? '' : undefined} className={`bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent px-0 ${textClasses}`}>
                            {item.name}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid w-40 gap-1 p-2">
                              {item.name === 'Product' && categories?.map((category) => (
                                <li key={category.id}>
                                  <NavigationMenuLink asChild>
                                    <Link data-liquid-control="" href={`/product/${category.handle}`} className="block rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
                                      <div className="font-Inter text-[16px] text-[#111111]">{category.name}</div>
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                              {item.name === 'Blog' && (blog as unknown as { id: number; documentId?: string; Title: string; title?: string; }[] | undefined)?.map((post) => (
                                <li key={post.id}>
                                  <NavigationMenuLink asChild>
                                    <Link data-liquid-control="" href={`/blog/${post.documentId || post.id}`} className="block rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
                                      <div className="font-Inter text-[16px] text-[#111111]">{post.Title || post.title}</div>
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenu>
                    </li>
                  );
                }
                return (
                  <li className="flex-shrink-0 transition-transform duration-300 hover:scale-110" key={index}
                    onMouseEnter={() => handleShowMenu(item)}
                    onMouseLeave={handleCloseMenu}>
                    <Link data-water-item={liquidGlass ? '' : undefined} href={item.href} className={`flex h-full items-center  gap-2 text-nowrap ${textClasses}`} onClick={handleCloseMenu}>
                      {item.name === 'Create Your Own' && (
                        <GiPaintBrush size={18} className="text-orange-500" />
                      )}
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </WaterNavigation>

          {/* MOBILE QUICK NAV */}
          <WaterNavigation enabled={liquidGlass} className="home-header-mobile-nav lg:hidden bg-white border-t border-gray-100 px-4 py-3">
            <div className="flex gap-4 justify-center flex-wrap md:flex-nowrap">
              {[
                { name: 'Easter Day', href: '/sell-your-product' },
                { name: 'Create Your Own', href: '/create-your-own' },
                { name: 'Order Tracking', href: '/order-tracking' }
              ].map((item) => (
                <Link
                  key={item.href}
                  data-water-item={liquidGlass ? '' : undefined}
                  href={item.href}
                  className={`text-[16px] font-Inter transition-colors ${getSolidStyle(item.name)}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </WaterNavigation>
        </div>
      </header>
    </>
  );
};
