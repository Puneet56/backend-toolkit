import { Route, Routes } from "react-router-dom";
import { Clipboard } from "./components/Clipboard";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { ScrollToBottom } from "./components/ScrollToBottom";
import { HomePage } from "./pages/HomePage";
import { JsonPrettifierPage } from "./pages/JsonPrettifierPage";
import { UrlDecoderPage } from "./pages/UrlDecoderPage";
import { UserAgentParserPage } from "./pages/UserAgentParserPage";
import { DiffCheckerPage } from "./pages/DiffCheckerPage";
import { FileStructurePage } from "./pages/FileStructurePage";

function App() {
	return (
		<div className="">
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:px-4 focus:py-2 focus:border focus:rounded-md"
			>
				Skip to main content
			</a>
			<Header />
			<main id="main-content" className="p-8 mb-24">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/json-prettifier" element={<JsonPrettifierPage />} />
					<Route path="/url-decoder" element={<UrlDecoderPage />} />
					<Route path="/user-agent-parser" element={<UserAgentParserPage />} />
					<Route path="/diff-checker" element={<DiffCheckerPage />} />
					<Route path="/file-structure" element={<FileStructurePage />} />
				</Routes>
			</main>
			<Footer />
			<ScrollToBottom />
			<Clipboard />
		</div>
	);
}

export default App;
