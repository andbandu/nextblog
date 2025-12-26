import React from 'react';

interface SkeletonProps {
    className?: string;
    style?: React.CSSProperties;
}

export default function Skeleton({ className = "", style }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded ${className}`}
            style={style}
        />
    );
}
