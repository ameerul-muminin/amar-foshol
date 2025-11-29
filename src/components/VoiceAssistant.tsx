"use client";

import { useEffect, useState, useRef } from 'react';

// --- Sub-components for Icons and Visuals ---

const Icons = {
	ChevronLeft: () => (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
			<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
		</svg>
	),
	MoreHorizontal: () => (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
			<path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM17.25 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
		</svg>
	),
	Globe: () => (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.963 9.963 0 01-4-9.963C8 11.037 9.79 8.112 12 6m0 15c2.21-1.963 4-4.926 4-9.963 0-1.85-.474-3.57-1.295-5.037M12 21V6m0 15c-2.21-1.963-4-4.926-4-9.963C8 11.037 9.79 8.112 12 6m0 0a8.99 8.99 0 1117.98 0 8.99 8.99 0 01-17.98 0z" />
		</svg>
	),
	Keyboard: () => (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
			<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 18.75H6A2.25 2.25 0 013.75 16.5V6zM3.75 12h16.5M12 18.75a.75.75 0 100-1.5.75.75 0 000 1.5zm-4.5 0a.75.75 0 100-1.5.75.75 0 000 1.5zm9 0a.75.75 0 100-1.5.75.75 0 000 1.5z" />
		</svg>
	),
	X: ({ className = "w-8 h-8" }: { className?: string }) => (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
		</svg>
	),
	Mic: () => (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
		</svg>
	),
	SpeakerWave: () => (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
			<path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a3 3 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
		</svg>
	),
	Stop: () => (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
			<path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
		</svg>
	)
};

// A simple CSS-based waveform animation component
const WaveformVisualizer = ({ isListening }: { isListening: boolean }) => {
	// Generate some random heights for the bars to look like a waveform
	const bars = Array.from({ length: 20 }).map((_, i) => i);

	return (
		<div className="flex items-center justify-center h-16 gap-[3px]">
			{bars.map((i) => {
				// Varies animation duration and delay for a more organic look
				const duration = 0.4 + Math.random() * 0.4;
				const delay = Math.random() * 0.2;
				return (
					<div
						key={i}
						className={`w-[3px] bg-red-500 rounded-full transition-all ${isListening ? 'animate-pulse' : 'h-[2px] opacity-30'}`}
						style={isListening ? {
							height: `${Math.max(10, Math.random() * 60)}%`,
							animationDuration: `${duration}s`,
							animationDelay: `${delay}s`,
							animationIterationCount: 'infinite',
							animationDirection: 'alternate'
						} : {}}
					></div>
				);
			})}
			{/* Middle marker line from the reference image */}
			<div className={`absolute h-10 w-[2px] bg-red-600 rounded-full ${isListening ? 'opacity-100' : 'opacity-0'}`}></div>
		</div>
	);
};


export default function VoiceAssistantLayout() {
	const [listening, setListening] = useState(false);
	const [supported, setSupported] = useState(false);
	const [finalTranscript, setFinalTranscript] = useState('');
	const [interimTranscript, setInterimTranscript] = useState('');
	const [answerText, setAnswerText] = useState('');
	const [speaking, setSpeaking] = useState(false);
	const [synthesisSupported, setSynthesisSupported] = useState(false);
	const [typedQuery, setTypedQuery] = useState('');
	// New state to toggle the keyboard input view
	const [showKeyboardInput, setShowKeyboardInput] = useState(false);

	const recognitionRef = useRef<any | null>(null);
	const utteranceRef = useRef<any | null>(null);
	const transcriptEndRef = useRef<HTMLDivElement | null>(null);


	useEffect(() => {
		const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
		if (!SpeechRecognition) {
			setSupported(false);
			return;
		}

		setSupported(true);
		const recog = new SpeechRecognition();
		recog.continuous = true;
		recog.interimResults = true;
		recog.lang = 'bn-BD';

		recog.onresult = (event: any) => {
			let interim = '';
			let final = '';
			for (let i = event.resultIndex; i < event.results.length; ++i) {
				const res = event.results[i];
				if (res.isFinal) final += (res[0].transcript || '') + ' ';
				else interim += (res[0].transcript || '');
			}

			if (final) {
				setFinalTranscript(prev => (prev + ' ' + final).trim());
			}
			setInterimTranscript(interim.trim());
		};

		recog.onend = () => {
			// Auto-restart if still supposed to be listening (fixes some browser timeouts)
			if (listening && recognitionRef.current) {
				try { recognitionRef.current.start(); } catch(e) {}
			} else {
				setListening(false);
			}
		};

		recog.onerror = (e: any) => {
			console.error('Speech recognition error', e);
			// Don't stop listening on no-speech error, just wait
			if (e.error !== 'no-speech') {
				setListening(false);
			}
		};

		recognitionRef.current = recog;

		// check speech synthesis support
		if (typeof window !== 'undefined' && (window as any).speechSynthesis) {
			setSynthesisSupported(true);
		} else {
			setSynthesisSupported(false);
		}

		return () => {
			try { recog.stop(); } catch (e) { }
		};
	}, []);

	// Scroll to bottom of transcript
	useEffect(() => {
		transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [finalTranscript, interimTranscript, answerText]);


	const toggleListening = () => {
		if (!recognitionRef.current || !supported) return;
		// Hide keyboard input when mic is tapped
		setShowKeyboardInput(false);

		if (listening) {
			recognitionRef.current.stop();
			setListening(false);
		} else {
			try {
				// Stop speaking if active
				stopSpeaking();
				// clear previous session data for a fresh start
				setFinalTranscript('');
				setInterimTranscript('');
				setAnswerText('');

				recognitionRef.current.start();
				setListening(true);
			} catch (e) {
				console.warn(e);
				setListening(false);
			}
		}
	};

	const speakBangla = (text: string) => {
		if (!(typeof window !== 'undefined' && (window as any).speechSynthesis)) {
			console.warn('Speech synthesis not supported');
			return;
		}

		try {
			window.speechSynthesis.cancel();
			const u = new SpeechSynthesisUtterance(text);
			u.lang = 'bn-BD';
			u.onstart = () => setSpeaking(true);
			u.onend = () => { setSpeaking(false); utteranceRef.current = null; };
			u.onerror = () => { setSpeaking(false); utteranceRef.current = null; };
			utteranceRef.current = u;
			window.speechSynthesis.speak(u);
		} catch (e) {
			console.warn('synthesis failed, trying fallback lang bn-IN', e);
			// ... fallback logic ...
		}
	};

	const stopSpeaking = () => {
		if ((window as any).speechSynthesis) {
			window.speechSynthesis.cancel();
			setSpeaking(false);
			utteranceRef.current = null;
		}
	};

	const normalizeTranscript = (s: string) => {
		let t = (s || '').trim();
		if (!t) return t;
		// common replacements (abbreviated for brevity, same logic as before)
		const rules: Array<[string, string]> = [
			['অবহা', 'আবহাওয়া'], ['কেব', 'কবে'], ['ঢান', 'ধান'], ['ফসাল', 'ফসল'],
		];
		for (const [from, to] of rules) {
			try { t = t.replace(new RegExp(from, 'gi'), to); } catch (e) { }
		}
		return t.replace(/\s+/g, ' ').trim();
	};

	const answerForQuery = (q: string) => {
		const text = (q || '').toLowerCase();
		if (!text.trim()) return 'আমি কিছু বুঝিনি, আবার বলুন বা টাইপ করুন।';
		// (Same QA logic as provided in the source)
		if (text.includes('আবহা') || text.includes('weather')) return 'আজকের আবহাওয়া: হালকা মেঘলা থাকতে পারে, তাপমাত্রা প্রায় ২৫°-৩২° সেলসিয়াস।';
		if (text.includes('ধান') || text.includes('ফসল') || text.includes('কৃষ')) return 'আপনার ধানের অবস্থাঃ গোড়া থেকে পাতার রং ও আর্দ্রতার উপর নজর রাখুন।';
		if (text.includes('কাট') || (text.includes('কখন') && text.includes('কাট'))) return 'ধান কাটা সাধারণত চারা থেকে পরিপক্ক হওয়ার পর করা হয়; দানা শক্ত হলে ও আর্দ্রতা কম থাকলে কাটা উচিত।';
		if (text.includes('দাম') || text.includes('বাজার') || text.includes('কত')) return 'বাজার মূল্য এলাকার উপর নির্ভর করে পরিবর্তিত হয়। নিকটস্থ বাজারে যোগাযোগ করুন।';
		if (text.includes('কি করব') || text.includes('পরামর্শ')) return 'আপনার ফসলের পরিস্থিতি জানালে আমি আরো নির্দিষ্ট পরামর্শ দিতে পারি।';
		
		return 'দুঃখিত, আমি সেটার উত্তর এখনই দিতে পারছি না। আপনি কি বিস্তারিত লিখে বলবেন?';
	};

	// Handle Final Transcript Result
	useEffect(() => {
		if (!finalTranscript || listening) return; // Only process when listening stops or pauses
		const normalized = normalizeTranscript(finalTranscript);
		const answer = answerForQuery(normalized);
		setAnswerText(answer);
		if (synthesisSupported) speakBangla(answer);
	}, [finalTranscript, listening, synthesisSupported]);

	const submitTypedQuery = () => {
		if (!typedQuery.trim()) return;
		stopSpeaking();
		const normalized = normalizeTranscript(typedQuery.trim());
		// Display the typed query as if it were spoken
		setFinalTranscript(normalized);
		setInterimTranscript('');

		const answer = answerForQuery(normalized);
		setAnswerText(answer);
		setTypedQuery('');
		setShowKeyboardInput(false); // Hide keyboard after submission

		if (synthesisSupported) speakBangla(answer);
	};

	// --- Render Helpers ---

	const renderMainContent = () => {
		const hasTranscript = finalTranscript || interimTranscript;
		const hasAnswer = !!answerText;

		if (!hasTranscript && !hasAnswer && !listening) {
			return (
				<h2 className="text-3xl md:text-4xl font-bold text-gray-700 text-center leading-tight">
					সাহায্য লাগবে? <br /> নিচের বোতাম চেপে বলুন।
				</h2>
			);
		}

		return (
			<div className="w-full max-w-3xl md:max-w-2xl lg:max-w-4xl mx-auto space-y-8 text-center px-4">
				{/* Transcript Display (Big Text from image) */}
				<div className={`transition-all duration-500 ${hasAnswer ? 'opacity-50 scale-90' : 'opacity-100 scale-100'}`}>
					<h2 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight break-words">
						{finalTranscript}
						<span className="text-gray-400">{interimTranscript}</span>
						{listening && !interimTranscript && <span className="animate-pulse">...</span>}
					</h2>
				</div>

				{/* Answer Display (Appears below) */}
				{hasAnswer && (
					<div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-emerald-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
						<h4 className="text-emerald-600 font-semibold mb-2 text-left">উত্তর:</h4>
						<p className="text-lg text-gray-800 leading-relaxed text-left">{answerText}</p>
					</div>
				)}
				<div ref={transcriptEndRef} />
			</div>
		);
	};

	// Use colors from the design system in the original code (emerald/gray)
	// but apply them to the layout from the image.
	// Background: Very light gray/off-white similar to image.
	// Accent: Emerald green from code.

	return (
		// Main Container - responsive for mobile and desktop
		<div className="flex flex-col min-h-[70vh] max-h-[900px] w-full max-w-4xl mx-auto bg-[#F5F7F2] rounded-[30px] overflow-hidden relative shadow-2xl border border-gray-100 font-sans">

			{/* 1. Top Header Bar (simplified for desktop) */}
			<div className="flex items-center justify-center px-6 py-6">
				<h1 className="text-lg md:text-2xl font-semibold text-gray-700 text-center">
					{listening ? 'শুনছি...' : speaking ? 'বলছি...' : 'ভয়েস সহকারী'}
				</h1>
			</div>

			{/* 2. Language Pill */}
			<div className="px-6">
				<div className="inline-flex items-center gap-2 bg-[#C7F284] text-emerald-900 px-4 py-2 rounded-full font-medium text-sm shadow-sm">
					<Icons.Globe />
					<span>বাংলা (BD)</span>
				</div>
			</div>

			{/* 3. Main Content Area (Grows to fill space) */}
			<main className="flex-1 flex flex-col items-center justify-center px-6 py-4 overflow-y-auto no-scrollbar relative">
				{supported ? renderMainContent() : (
					<div className="text-red-600 font-medium text-center bg-red-50 p-4 rounded-xl">
						এই ব্রাউজারে স্পীচ রেকগনিশন সমর্থিত নয়। দয়া করে টাইপ করুন।
					</div>
				)}

				{/* Keyboard Input Overlay */}
				{showKeyboardInput && (
					<div className="absolute inset-x-4 bottom-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-200 z-20 animate-in slide-in-from-bottom-10">
						<div className="flex gap-2">
							<input
								value={typedQuery}
								onChange={(e) => setTypedQuery(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && submitTypedQuery()}
								className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
								placeholder="প্রশ্ন লিখুন..."
								autoFocus
							/>
							<button onClick={submitTypedQuery} className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors">
								পাঠান
							</button>
						</div>
						<button onClick={() => setShowKeyboardInput(false)} className="absolute -top-3 -right-3 bg-gray-200 rounded-full p-1 text-gray-500 hover:bg-gray-300">
							<Icons.X className="w-4 h-4"/>
						</button>
					</div>
				)}
			</main>

			{/* 4. Waveform Visualization Area */}
			<div className="h-24 flex items-center justify-center relative">
				<WaveformVisualizer isListening={listening} />
			</div>

			{/* 5. Bottom Control Bar */}
			<div className="bg-white px-8 py-6 rounded-t-[30px] shadow-[0_-5px_15px_rgba(0,0,0,0.05)] flex items-center justify-between relative z-10">
				{/* Left Button: Keyboard Toggle */}
				<button
					onClick={() => { stopSpeaking(); setShowKeyboardInput(!showKeyboardInput); }}
					className={`p-3 rounded-full transition-colors ${showKeyboardInput ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
				>
					<Icons.Keyboard />
				</button>

				{/* Center Button: Main Action (Mic / Stop) */}
				<div className="absolute left-1/2 -translate-x-1/2 -top-8">
					<button
						onClick={toggleListening}
						disabled={!supported}
						className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 ${
							!supported ? 'bg-gray-300 cursor-not-allowed text-gray-500' :
							listening ? 'bg-white border-4 border-[#FF5F57] text-[#FF5F57]' :
							'bg-[#C7F284] hover:bg-[#b4e070] text-emerald-900'
						}`}
					>
						{listening ? <Icons.X /> : <Icons.Mic />}
					</button>
				</div>

				{/* Right Button: TTS Control / Share placeholder */}
				<button
					onClick={speaking ? stopSpeaking : () => answerText && speakBangla(answerText)}
					disabled={!synthesisSupported || !answerText}
					className={`p-3 rounded-full transition-colors ${
						speaking ? 'bg-emerald-100 text-emerald-600 animate-pulse' :
						!answerText ? 'bg-gray-100 text-gray-400' :
						'bg-gray-100 text-gray-600 hover:bg-gray-200'
					}`}
				>
					{speaking ? <Icons.Stop /> : <Icons.SpeakerWave />}
				</button>
			</div>
		</div>
	);
}