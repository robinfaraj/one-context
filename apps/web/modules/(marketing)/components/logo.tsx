export function OneContextLogo(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 120 48"
			fill="none"
			role="img"
			aria-label="OneContext"
			{...props}
		>
			{/* Left node (outlined) */}
			<circle
				cx="18"
				cy="24"
				r="9"
				stroke="currentColor"
				strokeWidth="3.5"
				fill="none"
			/>
			{/* Connection line left */}
			<line
				x1="27"
				y1="24"
				x2="46"
				y2="24"
				stroke="currentColor"
				strokeWidth="3.5"
			/>
			{/* Center hub (filled) */}
			<circle cx="60" cy="24" r="14" fill="currentColor" />
			{/* Connection line right */}
			<line
				x1="74"
				y1="24"
				x2="93"
				y2="24"
				stroke="currentColor"
				strokeWidth="3.5"
			/>
			{/* Right node (outlined) */}
			<circle
				cx="102"
				cy="24"
				r="9"
				stroke="currentColor"
				strokeWidth="3.5"
				fill="none"
			/>
		</svg>
	);
}

interface LogoProps {
	size?: "sm" | "md" | "lg";
	showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
	const iconSizeClasses = {
		sm: "h-6 w-auto",
		md: "h-7 w-auto",
		lg: "h-9 w-auto",
	};

	const textSizeClasses = {
		sm: "text-sm",
		md: "text-lg",
		lg: "text-xl",
	};

	return (
		<div className="flex items-center gap-2">
			<OneContextLogo className={`text-primary ${iconSizeClasses[size]}`} />
			{showText && (
				<span
					className={`font-semibold tracking-tight ${textSizeClasses[size]}`}
				>
					OneContext
				</span>
			)}
		</div>
	);
}
