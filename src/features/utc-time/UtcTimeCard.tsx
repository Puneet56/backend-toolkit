import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { RotateCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function UtcTimeCard() {
	const [utcTime, setUtcTime] = useState<string>("");
	const [utcMillis, setUtcMillis] = useState<string>("");
	const [error, setError] = useState<string | null>(null);

	const updateFromDate = useCallback((date: Date) => {
		setUtcTime(date.toISOString());
		setUtcMillis(date.getTime().toString());
		setError(null);
	}, []);

	const handleUtcTimeChange = (value: string) => {
		try {
			const date = new Date(value);
			if (Number.isNaN(date.getTime())) {
				throw new Error("Invalid date format");
			}
			updateFromDate(date);
		} catch (err) {
			setError("Invalid ISO 8601 format");
			setUtcTime(value);
		}
	};

	const handleUtcMillisChange = (value: string) => {
		try {
			const millis = Number.parseInt(value, 10);
			if (Number.isNaN(millis)) {
				throw new Error("Invalid number");
			}
			const date = new Date(millis);
			if (Number.isNaN(date.getTime())) {
				throw new Error("Invalid milliseconds");
			}
			updateFromDate(date);
		} catch (err) {
			setError("Invalid UTC milliseconds");
			setUtcMillis(value);
		}
	};

	useEffect(() => {
		const updateTime = () => {
			if (!utcTime && !utcMillis) {
				updateFromDate(new Date());
			}
		};

		// Update immediately
		updateTime();

		// Update every second if no manual input
		const interval = setInterval(updateTime, 1000);

		// Cleanup interval on unmount
		return () => clearInterval(interval);
	}, [utcTime, utcMillis, updateFromDate]);

	return (
		<Card className="w-full">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle>UTC Time</CardTitle>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								onClick={() => updateFromDate(new Date())}
								className="shrink-0"
							>
								<RotateCw className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Update to current time</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="utc-time" className="text-sm font-medium">
						ISO 8601
					</Label>
					<div className="flex gap-2">
						<Input
							id="utc-time"
							value={utcTime}
							onChange={(e) => handleUtcTimeChange(e.target.value)}
							className={cn("font-mono text-lg", error && "border-red-500")}
						/>
						<CopyButton value={utcTime} tooltipTitle="Copy UTC time" />
					</div>
				</div>
				<div className="space-y-2">
					<Label htmlFor="utc-millis" className="text-sm font-medium">
						UTC Millis
					</Label>
					<div className="flex gap-2">
						<Input
							id="utc-millis"
							value={utcMillis}
							onChange={(e) => handleUtcMillisChange(e.target.value)}
							className={cn("font-mono text-lg", error && "border-red-500")}
						/>
						<CopyButton value={utcMillis} tooltipTitle="Copy UTC milliseconds" />
					</div>
				</div>
				{error && <p className="text-sm text-red-500">{error}</p>}
			</CardContent>
		</Card>
	);
}
