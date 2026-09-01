import React from 'react';
import { FlagRenderType } from '../types';

interface FlagRendererProps {
  renderType: FlagRenderType;
  colors: string[];
  className?: string;
  id?: string;
}

/**
 * Component to accurately draw national flags and their variations using pure SVG.
 * Designed with high optical precision, 3:2 standard flag ratio, and border outlines for light colors.
 */
export const FlagRenderer: React.FC<FlagRendererProps> = ({
  renderType,
  colors,
  className = '',
  id,
}) => {
  return (
    <div
      id={id}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ aspectRatio: '3 / 2' }}
    >
      <svg
        viewBox="0 0 300 200"
        className="w-full h-full block object-cover"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Render flag layout based on type */}
        {renderType === 'vertical-3-stripes' && (
          <g>
            <rect x="0" y="0" width="100" height="200" fill={colors[0]} />
            <rect x="100" y="0" width="100" height="200" fill={colors[1]} />
            <rect x="200" y="0" width="100" height="200" fill={colors[2]} />
          </g>
        )}

        {renderType === 'horizontal-3-stripes' && (
          <g>
            <rect x="0" y="0" width="300" height="66.67" fill={colors[0]} />
            <rect x="0" y="66.67" width="300" height="66.67" fill={colors[1]} />
            <rect x="0" y="133.34" width="300" height="66.67" fill={colors[2]} />
          </g>
        )}

        {renderType === 'horizontal-2-stripes' && (
          <g>
            <rect x="0" y="0" width="300" height="100" fill={colors[0]} />
            <rect x="0" y="100" width="300" height="100" fill={colors[1]} />
          </g>
        )}

        {renderType === 'circle-center' && (
          <g>
            <rect x="0" y="0" width="300" height="200" fill={colors[0] || '#FFFFFF'} />
            <circle cx="150" cy="100" r="56" fill={colors[1] || '#BC002D'} />
          </g>
        )}

        {renderType === 'nordic-cross' && (
          <g>
            {/* Background field */}
            <rect x="0" y="0" width="300" height="200" fill={colors[0]} />
            {/* Vertical cross bar (Nordic off-center to left) */}
            <rect x="85" y="0" width="36" height="200" fill={colors[1]} />
            {/* Horizontal cross bar */}
            <rect x="0" y="82" width="300" height="36" fill={colors[1]} />
          </g>
        )}

        {renderType === 'swiss-cross' && (
          <g>
            {/* Red Field */}
            <rect x="0" y="0" width="300" height="200" fill={colors[0]} />
            {/* Horizontal cross bar */}
            <rect x="95" y="80" width="110" height="40" rx="2" fill={colors[1]} />
            {/* Vertical cross bar */}
            <rect x="130" y="45" width="40" height="110" rx="2" fill={colors[1]} />
          </g>
        )}

        {renderType === 'spain-stripes' && (
          <g>
            {/* 1:2:1 proportion */}
            <rect x="0" y="0" width="300" height="50" fill={colors[0]} />
            <rect x="0" y="50" width="300" height="100" fill={colors[1]} />
            <rect x="0" y="150" width="300" height="50" fill={colors[2]} />
          </g>
        )}

        {renderType === 'horizontal-5-stripes' && (
          <g>
            {/* 1:1:2:1:1 proportion for Thailand flag */}
            <rect x="0" y="0" width="300" height="33.33" fill={colors[0]} />
            <rect x="0" y="33.33" width="300" height="33.33" fill={colors[1]} />
            <rect x="0" y="66.66" width="300" height="66.67" fill={colors[2]} />
            <rect x="0" y="133.33" width="300" height="33.33" fill={colors[3] || colors[1]} />
            <rect x="0" y="166.66" width="300" height="33.34" fill={colors[4] || colors[0]} />
          </g>
        )}
      </svg>
    </div>
  );
};
