import { Button } from "@/components/ui/button";
import { Github, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { GITHUB_REPO_URL } from "@/constants/urls";

export function Header() {
	return (
		<header className="w-full border-b bg-background">
			<div className="flex items-center justify-between p-4">
				<Link to="/" className="flex items-center gap-2">
					<Wrench className="h-6 w-6" />
					<h1 className="text-xl font-bold">Backend Toolkit</h1>
				</Link>
				<div className="flex items-center gap-4">
					<nav className="flex items-center gap-4">
						<Link
							to="/"
							className="text-sm font-medium transition-colors hover:text-primary"
						>
							Home
						</Link>
						<Link
							to="/json-prettifier"
							className="text-sm font-medium transition-colors hover:text-primary"
						>
							JSON Prettifier
						</Link>
						<Link
							to="/url-decoder"
							className="text-sm font-medium transition-colors hover:text-primary"
						>
							URL Decoder
						</Link>
						<Link
							to="/user-agent-parser"
							className="text-sm font-medium transition-colors hover:text-primary"
						>
							User Agent Parser
						</Link>
						<Link
							to="/diff-checker"
							className="text-sm font-medium transition-colors hover:text-primary"
						>
							Diff Checker
						</Link>
						<Link
							to="/file-structure"
							className="text-sm font-medium transition-colors hover:text-primary"
						>
							File Structure
						</Link>
					</nav>
					<div className="flex items-center gap-2 border-l pl-4">
						<ThemeToggle />
						<Button variant="outline" size="icon" className="shrink-0" asChild>
							<a
								href={GITHUB_REPO_URL}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Github className="h-4 w-4" />
							</a>
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
