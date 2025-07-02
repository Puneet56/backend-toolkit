import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { generateTree } from "@/lib/tree/generate-tree";
import { parseInput } from "@/lib/tree/parse-input";
import { FolderTree, RotateCcw } from "lucide-react";
import { useState } from "react";

interface FileStructureCardProps {
  className?: string;
}

export function FileStructureCard({ className }: FileStructureCardProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [charset, setCharset] = useState<"ascii" | "utf-8">("utf-8");
  const [trailingDirSlash, setTrailingDirSlash] = useState(false);
  const [fullPath, setFullPath] = useState(false);
  const [rootDot, setRootDot] = useState(true);

  const generateTreeOutput = (inputText: string) => {
    try {
      if (!inputText.trim()) {
        setOutput("");
        setError(null);
        return;
      }

      const structure = parseInput(inputText);
      const treeOutput = generateTree(structure, {
        charset,
        trailingDirSlash,
        fullPath,
        rootDot,
      });

      setOutput(treeOutput);
      setError(null);
    } catch (err) {
      setError("Invalid file structure format");
      setOutput("");
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    generateTreeOutput(value);
  };

  const resetToDefault = () => {
    const defaultInput = `my-app
  src
    index.html
    main.ts
    main.scss
  build
    index.html
    main.js
    main.css
  .prettierrc.json
  .gitlab-ci.yml
  README.md
empty dir`;
    setInput(defaultInput);
    generateTreeOutput(defaultInput);
  };

  return (
    <Card className={cn("col-span-2", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderTree className="h-5 w-5" />
          File Structure Visualizer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="structure-input" className="text-sm font-medium">
                File Structure Input
              </Label>
              <div className="flex gap-2">
                <CopyButton value={input} />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetToDefault}
                  className="shrink-0"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Textarea
              id="structure-input"
              placeholder={`Enter your file structure here...
Example:
my-app
  src
    index.html
    main.ts
  build
    main.js
  README.md`}
              className="h-[600px] font-mono resize-none overflow-y-scroll"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const target = e.target as HTMLTextAreaElement;
                  const start = target.selectionStart;
                  const end = target.selectionEnd;
                  const newValue = input.substring(0, start) + "\t" + input.substring(end);
                  setInput(newValue);
                  generateTreeOutput(newValue);
                  // Move cursor after the tab
                  setTimeout(() => {
                    target.selectionStart = target.selectionEnd = start + 1;
                  }, 0);
                }
              }}
            />

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="charset" className="text-sm font-medium">
                    Character Set
                  </Label>
                  <Select value={charset} onValueChange={(value: "ascii" | "utf-8") => {
                    setCharset(value);
                    generateTreeOutput(input);
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utf-8">UTF-8 (Unicode)</SelectItem>
                      <SelectItem value="ascii">ASCII</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="trailing-slash" className="text-sm font-medium">
                    Trailing Directory Slash
                  </Label>
                  <Switch
                    id="trailing-slash"
                    checked={trailingDirSlash}
                    onCheckedChange={(checked: boolean) => {
                      setTrailingDirSlash(checked);
                      generateTreeOutput(input);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="full-path" className="text-sm font-medium">
                    Show Full Path
                  </Label>
                  <Switch
                    id="full-path"
                    checked={fullPath}
                    onCheckedChange={(checked: boolean) => {
                      setFullPath(checked);
                      generateTreeOutput(input);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="root-dot" className="text-sm font-medium">
                    Show Root Dot
                  </Label>
                  <Switch
                    id="root-dot"
                    checked={rootDot}
                    onCheckedChange={(checked: boolean) => {
                      setRootDot(checked);
                      generateTreeOutput(input);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="tree-output" className="text-sm font-medium">
                Tree Output
              </Label>
              <CopyButton value={output} />
            </div>
            <Textarea
              id="tree-output"
              readOnly
              className={cn(
                "h-[600px] font-mono resize-none overflow-y-scroll",
                error ? "border-red-500" : output ? "border-green-500" : "",
              )}
              value={error || output}
              placeholder="Tree diagram will appear here..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 