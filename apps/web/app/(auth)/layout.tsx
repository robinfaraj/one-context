import type { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
	return (
		<div className="flex min-h-svh items-center justify-center bg-background p-4">
			<div className="w-full max-w-md space-y-6">
				<div className="text-center">
					<h1 className="font-instrument-serif text-3xl">OneContext</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Your AI identity, everywhere
					</p>
				</div>
				{children}
			</div>
		</div>
	);
}
