// GitHub URLs
export const GITHUB_REPO_URL = "https://github.com/Puneet56/backend-toolkit";
export const GITHUB_PROFILE_URL = "https://github.com/Puneet56";

// API Endpoints
export const API_ENDPOINTS = {
	// IP Related APIs
	IPV4_API: "https://api.ipify.org?format=json",
	IPV6_API: "https://api64.ipify.org?format=json",
	IP_INFO_API: "https://free.freeipapi.com/api/json", // Base URL, append /{ip} for specific IP
} as const;

// Function to get IP info URL for a specific IP
export const getIpInfoUrl = (ip: string) =>
	`${API_ENDPOINTS.IP_INFO_API}/${ip}`;
