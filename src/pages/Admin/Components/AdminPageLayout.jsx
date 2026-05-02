import React from 'react';

export default function AdminPageLayout({ title, subtitle, actions, children, loading }) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 not-lg:pt-20 pb-10">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#F2EAE1]">{title}</h1>
                    <p className="text-[#F2EAE1]/60 font-medium text-sm mt-1">{subtitle}</p>
                </div>
                {actions && <div className="flex items-center gap-3 w-full md:w-auto">{actions}</div>}
            </div>
            {children}
        </div>
    );
}

export function SkeletonRow({ count = 1 }) {
    return (
        <div className="flex flex-col gap-3">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="h-24 w-full skeleton-bg" />
            ))}
        </div>
    );
}

export function SkeletonGrid({ count = 4 }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="h-48 w-full skeleton-bg" />
            ))}
        </div>
    );
}
