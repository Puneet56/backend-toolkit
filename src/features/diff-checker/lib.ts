import { diffLines } from "diff";

export interface DiffLine {
	content: string;
	type: "added" | "removed" | "unchanged";
	lineNumber: number;
}

// TODO: Write diff generator with a custom algorithm
export function diffGenerator(
	originalText: string,
	modifiedText: string,
): {
	left: DiffLine[];
	right: DiffLine[];
} {
	const differences = diffLines(originalText, modifiedText);

	// Process differences for side-by-side view
	const left: DiffLine[] = [];
	const right: DiffLine[] = [];
	let leftLineNumber = 1;
	let rightLineNumber = 1;

	for (const part of differences) {
		const lines = part.value.split("\n");

		// Handle empty lines at the end
		if (lines[lines.length - 1] === "") {
			lines.pop();
		}

		for (const line of lines) {
			if (part.added) {
				right.push({
					content: line,
					type: "added",
					lineNumber: rightLineNumber++,
				});
				continue;
			}
			if (part.removed) {
				left.push({
					content: line,
					type: "removed",
					lineNumber: leftLineNumber++,
				});
				continue;
			}

			left.push({
				content: line,
				type: "unchanged",
				lineNumber: leftLineNumber++,
			});
			right.push({
				content: line,
				type: "unchanged",
				lineNumber: rightLineNumber++,
			});
		}
	}

	return { left, right };
}
