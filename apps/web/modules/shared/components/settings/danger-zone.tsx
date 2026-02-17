"use client";

import { authClient } from "@onecontext/auth/client";
import { Button } from "@ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import { Download, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeleteAccount, useExportData } from "../../lib/settings-api";

export function DangerZone() {
	const router = useRouter();
	const exportData = useExportData();
	const deleteAccount = useDeleteAccount();

	function handleExport() {
		exportData.mutate();
	}

	function handleDelete() {
		const confirmed = window.confirm(
			"Are you sure you want to delete your account? This action is permanent and cannot be undone. All your data, memories, and connected sources will be deleted.",
		);
		if (!confirmed) return;

		deleteAccount.mutate(undefined, {
			onSuccess: async () => {
				await authClient.signOut();
				router.push("/");
			},
		});
	}

	return (
		<Card className="border-destructive/50">
			<CardHeader>
				<CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center justify-between gap-4">
					<div>
						<p className="text-sm font-medium">Export your data</p>
						<p className="text-sm text-muted-foreground">
							Download all your data as a JSON file
						</p>
					</div>
					<Button
						variant="outline"
						onClick={handleExport}
						disabled={exportData.isPending}
					>
						{exportData.isPending ? (
							<Loader2 className="animate-spin" />
						) : (
							<Download />
						)}
						Export
					</Button>
				</div>

				<div className="border-t" />

				<div className="flex items-center justify-between gap-4">
					<div>
						<p className="text-sm font-medium">Delete account</p>
						<p className="text-sm text-muted-foreground">
							Permanently delete your account and all associated data
						</p>
					</div>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={deleteAccount.isPending}
					>
						{deleteAccount.isPending ? (
							<Loader2 className="animate-spin" />
						) : (
							<Trash2 />
						)}
						Delete
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
