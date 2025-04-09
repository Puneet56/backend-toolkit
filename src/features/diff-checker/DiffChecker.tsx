import { useEffect, useState, useCallback, useRef } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import { diffGenerator, type DiffLine } from "./lib";

export function DiffChecker() {
	const [originalText, setOriginalText] = useState<string>("");
	const [modifiedText, setModifiedText] = useState<string>("");
	const [leftLines, setLeftLines] = useState<DiffLine[]>([]);
	const [rightLines, setRightLines] = useState<DiffLine[]>([]);
	const diffContainerRef = useRef<HTMLDivElement>(null);

	// Function to generate diff
	const handleDiff = useCallback(() => {
		const { left, right } = diffGenerator(originalText, modifiedText);
		localStorage.setItem("btk-diff-originalText", originalText);
		localStorage.setItem("btk-diff-modifiedText", modifiedText);
		setLeftLines(left);
		setRightLines(right);
	}, [originalText, modifiedText]);

	// Clear both text areas
	const handleClear = () => {
		localStorage.removeItem("btk-diff-originalText");
		localStorage.removeItem("btk-diff-modifiedText");
		setOriginalText("");
		setModifiedText("");
		setLeftLines([]);
		setRightLines([]);
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "g") {
				e.preventDefault();
				let scrollHeight = diffContainerRef.current?.offsetTop || 0;
				scrollHeight = scrollHeight > 0 ? scrollHeight - 70 : 0;
				window.scrollTo({
					top: scrollHeight,
					behavior: "smooth",
				});
				handleDiff();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleDiff]);

	useEffect(() => {
		const originalText =
			localStorage.getItem("btk-diff-originalText") || SampleText.original;

		const modifiedText =
			localStorage.getItem("btk-diff-modifiedText") || SampleText.modified;

		setOriginalText(originalText);
		setModifiedText(modifiedText);
		const { left, right } = diffGenerator(originalText, modifiedText);
		setLeftLines(left);
		setRightLines(right);
	}, []);

	// Render a single line of diff
	const renderDiffLine = (line: DiffLine, isLeft: boolean) => {
		const bgColor =
			line.type === "added"
				? "bg-green-900/30"
				: line.type === "removed"
					? "bg-red-900/30"
					: "";

		const textColor =
			line.type === "added"
				? "text-green-300"
				: line.type === "removed"
					? "text-red-300"
					: "text-gray-300";

		return (
			<div
				key={`${isLeft ? "left" : "right"}-${line.lineNumber}`}
				className={`flex ${bgColor} ${textColor} font-mono text-sm`}
			>
				<div className="w-12 text-right pr-4 text-gray-500 select-none">
					{line.lineNumber}
				</div>
				<div className="flex-1 pl-4 pr-4 whitespace-pre">{line.content}</div>
			</div>
		);
	};

	return (
		<div className="container mx-auto p-4 space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Diff Checker</CardTitle>
					<CardDescription>
						Compare two texts and see the differences highlighted.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="original">Original Text</Label>
							<Textarea
								id="original"
								placeholder="Enter original text..."
								value={originalText}
								onChange={(e) => setOriginalText(e.target.value)}
								className="font-mono h-96 overflow-auto"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="modified">Modified Text</Label>
							<Textarea
								id="modified"
								placeholder="Enter modified text..."
								value={modifiedText}
								onChange={(e) => setModifiedText(e.target.value)}
								className="font-mono h-96 overflow-auto"
							/>
						</div>
					</div>

					<div className="grid grid-cols-3">
						<div className="col-start-2 flex justify-center">
							<Button
								variant="secondary"
								size="lg"
								className="font-bold"
								onClick={handleDiff}
							>
								⌘ G
							</Button>
						</div>

						<div className="flex justify-end">
							<Button
								variant="ghost"
								size="lg"
								onClick={handleClear}
								className="flex items-center gap-2"
							>
								<RefreshCw className="h-4 w-4" />
								Clear
							</Button>
						</div>
					</div>

					<div className="space-y-2" ref={diffContainerRef}>
						<Label>Difference</Label>
						<div className="rounded-md bg-gray-900 min-h-[200px] overflow-auto">
							<div className="grid grid-cols-2 divide-x divide-gray-800">
								<div className="overflow-auto">
									{leftLines.map((line) => renderDiffLine(line, true))}
								</div>
								<div className="overflow-auto">
									{rightLines.map((line) => renderDiffLine(line, false))}
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

const SampleText = {
	original: `
package main

import "fmt"

func main() {
	fmt.Println("Hello world")
	result := 5 + 3
	fmt.Printf("The sum is: %d", result)
}
`,
	modified: `
package main

import "fmt"

func main() {
	greet("world")
	result := add(5, 3)
	fmt.Printf("The sum is: %d", result)
}

func greet(name string) {
	fmt.Printf("Hello, %s!", name)
}

func add(x, y int) int {
	return x + y
}
`,
};
