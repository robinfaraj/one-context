interface LogoProps {
	size?: "sm" | "md" | "lg";
	showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
	const sizeClasses = {
		sm: "h-7 w-7 text-xs",
		md: "h-8 w-8 text-sm",
		lg: "h-10 w-10 text-base",
	};

	const textSizeClasses = {
		sm: "text-sm",
		md: "text-lg",
		lg: "text-xl",
	};

	return (
		<div className="flex items-center gap-2">
			<div
				className={`flex items-center justify-center rounded-md bg-primary ${sizeClasses[size]}`}
			>
				<span className="font-bold text-primary-foreground">1</span>
			</div>
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
