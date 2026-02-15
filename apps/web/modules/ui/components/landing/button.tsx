import type { PropsWithChildren } from "react";

interface ButtonProps extends PropsWithChildren {
	href: string;
	variant?: "primary" | "secondary";
	icon?: React.ReactNode;
	iconPosition?: "left" | "right";
	external?: boolean;
}

export function Button({
	href,
	variant = "primary",
	icon,
	iconPosition = "right",
	external = false,
	children,
}: ButtonProps) {
	const baseClasses =
		"inline-flex h-12 items-center gap-2 rounded-lg px-6 text-sm font-medium transition-all";

	const variantClasses = {
		primary:
			"bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
		secondary: "border border-border bg-background hover:bg-secondary",
	};

	const externalProps = external
		? { target: "_blank", rel: "noopener noreferrer" }
		: {};

	return (
		<a
			href={href}
			className={`${baseClasses} ${variantClasses[variant]}`}
			{...externalProps}
		>
			{icon && iconPosition === "left" && icon}
			{children}
			{icon && iconPosition === "right" && icon}
		</a>
	);
}
