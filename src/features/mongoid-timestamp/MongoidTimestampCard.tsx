import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegenerateButton } from "@/components/ui/regenerate-button";
import { useCallback, useEffect, useState } from "react";

function generateMongoIdFromTimestamp(timestamp: Date): string {
	// Convert timestamp to seconds (MongoDB ObjectId uses seconds)
	const seconds = Math.floor(timestamp.getTime() / 1000);
	// Convert to hex and pad to 8 characters
	const timestampHex = seconds.toString(16).padStart(8, "0");
	// Generate random hex for the rest of the ID (16 characters)
	const randomHex = Array.from({ length: 16 }, () =>
		Math.floor(Math.random() * 16).toString(16),
	).join("");
	return timestampHex + randomHex;
}

function generateTimestampFromMongoId(mongoid: string): Date {
	if (mongoid.length !== 24) {
		return new Date();
	}
	// Extract timestamp from first 8 characters of MongoDB ID
	const timestampHex = mongoid.substring(0, 8);
	// Convert hex to decimal and then to milliseconds
	const timestamp = Number.parseInt(timestampHex, 16) * 1000;
	return new Date(timestamp);
}

export function MongoidTimestampCard() {
	const [mongoid, setMongoid] = useState<string>(() =>
		generateMongoIdFromTimestamp(new Date()),
	);
	const [timestamp, setTimestamp] = useState<string>(() =>
		new Date().toISOString()
	);

	const generateNewId = useCallback(() => {
		const now = new Date();
		const newMongoId = generateMongoIdFromTimestamp(now);
		setMongoid(newMongoId);
		setTimestamp(now.toISOString());
	}, []);

	useEffect(() => {
		generateNewId();
	}, [generateNewId]);

	const handleMongoidChange = (value: string) => {
		setMongoid(value);
		if (value.length === 24) {
			setTimestamp(generateTimestampFromMongoId(value).toISOString());
		}
	};

	const handleTimestampChange = (value: string) => {
		setTimestamp(value);
		try {
			const date = new Date(value);
			if (!isNaN(date.getTime())) {
				setMongoid(generateMongoIdFromTimestamp(date));
			}
		} catch (error) {
			// Invalid date, ignore
		}
	};

	return (
		<Card className="">
			<CardHeader>
				<CardTitle>MongoDB ID to Timestamp</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="mongoid">MongoDB ObjectId</Label>
					<div className="flex gap-2">
						<Input
							value={mongoid}
							onChange={(e) => handleMongoidChange(e.target.value)}
							placeholder="Enter MongoDB ObjectId"
							className="font-mono"
						/>
						<RegenerateButton onClick={generateNewId} />
					</div>
				</div>
				<div className="space-y-2">
					<Label htmlFor="timestamp">Timestamp</Label>
					<div className="flex gap-2">
						<Input
							value={timestamp}
							onChange={(e) => handleTimestampChange(e.target.value)}
							placeholder="Enter ISO timestamp"
							className="font-mono text-lg"
						/>
						<CopyButton value={timestamp} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
