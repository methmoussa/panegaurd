"use client";
import { useId } from "react";
import { previewGeometry } from "@/lib/preview";
import type { VisualizerSettings, WindowDimensions } from "@/types";

export interface PatternOverlayProps extends VisualizerSettings {
  dimensions: WindowDimensions | null;
  imageRatio?: number;
  sampleWindow?: boolean;
}

export function PatternOverlay({ dimensions, imageRatio = 1.5, sampleWindow = false, ...settings }: PatternOverlayProps) {
  const id = "pattern-" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const { width, height, size, tileX, tileY } = previewGeometry(settings, dimensions, imageRatio);
  const { pattern, opacity, contrast } = settings;
  const color = contrast === "light" ? "#ffffff" : "#183e31";
  const cx = tileX / 2, cy = tileY / 2;
  const starPoints = Array.from({ length: 10 }, (_, i) => {
    const angle = i * Math.PI / 5 - Math.PI / 2;
    const radius = i % 2 === 0 ? size : size * .55;
    return `${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`;
  }).join(" ");
  return <svg className="pattern-overlay" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
    <defs>
      <pattern id={id} x={-cx} y={-cy} width={tileX} height={tileY} patternUnits="userSpaceOnUse">
        {pattern === "dots" && <circle cx={cx} cy={cy} r={size / 2} fill={color} />}
        {(pattern === "vertical" || pattern === "grid") && <path d={`M ${cx} 0 V ${tileY}`} stroke={color} strokeWidth={size} />}
        {(pattern === "horizontal" || pattern === "grid") && <path d={`M 0 ${cy} H ${tileX}`} stroke={color} strokeWidth={size} />}
        {pattern === "leaves" && <g transform={`translate(${cx} ${cy}) rotate(-35)`} fill={color}>
          <path d={`M 0 ${-size} C ${size} ${-size}, ${size} ${size}, 0 ${size} C ${-size} ${size}, ${-size} ${-size}, 0 ${-size} Z`} />
          <circle r={size / 2} />
        </g>}
        {pattern === "stars" && <g fill={color}><polygon points={starPoints} /><circle cx={cx} cy={cy} r={size / 2} /></g>}
      </pattern>
      {sampleWindow && <mask id={id + "-glass"} maskUnits="userSpaceOnUse">
        <rect width={width} height={height} fill="black" />
        {[.069, .517].flatMap(x => [.074, .52].map(y => <rect key={`${x},${y}`} x={x * width} y={y * height} width={.414 * width} height={.407 * height} fill="white" />))}
      </mask>}
    </defs>
    <rect width={width} height={height} fill={`url(#${id})`} opacity={opacity} mask={sampleWindow ? `url(#${id}-glass)` : undefined} />
  </svg>;
}
