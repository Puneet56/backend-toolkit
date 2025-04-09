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

function App() {
	return (
		<div className="">
			<Header />
			<main className="p-8 mb-24">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/json-prettifier" element={<JsonPrettifierPage />} />
					<Route path="/url-decoder" element={<UrlDecoderPage />} />
					<Route path="/user-agent-parser" element={<UserAgentParserPage />} />
					<Route path="/diff-checker" element={<DiffCheckerPage />} />
				</Routes>
			</main>
			<Footer />
			<ScrollToBottom />
			<Clipboard />
		</div>
	);
}

export default App;
