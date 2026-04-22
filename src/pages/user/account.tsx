"use client"
import { PrimaryLayout } from "@/layouts";
import { ReactElement, useEffect, useState } from "react";
import { api } from "@/utils/api";
import { User, Upload, MapPin, ShoppingBag, Gift, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Recently from "@/packages/browsing-history/components/recently";

const AccountPage = () => {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
    const [fullName, setFullName] = useState("");
    const [gender, setGender] = useState<"female" | "male" | "other">("female");
    const [changePassword, setChangePassword] = useState(false);

    const getToken = () => {
        if (typeof window !== "undefined") {
            return sessionStorage.getItem("authToken") ?? localStorage.getItem("authToken") ?? undefined;
        }
        return undefined;
    };

    const accessToken = getToken();
    const { data: user, isLoading } = api.medusa.userDetail.useQuery(
        { accessToken: accessToken?.toString() },
        { enabled: !!accessToken }
    );
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate kích thước
        if (file.size > 4 * 1024 * 1024) {
            alert("File too big! Max file size 4MB");
            e.target.value = ""; // Reset input
            return;
        }

        // Validate loại file
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            e.target.value = "";
            return;
        }

        setSelectedAvatar(file);

        // Tạo preview URL
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);

        // Cleanup khi component unmount
        return () => URL.revokeObjectURL(previewUrl);
    };
    console.log("Selected avatar file:", selectedAvatar);
    useEffect(() => {
        return () => {
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);
    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        localStorage.removeItem('authToken');
        window.location.href = '/';
    };

    const handleUpdate = () => {
        // TODO: Implement update logic
        console.log({ fullName, gender, changePassword, selectedAvatar });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-lg text-gray-600">Please login to view your account</p>
                <Link href="/signin" className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-orange-500">Home</Link>
                        <span>›</span>
                        <span className="text-gray-900">User profile</span>
                    </div>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <Image
                        src={user.custom.avatar || "/assets/default-avatar.png"}
                        alt="avatar"
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                        unoptimized // Quan trọng khi dùng dynamic URL
                    />
                </div>
                <span className="font-semibold">{user.first_name} {user.last_name}</span>
                <button className="ml-auto">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 lg:py-8">
                <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                    {/* Sidebar - Desktop */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                                    <Image
                                        src="/assets/default-avatar.png"
                                        alt="avatar"
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="font-semibold text-sm">{user.first_name} {user.last_name}</span>
                            </div>

                            <nav className="space-y-1">
                                <Link href="/account" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg">
                                    <User size={18} />
                                    User profile
                                </Link>
                                <Link href="/address" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <MapPin size={18} />
                                    Address book
                                </Link>
                                <Link href="/orders" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <ShoppingBag size={18} />
                                    My order
                                </Link>
                                <Link href="/loyalty" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <Gift size={18} />
                                    Loyalty Program
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 mt-6 lg:mt-0">
                        <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
                            <h1 className="text-2xl font-bold mb-6">Profile</h1>

                            {/* Desktop Layout */}
                            <div className="hidden md:grid md:grid-cols-3 md:gap-8">
                                {/* Avatar Section - Left */}
                                <div className="md:col-span-1 flex flex-col items-center">
                                    <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden bg-gray-200 mb-4">
                                        <Image
                                            src={avatarPreview || user.avatar_url || "/assets/default-avatar.png"}
                                            alt="avatar"
                                            width={160}
                                            height={160}
                                            className="w-full h-full object-cover"
                                            unoptimized // Quan trọng khi dùng dynamic URL
                                        />
                                    </div>
                                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition">
                                        <Upload size={16} />
                                        <span className="text-sm">Upload avatar</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                    </label>
                                    <p className="text-xs text-orange-500 mt-2">File too big! Max file size 4MB</p>
                                </div>

                                {/* Form Section - Right */}
                                <div className="md:col-span-2 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-600"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={fullName || `${user.first_name} ${user.last_name}`}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="female"
                                                    checked={gender === "female"}
                                                    onChange={(e) => setGender(e.target.value as "female")}
                                                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                                                />
                                                <span className="text-sm">Female</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="male"
                                                    checked={gender === "male"}
                                                    onChange={(e) => setGender(e.target.value as "male")}
                                                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                                                />
                                                <span className="text-sm">Male</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="other"
                                                    checked={gender === "other"}
                                                    onChange={(e) => setGender(e.target.value as "other")}
                                                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                                                />
                                                <span className="text-sm">Rather not say</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={changePassword}
                                                onChange={(e) => setChangePassword(e.target.checked)}
                                                className="w-4 h-4 text-orange-500 focus:ring-orange-500 rounded"
                                            />
                                            <span className="text-sm">Change password</span>
                                        </label>
                                    </div>

                                    <button
                                        onClick={handleUpdate}
                                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Layout */}
                            <div className="md:hidden space-y-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
                                        <Image
                                            src="/assets/default-avatar.png"
                                            alt="avatar"
                                            width={128}
                                            height={128}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition">
                                        <Upload size={16} />
                                        <span className="text-sm">Upload avatar</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                    </label>
                                    <p className="text-xs text-orange-500 mt-2">File too big! Max file size 4MB</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={fullName || `${user.first_name} ${user.last_name}`}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="gender-mobile"
                                                value="female"
                                                checked={gender === "female"}
                                                onChange={(e) => setGender(e.target.value as "female")}
                                                className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                                            />
                                            <span className="text-sm">Female</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="gender-mobile"
                                                value="male"
                                                checked={gender === "male"}
                                                onChange={(e) => setGender(e.target.value as "male")}
                                                className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                                            />
                                            <span className="text-sm">Male</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="gender-mobile"
                                                value="other"
                                                checked={gender === "other"}
                                                onChange={(e) => setGender(e.target.value as "other")}
                                                className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                                            />
                                            <span className="text-sm">Rather not say</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={changePassword}
                                            onChange={(e) => setChangePassword(e.target.checked)}
                                            className="w-4 h-4 text-orange-500 focus:ring-orange-500 rounded"
                                        />
                                        <span className="text-sm">Change password</span>
                                    </label>
                                </div>

                                <button
                                    onClick={handleUpdate}
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                                >
                                    Update
                                </button>
                            </div>

                            {/* App Download Section - Mobile */}
                            <div className="md:hidden mt-8 pt-8 border-t">
                                <h3 className="font-semibold mb-4">GET THE APP TO ENJOY</h3>
                                <div className="flex gap-4">
                                    <Image
                                        src="/assets/qr-code.png"
                                        alt="QR Code"
                                        width={80}
                                        height={80}
                                        className="rounded"
                                    />
                                    <div className="flex flex-col gap-2">
                                        <Image
                                            src="/assets/google-play.png"
                                            alt="Google Play"
                                            width={120}
                                            height={40}
                                            className="cursor-pointer"
                                        />
                                        <Image
                                            src="/assets/app-store.png"
                                            alt="App Store"
                                            width={120}
                                            height={40}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom User Card - Mobile */}
                        <div className="md:hidden mt-6 bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                                    <Image
                                        src="/assets/default-avatar.png"
                                        alt="avatar"
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="font-semibold">{user.first_name} {user.last_name}</span>
                            </div>
                            <Link href="/account" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg">
                                <User size={18} />
                                User profile
                            </Link>
                        </div>
                    </div>
                </div>
                <Recently />
            </div>
        </div>
    );
};

AccountPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <PrimaryLayout
            seo={{
                title: 'Account',
                canonical: '/account',
            }}
        >
            {page}
        </PrimaryLayout>
    );
};

export default AccountPage;