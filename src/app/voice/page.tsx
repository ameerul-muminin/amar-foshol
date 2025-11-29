"use client";

import VoiceAssistant from '@/components/VoiceAssistant';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plant, Globe, SignOut } from '@phosphor-icons/react';

export default function VoicePage() {
	const router = useRouter();
	const [lang, setLang] = useState<'bn' | 'en'>('bn');

	useEffect(() => {
		const load = async () => {
			try {
				const { getCurrentFarmer } = await import('@/lib/auth');
				const current = await getCurrentFarmer();
				if (!current) {
					router.push('/login');
					return;
				}
				setLang(current.language || 'bn');
			} catch (e) {
				console.error(e);
				router.push('/login');
			}
		};
		load();
	}, [router]);

	const handleLogout = async () => {
		try {
			const { logout } = await import('@/lib/auth');
			await logout();
			router.push('/');
		} catch (e) {
			console.error('Logout error', e);
		}
	};

			return (
				<div className="min-h-screen bg-gray-50">
					<Header subtitle={lang === 'bn' ? 'ভয়েস সহকারী' : 'Voice Assistant'} lang={lang} setLang={setLang} onLogout={handleLogout} onBack={() => router.push('/dashboard')} />

				<main className="max-w-7xl mx-auto px-4 py-8">
					<div className="grid grid-cols-1 gap-6">
						<VoiceAssistant />
					</div>
				</main>
			</div>
		);
	}
