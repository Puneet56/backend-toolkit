import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { API_ENDPOINTS, getIpInfoUrl } from "@/constants/urls";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Globe2, MapPin, Search, Wifi } from "lucide-react";
import { useState } from "react";

interface IpResponse {
	ip: string;
}

interface IpInfo {
	ipVersion: number;
	ipAddress: string;
	latitude: number;
	longitude: number;
	countryName: string;
	countryCode: string;
	timeZone: string;
	zipCode: string;
	cityName: string;
	regionName: string;
	continent: string;
	continentCode: string;
	isProxy: boolean;
	currencies: string[];
	language: string;
	timeZones: string[];
	tlds: string[];
}

const fetchIpv4 = async (): Promise<IpResponse> => {
	const response = await fetch(API_ENDPOINTS.IPV4_API);
	return response.json();
};

const fetchIpInfo = async (ip: string): Promise<IpInfo> => {
	const response = await fetch(getIpInfoUrl(ip));
	if (!response.ok) {
		throw new Error("Failed to fetch IP info");
	}
	return response.json();
};

interface IpInfoCardProps {
	className?: string;
}

export function IpInfoCard({ className }: IpInfoCardProps) {
	const [ip, setIp] = useState<string>("");

	// Get the user's IP address
	const { data: ipv4Data } = useQuery({
		queryKey: ["ipv4"],
		queryFn: fetchIpv4,
	});

	// Use the entered IP or the user's IP as default
	const targetIp = ip || ipv4Data?.ip || "";

	// Fetch IP info
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["ipInfo"],
		queryFn: () => fetchIpInfo(targetIp),
		enabled: process.env.NODE_ENV !== "development",
		retry: false,
		placeholderData: {
			ipVersion: 4,
			ipAddress: "127.0.0.1",
			latitude: 0,
			longitude: 0,
			countryName: "Unknown",
			countryCode: "Unknown",
			timeZone: "Unknown",
			zipCode: "Unknown",
			cityName: "Unknown",
			regionName: "Unknown",
			continent: "Unknown",
			continentCode: "Unknown",
			isProxy: false,
			currencies: [],
			language: "Unknown",
			timeZones: [],
			tlds: [],
		},
	});

	const handleSearch = () => {
		if (ip) {
			refetch();
		}
	};

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<CardTitle>IP Info Lookup</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex gap-2">
					<Input
						value={ip}
						onChange={(e) => setIp(e.target.value)}
						placeholder={ipv4Data?.ip || "Enter IP address"}
						className="font-mono"
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleSearch();
							}
						}}
					/>
					<Button onClick={handleSearch} disabled={isLoading}>
						<Search className="h-4 w-4" />
					</Button>
				</div>

				{isLoading && (
					<div className="text-center text-muted-foreground">Loading...</div>
				)}

				{error && (
					<div className="text-center text-destructive">
						Failed to fetch IP information
					</div>
				)}

				{data && (
					<div className="space-y-6">
						{/* Location Information */}
						<div className="space-y-2">
							<div className="flex items-center gap-2 font-semibold">
								<MapPin className="h-5 w-5" />
								<span>Location Information</span>
							</div>
							<div className="grid grid-cols-2 gap-2 text-sm pl-7">
								<div className="font-medium">City</div>
								<div>{data.cityName}</div>
								<div className="font-medium">Region</div>
								<div>{data.regionName}</div>
								<div className="font-medium">Country</div>
								<div>{`${data.countryName} (${data.countryCode})`}</div>
								<div className="font-medium">Coordinates</div>
								<div>{`${data.latitude}, ${data.longitude}`}</div>
								<div className="font-medium">ZIP Code</div>
								<div>{data.zipCode}</div>
							</div>
						</div>

						{/* Network Information */}
						<div className="space-y-2">
							<div className="flex items-center gap-2 font-semibold">
								<Wifi className="h-5 w-5" />
								<span>Network Information</span>
							</div>
							<div className="grid grid-cols-2 gap-2 text-sm pl-7">
								<div className="font-medium">IP Address</div>
								<div>{data.ipAddress}</div>
								<div className="font-medium">IP Version</div>
								<div>IPv{data.ipVersion}</div>
								<div className="font-medium">Proxy</div>
								<div>{data.isProxy ? "Yes" : "No"}</div>
							</div>
						</div>

						{/* Additional Details */}
						<div className="space-y-2">
							<div className="flex items-center gap-2 font-semibold">
								<Globe2 className="h-5 w-5" />
								<span>Additional Details</span>
							</div>
							<div className="grid grid-cols-2 gap-2 text-sm pl-7">
								<div className="font-medium">Timezone</div>
								<div>{data.timeZone}</div>
								<div className="font-medium">Currency</div>
								<div>{data.currencies?.join(", ")}</div>
								<div className="font-medium">Language</div>
								<div>{data.language}</div>
								<div className="font-medium">Continent</div>
								<div>{`${data.continent} (${data.continentCode})`}</div>
								<div className="font-medium">TLDs</div>
								<div>{data.tlds?.join(", ")}</div>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
