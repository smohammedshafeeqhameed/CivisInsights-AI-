'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LinkIcon, Bookmark } from 'lucide-react';
import { DigitalIndiaIcon, NICIcon } from './icons';

const partnerLogos = [
    { src: 'https://picsum.photos/seed/p1/140/50', alt: 'india.gov.in', hint: 'india.gov.in logo' },
    { src: 'https://picsum.photos/seed/p2/140/50', alt: 'National Government Services Portal', hint: 'National Government Services Portal logo' },
    { src: 'https://picsum.photos/seed/p3/140/50', alt: 'MyGov', hint: 'MyGov logo' },
    { src: 'https://picsum.photos/seed/p4/140/50', alt: 'data.gov.in', hint: 'data.gov.in logo' },
    { src: 'https://picsum.photos/seed/p5/140/50', alt: 'PMINDIA', hint: 'PMINDIA logo' },
    { src: 'https://picsum.photos/seed/p6/140/50', alt: 'CPGRAMS', hint: 'CPGRAMS logo' },
];


export function Footer() {
    return (
        <footer className="w-full">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                <div className="container mx-auto px-4 py-8 text-center">
                    <h2 className="text-2xl font-semibold">HELP US IN MAKING IT BETTER</h2>
                    <p className="mt-2 max-w-2xl mx-auto">We welcome your participation in enhancing the directory further and also invite your comments and suggestions for improvement</p>
                    <div className="mt-6">
                        <div className="inline-flex rounded-full bg-white/20 p-1">
                            <button className="px-6 py-2 text-white rounded-full hover:bg-white/30 transition-colors">Suggest A Site</button>
                            <div className="border-l border-white/50 mx-1"></div>
                            <button className="px-6 py-2 text-white rounded-full hover:bg-white/30 transition-colors">Share Feedback</button>
                        </div>
                    </div>
                    <div className="mt-10">
                        <h3 className="text-xl font-semibold">CONNECT WITH US</h3>
                        <div className="mt-4 flex justify-center items-center gap-12">
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                    <LinkIcon className="h-6 w-6" />
                                </div>
                                <span>LINK To Us</span>
                            </div>
                             <div className="flex flex-col items-center gap-2">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                    <Bookmark className="h-6 w-6" />
                                </div>
                                <span>BOOKMARK This Page</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white py-4 border-b">
                 <div className="container mx-auto px-4">
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center justify-items-center">
                        {partnerLogos.map((logo, index) => (
                            <Image
                                key={index}
                                src={logo.src}
                                alt={logo.alt}
                                width={140}
                                height={50}
                                className="object-contain"
                                data-ai-hint={logo.hint}
                            />
                        ))}
                    </div>
                 </div>
            </div>
             <div className="bg-[#2c3e50] text-white">
                <div className="container mx-auto px-4 py-4 text-center">
                    <div className="flex justify-center gap-x-4 gap-y-2 text-sm flex-wrap">
                        <Link href="#" className="hover:underline">About Us</Link>
                        <Link href="#" className="hover:underline">Help</Link>
                        <Link href="#" className="hover:underline">Sitemap</Link>
                        <Link href="#" className="hover:underline">Website Policies</Link>
                        <Link href="#" className="hover:underline">Feedback</Link>
                        <Link href="#" className="hover:underline">Contact Us</Link>
                    </div>
                </div>
            </div>
             <div className="bg-[#1f2b38] text-gray-400 text-sm">
                <div className="container mx-auto px-4 py-4 text-center">
                    <p>© Developed and hosted by National Informatics Centre, <br/> Ministry of Electronics & Information Technology, Government of India</p>
                    <p className="mt-2">Last Updated: Oct 24, 2025</p>
                    <div className="mt-6 flex justify-center items-center gap-8">
                        <NICIcon className="h-8" />
                        <DigitalIndiaIcon className="h-8" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
