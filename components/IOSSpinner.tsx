import React from 'react';

interface IOSSpinnerProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Pixel-perfect Apple iOS Activity Indicator (UIActivityIndicatorView style).
 * 8 radial capsule spokes with authentic iOS opacity gradient and smooth spin.
 */
export function IOSSpinner({
  className = 'w-5 h-5',
  size = 20,
  color = 'currentColor',
}: IOSSpinnerProps) {
  const spokes = [
    { angle: 0, opacity: 1.0 },
    { angle: 45, opacity: 0.87 },
    { angle: 90, opacity: 0.75 },
    { angle: 135, opacity: 0.62 },
    { angle: 180, opacity: 0.5 },
    { angle: 225, opacity: 0.37 },
    { angle: 270, opacity: 0.25 },
    { angle: 315, opacity: 0.12 },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`animate-spin ${className}`}
      style={{ animationDuration: '0.85s', animationTimingFunction: 'linear' }}
      aria-label="Loading"
      role="status"
    >
      {spokes.map(({ angle, opacity }) => (
        <line
          key={angle}
          x1="12"
          y1="2.75"
          x2="12"
          y2="6.75"
          stroke={color}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeOpacity={opacity}
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
    </svg>
  );
}
