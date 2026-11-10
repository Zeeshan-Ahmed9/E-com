interface WaveDividerProps {
  fillColor?: string;
  className?: string;
  inverted?: boolean;
}

export function WaveDivider({
  fillColor = "#000000",
  className = "",
  inverted = false,
}: WaveDividerProps) {
  return (
    <div
      className={`w-full overflow-hidden leading-none select-none pointer-events-none ${className} ${
        inverted ? "rotate-180" : ""
      }`}
    >
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-8 sm:h-12 md:h-16 block"
        preserveAspectRatio="none"
      >
        <path
          d="M0 0C240 65 480 80 720 50C960 20 1200 60 1440 25V80H0V0Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
}

