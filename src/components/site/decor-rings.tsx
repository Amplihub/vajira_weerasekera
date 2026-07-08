// Decorative stroke rings used on several sections. Coordinates match the Figma
// frame (1920-wide); slice-fit so they hug the corners.
export function DecorRings({
  height = 1397,
  color = "#3D8BF2",
  rightOnly = false,
}: {
  height?: number;
  color?: string;
  rightOnly?: boolean;
}) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 size-full"
      viewBox={`0 0 1920 ${height}`}
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <circle cx="1919.5" cy="-0.5" r="534" stroke={color} strokeOpacity="0.5" vectorEffect="non-scaling-stroke" />
      <circle cx="2112.5" cy="654.5" r="341" stroke={color} strokeOpacity="0.5" vectorEffect="non-scaling-stroke" />
      {!rightOnly && (
        <circle
          cx={17.5}
          cy={height - 244.5}
          r="341"
          stroke={color}
          strokeOpacity="0.5"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}
