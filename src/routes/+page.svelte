<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fade, fly, scale, slide } from 'svelte/transition';
	import { quintOut, elasticOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import portraitMG from '$lib/assets/asset 8.webp';
	import familyMG from '$lib/assets/asset 25.webp';
	import gcMG from '$lib/assets/asset 7.webp';
	import celMG from '$lib/assets/asset 27.webp';
	import solMG from '$lib/assets/asset 23.webp';
	import stMG from '$lib/assets/asset 5.webp';
	import wfMG from '$lib/assets/asset 6.webp';
	import u0MG from '$lib/assets/asset 9.webp';
	import u1MG from '$lib/assets/asset 10.webp';
	import u2MG from '$lib/assets/asset 11.webp';
	import dtMG from '$lib/assets/asset 12.webp';
	import u3MG from '$lib/assets/asset 13.webp';
	import u4MG from '$lib/assets/asset 14.webp';
	import u5MG from '$lib/assets/asset 15.webp';
	import u6MG from '$lib/assets/asset 16.webp';
	import u7MG from '$lib/assets/asset 17.webp';
	import u8MG from '$lib/assets/asset 18.webp';
	import u9MG from '$lib/assets/asset 19.webp';
	import u10MG from '$lib/assets/asset 20.webp';
	import u11MG from '$lib/assets/asset 21.webp';
	import u12MG from '$lib/assets/asset 22.webp';
	import u13MG from '$lib/assets/asset 23.webp';
	import u14MG from '$lib/assets/asset 24.webp';
	import u15MG from '$lib/assets/asset 25.webp';
	import u16MG from '$lib/assets/asset 26.webp';
	import u17MG from '$lib/assets/asset 27.webp';
	import u18MG from '$lib/assets/asset 28.webp';

	import { writable } from 'svelte/store';
	import { supabase } from '$lib/supabase';

	// Types
	type FuneralEvent = {
		date: string;
		time: string;
		event: string;
		location: string;
		coordinates?: { lat: number; lng: number };
	};

	type Condolence = {
		id?: number;
		name: string;
		message: string;
		date: string;
		relation?: string;
		approved: boolean;
		created_at?: string;
	};

	type MilitaryAchievement = {
		year: string;
		title: string;
		description: string;
		icon: string;
	};

	// Data
	const birthYear = '1955';
	const deathYear = '2025';

	const militaryAchievements: MilitaryAchievement[] = [
		{
			year: '1975',
			title: 'Nigerian Defence Academy',
			description: 'Graduated with honors from the prestigious Nigerian Defence Academy.',
			icon: 'award'
		},
		{
			year: '1985',
			title: 'United Nations Peacekeeping',
			description:
				'Led a successful peacekeeping mission in Liberia, earning international recognition.',
			icon: 'shield'
		},
		{
			year: '1995',
			title: 'Promotion to Colonel',
			description: 'Recognized for exceptional leadership and strategic acumen.',
			icon: 'star'
		},
		{
			year: '2005',
			title: 'Appointment as Brigadier General',
			description: 'Appointed to lead the 3rd Division of the Nigerian Army.',
			icon: 'award'
		},
		{
			year: '2015',
			title: 'Promotion to Major General',
			description: 'Culmination of decades of exemplary service and leadership.',
			icon: 'award'
		}
	];

	const funeralSchedule: FuneralEvent[] = [
		{
			date: 'April 24, 2025',
			time: '05:00 PM',
			event: 'Night of Tributes',
			location: 'Emmanuel Anglican Church, Avu.'
		},
		{
			date: 'April 25, 2025',
			time: '08:00 AM',
			event: 'Lying in State',
			location: "General Ogbonna's compound, Teshie Villa, Avu Junction."
		},
		{
			date: 'April 25, 2025',
			time: '10:00 AM',
			event: 'Funeral Service',
			location: 'Emmanuel Anglican Church, Avu.'
		},
		{
			date: 'April 17, 2025',
			time: '12:00 PM',
			event: 'Interment',
			location: 'Aburi Gardens, Teshie Villa, Avu Junction.'
		}
	];

	// Changed from const to let to allow reassignment
	let condolences: Condolence[] = [
		{
			name: 'Gen. James Adebayo',
			message:
				'A true patriot and exemplary leader. Your legacy will forever inspire generations to come.',
			date: 'March 15, 2025',
			relation: 'Colleague',
			approved: true
		},
		{
			name: 'Col. Sarah Musa',
			message: 'It was an honor to serve under your command. Rest in peace, sir.',
			date: 'March 14, 2025',
			relation: 'Subordinate Officer',
			approved: true
		},
		{
			name: 'The Ogbonna Family',
			message:
				'Our beloved father, husband, and grandfather. Your wisdom and love will guide us always.',
			date: 'March 13, 2025',
			relation: 'Family',
			approved: true
		}
	];

	const coreValues = [
		{ title: 'Leadership', description: 'Exemplary commander who led by example', icon: 'compass' },
		{
			title: 'Integrity',
			description: 'Unwavering principles throughout his career',
			icon: 'shield'
		},
		{ title: 'Patriotism', description: 'Devoted service to his country and people', icon: 'flag' },
		{ title: 'Family', description: 'Dedicated husband, father, and grandfather', icon: 'heart' }
	];

	// State
	// let scrollY = 0;
	let showFullBiography = false;
	let currentBioPage = 0;
	let bioPages: { title: string; content: string }[] = [];
	let activeSection = 'hero';
	let newCondolence = { name: '', message: '', relation: '' };
	let showSuccessMessage = false;
	let galleryLightbox = { visible: false, currentIndex: 0 };
	let headerVisible = true;
	let lastScrollY = 0;
	let sectionStates: Record<string, boolean> = {};
	const scrollProgress = writable(0);
	let mobileMenuOpen = false;
	let showMorePhotos = false;
	let showMoreCondolences = false;
	let isScrollingProgrammatically = false;

	// Navigation sections
	const navSections = [
		{ id: 'hero', label: 'Home' },
		{ id: 'biography', label: 'Biography' },
		{ id: 'gallery', label: 'Gallery' },
		{ id: 'condolences', label: 'Condolences' },
		{ id: 'funeral', label: 'Funeral' }
	];

	// Add category type
	type ImageCategory = 'military' | 'family' | 'personal' | 'ceremony' | 'all';

	// Add selected category state
	let selectedCategory: ImageCategory = 'all';

	// Update gallery images type
	interface GalleryImage {
		src: string;
		alt: string;
		category: ImageCategory;
	}

	// Gallery images
	const galleryImages: GalleryImage[] = [
		{
			src: stMG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'personal'
		},
		{
			src: wfMG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'family'
		},
		{
			src: gcMG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'family'
		},
		{
			src: portraitMG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'personal'
		},
		{
			src: u0MG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'military'
		},
		{
			src: u1MG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'military'
		},
		{
			src: u2MG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'military'
		},
		{
			src: u3MG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'military'
		}
	];

	//More Gallery images
	const moreGalleryImages: GalleryImage[] = [
		{
			src: dtMG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'family'
		},
		{
			src: u4MG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'military'
		},
		{
			src: u5MG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'military'
		},
		{
			src: u6MG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'personal'
		},
		{
			src: u7MG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'military'
		},
		{
			src: u8MG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'military'
		},
		{
			src: u9MG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'military'
		},
		{
			src: u10MG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'personal'
		},
		{
			src: u11MG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'personal'
		},
		{
			src: u12MG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'personal'
		},
		{
			src: u13MG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'military'
		},
		{
			src: u14MG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'military'
		},
		{
			src: u15MG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'family'
		},
		{
			src: u16MG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'family'
		},
		{
			src: u17MG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'ceremony'
		},
		{
			src: u18MG,
			alt: 'Major General Rowland Nkwazema Ogbonna',
			category: 'ceremony'
		}
	];

	function filterGalleryImages(images: GalleryImage[]): GalleryImage[] {
		if (selectedCategory === 'all') return images;
		return images.filter((image) => image.category === selectedCategory);
	}

	let selectedCondolenceCategory: string = 'all';

	function filterCondolences(condolences: Condolence[]): Condolence[] {
		if (selectedCondolenceCategory === 'all') return condolences;
		return condolences.filter(
			(condolence) =>
				condolence.relation?.toLowerCase() === selectedCondolenceCategory.toLowerCase()
		);
	}

	// Add near your other state declarations
	async function loadCondolences() {
		try {
			const { data, error } = await supabase
				.from('condolences')
				.select('*')
				.eq('approved', true)
				.order('created_at', { ascending: false });

			if (error) throw error;

			condolences = data || [];
		} catch (error) {
			console.error('Error loading condolences:', error);
			condolences = [];
		}
	}

	// Handle condolence submission
	const submitCondolence = async () => {
		if (newCondolence.name && newCondolence.message) {
			const today = new Date();
			const formattedDate = today.toLocaleDateString('en-US', {
				month: 'long',
				day: 'numeric',
				year: 'numeric'
			});

			try {
				// Insert into Supabase
				const { data, error } = await supabase.from('condolences').insert([
					{
						name: newCondolence.name,
						message: newCondolence.message,
						relation: newCondolence.relation || 'Friend',
						date: formattedDate,
						created_at: new Date().toISOString(),
						approved: true
					}
				]);

				if (error) throw error;

				// Refresh condolences list
				await loadCondolences();

				// Reset form
				newCondolence = { name: '', message: '', relation: '' };

				// Show success message
				showSuccessMessage = true;
				setTimeout(() => {
					showSuccessMessage = false;
				}, 3000);
			} catch (error) {
				console.error('Error submitting condolence:', error);
				alert('Failed to submit condolence. Please try again.');
			}
		}
	};

	// Gallery lightbox functions - COMPLETELY REVISED
	const openLightbox = (index: number) => {
		// Calculate the actual index based on whether we're showing more photos
		const actualIndex = index >= 8 && !showMorePhotos ? index - 8 : index;

		galleryLightbox = { visible: true, currentIndex: actualIndex };

		// Prevent body scrolling when lightbox is open
		document.body.style.overflow = 'hidden';
		document.body.style.paddingRight = '15px'; // Prevent layout shift
	};

	const closeLightbox = () => {
		galleryLightbox = { visible: false, currentIndex: 0 };

		// Re-enable body scrolling
		setTimeout(() => {
			document.body.style.overflow = '';
			document.body.style.paddingRight = '';
		}, 100);
	};

	const nextImage = () => {
		if (!galleryLightbox.visible) return;

		// Calculate total images based on whether more photos are shown
		const totalImages = showMorePhotos ? 16 : 8;
		galleryLightbox = {
			...galleryLightbox,
			currentIndex: (galleryLightbox.currentIndex + 1) % totalImages
		};
	};

	const prevImage = () => {
		if (!galleryLightbox.visible) return;

		// Calculate total images based on whether more photos are shown
		const totalImages = showMorePhotos ? 16 : 8;
		galleryLightbox = {
			...galleryLightbox,
			currentIndex: (galleryLightbox.currentIndex - 1 + totalImages) % totalImages
		};
	};

	// Toggle more photos - COMPLETELY REVISED
	const toggleMorePhotos = () => {
		// First ensure lightbox is closed
		if (galleryLightbox.visible) {
			closeLightbox();
		}

		// Toggle the state after ensuring lightbox is closed
		setTimeout(() => {
			showMorePhotos = !showMorePhotos;

			// Make sure body can scroll
			document.body.style.overflow = '';
			document.body.style.paddingRight = '';
			document.body.classList.remove('overflow-hidden');
		}, 200);
	};

	// Toggle more condolences
	const toggleMoreCondolences = () => {
		showMoreCondolences = !showMoreCondolences;
	};

	// Initialize on mount
	// Toggle mobile menu
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	// Define scrollToSection at the component level so it's accessible to the template
	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};

	// Add this function to split the biography text into pages
	function prepareBioPages() {
		// The biography paragraphs - these are the paragraphs after the first 3 that will be shown in the book view
		bioPages = [
			{
				title: 'His Legacy',
				content:
					'Forever etched in history as "The Boy Who Named NMS," General Ogbonna\'s vision in 1959 redefined the future of the Nigerian Military School, Zaria. His suggestion to rename the Boys Company to the Nigerian Military School (NMS) captured the essence of its mission—an enduring legacy that still stands strong today. His clarity of thought and foresight ensured that the institution\'s name reflected its military purpose, and his proposal was officially adopted that same year.'
			},
			{
				title: 'Military Career',
				content:
					"From the halls of the United Stated Army Cadets School, Fort Knox, Kentucky to the frontlines of history at the Command and Staff College in Quetta, Pakistan, General Ogbonna's stellar military career spanned over three decades, during which he earned a reputation as one of the foremost post-civil war 2-Star Generals of Igbo descent."
			},
			{
				title: 'Leadership',
				content:
					'A gallant infantry officer and leader in every sense, he held key roles including Director of Studies at the National Institute for Policy and Strategic Studies (NIPSS), Kuru, Jos.'
			},
			{
				title: 'International Service',
				content:
					"During the Bakassi Peninsula crisis, his leadership as Commander of the 13 Amphibious Brigade played a pivotal role in securing peace between Nigeria and Cameroon, preserving Nigeria's territorial integrity with diplomacy and strength. Globally, he served as a military diplomat, representing Nigeria in key international missions across the Philippines, Venezuela, Brazil, South Africa, the United States, the United Kingdom, Germany, the Netherlands, and China, elevating Nigeria's standing on the global stage."
			},
			{
				title: 'Regional Influence',
				content:
					'In 1983, during a turbulent period in Ghana under Jerry Rawlings, General Ogbonna played a key role in restructuring the Ghanaian military, using his expertise to foster stability in the region.'
			},
			{
				title: 'Mentorship',
				content:
					'But it was not just his military acumen that set him apart—it was his unwavering commitment to the future of the armed forces. Even in retirement, he continued to shape the next generation of military leaders through seminars and mentorship, ensuring that the pillars of tactical excellence, strategy, and resilience remained strong in an ever-changing West Africa.'
			},
			{
				title: 'Community Leadership',
				content:
					'Back home in the Avu Ancient Kingdom, General Ogbonna was a beloved and respected figure. As the Ochi Agha 1 of Avu, Traditional Prime Minister, and Chairman of the Avu Traditional Council, he worked tirelessly to resolve communal disputes and create an environment where peace and prosperity could thrive. His leadership extended beyond the battlefield, nurturing the growth of his community and ensuring its future was as secure as the land he had once defended.'
			},
			{
				title: 'Legacy',
				content:
					"A soldier. A diplomat. A visionary. A leader of his people. General Ogbonna's life was one of quiet strength and unwavering service. His legacy will continue to echo through the generations— through the soldiers he mentored, the communities he uplifted, and the country he served with distinction. His story is one of courage, integrity, and vision, and his memory will live on in the hearts of those who encountered him."
			},
			{
				title: 'Remembrance',
				content:
					'He leaves behind a nation forever indebted to his selfless contributions, a beloved family, and a community that will remember him as a pillar of strength and leadership.'
			}
		];
	}

	// Add these functions to navigate through the biography pages
	function nextBioPage() {
		if (currentBioPage < bioPages.length - 1) {
			currentBioPage++;
		}
	}

	function prevBioPage() {
		if (currentBioPage > 0) {
			currentBioPage--;
		}
	}

	// Add this function to toggle the biography view
	function toggleBiography() {
		showFullBiography = !showFullBiography;
		currentBioPage = 0; // Reset to first page when opening

		// If closing the full view, restore header and scroll back to biography section
		if (!showFullBiography) {
			setTimeout(() => {
				const bioSection = document.getElementById('biography');
				if (bioSection) {
					bioSection.scrollIntoView({ behavior: 'smooth' });
				}
			}, 300);
		}
	}

	// Add this test function temporarily
	async function testSubmission() {
		const { data, error } = await supabase.from('condolences').insert([
			{
				name: 'Test User',
				message: 'Test message',
				date: new Date().toLocaleDateString(),
				relation: 'Test',
				approved: true
			}
		]);

		if (error) {
			console.error('Test submission failed:', error);
		} else {
			console.log('✅ Test submission successful!');
		}
	}

	onMount(() => {
		const checkSupabaseConnection = async () => {
			try {
				const { data, error } = await supabase.from('condolences').select('count').single();

				if (error) {
					console.error('Supabase connection error:', error);
				} else {
					console.log('✅ Supabase connection successful!');
				}
			} catch (e) {
				console.error('Failed to connect to Supabase:', e);
			}
		};

		// Call the connection check
		checkSupabaseConnection();
		loadCondolences();

		const envVars = {
			SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
			SUPABASE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
			MODE: import.meta.env.MODE,
			DEV: import.meta.env.DEV
		};
		console.log('Environment Variables:', envVars);

		// Set up intersection observer for section animations
		const sectionObserver = new IntersectionObserver(
			(entries) => {
				// Don't update active section if we're currently handling a programmatic scroll
				if (isScrollingProgrammatically) return;

				entries.forEach((entry) => {
					const id = entry.target.id;
					sectionStates[id] = entry.isIntersecting;
				});

				// Find the section most in view to set as active
				const visibleSections = Array.from(document.querySelectorAll('section[id]'))
					.filter((section) => sectionStates[section.id])
					.map((section) => {
						const rect = section.getBoundingClientRect();
						const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
						return {
							id: section.id,
							visibleHeight: visibleHeight > 0 ? visibleHeight : 0,
							distanceFromTop: Math.abs(rect.top)
						};
					});

				// Sort by visible height (most visible first), then by closest to top
				visibleSections.sort((a, b) => {
					if (Math.abs(a.visibleHeight - b.visibleHeight) > 50) {
						return b.visibleHeight - a.visibleHeight;
					}
					return a.distanceFromTop - b.distanceFromTop;
				});

				// Only update active section if we have a clear winner
				if (visibleSections.length > 0) {
					activeSection = visibleSections[0].id;
				}
			},
			{
				threshold: [0, 0.1, 0.2],
				rootMargin: '-20px 0px -20px 0px'
			}
		);

		// Observe all sections
		document.querySelectorAll('section[id]').forEach((section) => {
			sectionObserver.observe(section);
			sectionStates[section.id] = false;
		});

		// Modified scroll event handler with improved scroll progress calculation
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			// Update scroll progress with improved calculation
			const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
			scrollProgress.set(Math.min(currentScrollY / maxScroll, 1));

			// Handle header visibility
			headerVisible = lastScrollY > currentScrollY || currentScrollY < 50;
			lastScrollY = currentScrollY;
		};

		// Add scroll event listener with passive flag for better performance
		window.addEventListener('scroll', handleScroll, { passive: true });

		// Initial call to set initial scroll progress
		handleScroll();

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();
		// Prepare biography pages
		prepareBioPages();

		// Cleanup on component unmount
		return () => {
			sectionObserver.disconnect();
			window.removeEventListener('scroll', handleScroll);
		};
	});

	// Handle keyboard events for accessibility
	const handleKeyDown = (event: KeyboardEvent, callback: () => void) => {
		if (event.key === 'Enter' || event.key === ' ') {
			callback();
		}
	};

	const handleLightboxKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			closeLightbox();
		} else if (event.key === 'ArrowRight') {
			nextImage();
		} else if (event.key === 'ArrowLeft') {
			prevImage();
		}
	};

	const additionalCondolences: Condolence[] = [
		{
			name: 'Lt. Col. Ibrahim Mohammed',
			message:
				'Major General Ogbonna was a mentor to many of us. His leadership style and dedication to service will continue to inspire generations of officers.',
			date: 'March 12, 2025',
			relation: 'Military Personnel',
			approved: true
		},
		{
			name: 'Dr. Amina Okonkwo',
			message:
				'I had the privilege of working with the General on several community health initiatives. His commitment to improving healthcare for veterans was remarkable.',
			date: 'March 11, 2025',
			relation: 'Community Member',
			approved: true
		},
		{
			name: 'Chief Emeka Nwosu',
			message:
				'Our community has lost a great son. His contributions to peace and development will never be forgotten.',
			date: 'March 10, 2025',
			relation: 'Community Member',
			approved: true
		}
	];

	newCondolence = { name: '', message: '', relation: '' };
</script>

<!-- Main container -->
<div class="overflow-hidden">
	<!-- Scroll Progress Indicator -->
	<div class="fixed top-0 right-0 left-0 z-[60] h-1 bg-gray-200">
		<div class="bg-ng-green h-full transition-all" style="width: {$scrollProgress * 100}%"></div>
	</div>

	<!-- Header/Navigation -->
	<header
		class="bg-ng-dark bg-opacity-95 fixed top-0 right-0 left-0 z-50 shadow-lg backdrop-blur-md transition-all duration-500"
		style="transform: translateY({headerVisible && !showFullBiography
			? '0'
			: '-100%'}); opacity: {headerVisible && !showFullBiography ? '1' : '0'}"
	>
		<div class="container mx-auto px-4 py-4">
			<div class="flex items-center justify-between">
				<div class="group flex items-center">
					<div
						class="bg-ng-darker border-ng-gold flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 transition-all duration-500 group-hover:scale-110"
					>
						<span
							class="text-ng-gold font-serif text-xl font-bold transition-transform duration-500 group-hover:scale-110"
							>RO</span
						>
					</div>
					<h1 class="ml-3 font-serif text-xl text-white">
						<span
							class="group-hover:text-ng-gold block text-sm text-gray-300 transition-all duration-300"
							>In Memory of</span
						>
						<span class="group-hover:text-ng-gold transition-all duration-300"
							>Major General Rowland Nkwazema Ogbonna</span
						>
					</h1>
				</div>

				<nav class="hidden space-x-8 lg:flex">
					{#each navSections as section, i}
						<button
							on:click={() => scrollToSection(section.id)}
							class="hover:text-ng-gold group relative overflow-hidden text-white transition-all duration-300"
							class:text-ng-gold={activeSection === section.id}
							in:fade={{ delay: 100 * i, duration: 700 }}
						>
							<span class="relative z-10 font-medium">{section.label}</span>
							<span
								class="bg-ng-gold absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
								class:w-full={activeSection === section.id}
							></span>
						</button>
					{/each}
				</nav>

				<!-- Mobile menu button -->
				<button
					class="hover:text-ng-gold p-2 text-white transition-colors duration-300 lg:hidden"
					on:click={toggleMobileMenu}
					aria-label="Toggle mobile menu"
					aria-expanded={mobileMenuOpen}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			</div>
		</div>

		<!-- Mobile menu -->
		{#if mobileMenuOpen}
			<div
				class="bg-ng-darker shadow-lg lg:hidden"
				transition:slide={{ duration: 300, easing: quintOut }}
			>
				<div class="container mx-auto flex flex-col space-y-3 px-4 py-4">
					{#each navSections as section, i}
						<button
							on:click={() => {
								scrollToSection(section.id);
								toggleMobileMenu();
							}}
							class="hover:text-ng-gold border-ng-light flex items-center border-b py-3 text-white transition-all"
							class:text-ng-gold={activeSection === section.id}
							in:fly={{ y: 20, delay: 50 * i, duration: 300 }}
						>
							<span class="mr-3">
								{#if section.id === 'hero'}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
										/>
									</svg>
								{:else if section.id === 'biography'}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
								{:else if section.id === 'gallery'}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
								{:else if section.id === 'condolences'}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
										/>
									</svg>
								{:else if section.id === 'funeral'}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
								{/if}
							</span>
							{section.label}
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</header>

	<!-- Hero Section -->
	<section
		id="hero"
		class="bg-ng-dark relative flex min-h-screen items-center overflow-hidden text-white"
	>
		<!-- Military-inspired background pattern -->
		<div class="absolute inset-0 opacity-10">
			<div class="from-ng-darker/50 to-ng-dark/90 absolute inset-0 bg-gradient-to-b"></div>
		</div>

		<div class="relative z-10 container mx-auto px-4 py-32">
			<div class="grid items-center gap-12 lg:grid-cols-2">
				<div class="order-2 lg:order-1">
					<div class="mb-6 flex items-center">
						<div class="bg-ng-gold mr-4 h-px flex-grow"></div>
						<span class="text-ng-gold text-sm font-medium tracking-widest uppercase"
							>In Memoriam</span
						>
					</div>
					<h1
						class="mb-4 font-serif text-4xl font-bold md:text-5xl lg:text-6xl"
						in:fly={{ y: 50, duration: 800, delay: 200 }}
					>
						Major General<br />
						<span class="text-ng-gold inline-block" in:fly={{ y: 50, duration: 800, delay: 400 }}
							>Rowland Nkwazema Ogbonna</span
						>
					</h1>
					<p
						class="mb-6 font-serif text-xl text-gray-300 md:text-2xl"
						in:fly={{ y: 30, duration: 800, delay: 600 }}
					>
						{birthYear} - {deathYear}
					</p>
					<p
						class="mb-8 max-w-lg text-lg leading-relaxed text-gray-300"
						in:fly={{ y: 30, duration: 800, delay: 800 }}
					>
						A distinguished military officer, devoted family man, and patriot who served his country
						with honor, integrity, and unwavering dedication for over four decades.
					</p>
					<div class="flex flex-wrap gap-4" in:fly={{ y: 30, duration: 800, delay: 1000 }}>
						<button
							on:click={() => scrollToSection('biography')}
							class="bg-ng-gold text-ng-dark hover:bg-ng-gold/90 hover:shadow-ng-gold/20 flex transform items-center rounded-md px-6 py-3 font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
						>
							<span>His Legacy</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="ml-2 h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 14l-7 7m0 0l-7-7m7 7V3"
								/>
							</svg>
						</button>
						<button
							on:click={() => scrollToSection('funeral')}
							class="border-ng-gold text-ng-gold hover:bg-ng-light hover:shadow-ng-gold/10 transform rounded-md border px-6 py-3 font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
						>
							Funeral Details
						</button>
					</div>
				</div>
				<div class="order-1 flex justify-center lg:order-2">
					<div class="relative" in:scale={{ duration: 1000, delay: 300, start: 0.8, opacity: 0 }}>
						<!-- Military medal decoration -->
						<div class="text-ng-gold absolute -top-10 -right-10 h-20 w-20 opacity-80">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1"
								class="h-full w-full"
							>
								<circle cx="12" cy="12" r="10" />
								<path d="M12 2L12 22M2 12L22 12M4 4L20 20M20 4L4 20" />
							</svg>
						</div>

						<!-- Portrait frame -->
						<div class="relative h-96 w-72 md:h-[28rem] md:w-88">
							<div
								class="border-ng-gold animate-pulse-slow absolute inset-0 rotate-3 transform rounded-lg border-8"
							></div>
							<img
								src={portraitMG || '/placeholder.svg'}
								alt="Portrait of Major General Rowland Nkwazema Ogbonna in military uniform"
								class="absolute inset-0 h-full w-full -rotate-3 transform rounded-lg object-cover shadow-2xl transition-all duration-700 hover:rotate-0"
							/>

							<!-- Military ribbon decoration -->
							<div
								class="bg-ng-red absolute -bottom-6 -left-6 h-12 w-32 -rotate-12 transform shadow-lg"
							></div>
							<div
								class="bg-ng-gold absolute -bottom-3 -left-3 h-4 w-32 -rotate-12 transform shadow-lg"
							></div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Decorative elements -->
		<div
			class="from-ng-dark absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t to-transparent"
		></div>
		<div
			class="absolute bottom-10 left-1/2 -translate-x-1/2 transform animate-bounce text-white/50"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-8 w-8"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 14l-7 7m0 0l-7-7m7 7V3"
				/>
			</svg>
		</div>
	</section>

	<!-- Biography Section -->
	<section id="biography" class="relative overflow-hidden bg-white py-24">
		<!-- Decorative background elements -->
		<div class="bg-ng-gold/5 absolute top-0 right-0 h-1/3 w-1/3 rounded-bl-full"></div>
		<div class="bg-ng-gold/5 absolute bottom-0 left-0 h-1/4 w-1/4 rounded-tr-full"></div>

		<div class="relative z-10 container mx-auto px-4">
			<div class="mb-16 text-center">
				<div class="mb-4 inline-flex items-center">
					<div class="bg-ng-gold mr-3 h-px w-8"></div>
					<span class="text-ng-gold text-sm font-medium tracking-widest uppercase">His Story</span>
					<div class="bg-ng-gold ml-3 h-px w-8"></div>
				</div>
				<h2
					class="relative inline-block font-serif text-3xl font-bold md:text-4xl"
					in:fly={{ y: 50, duration: 800 }}
				>
					<span class="relative z-10">Biography & Legacy</span>
					<span
						class="bg-ng-gold absolute bottom-0 left-0 h-1 w-full"
						in:scale={{ duration: 1000, delay: 300, start: 0, opacity: 0.5 }}
					></span>
				</h2>
			</div>

			<!-- Core values -->
			<div class="mb-20 grid grid-cols-2 gap-6 md:grid-cols-4">
				{#each coreValues as value, i}
					<div
						class="transform rounded-lg border border-gray-100 bg-white p-6 text-center shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
						in:fly={{ y: 30, duration: 500, delay: 200 + i * 150 }}
					>
						<div class="text-ng-gold mx-auto mb-4 h-16 w-16">
							{#if value.icon === 'compass'}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-full w-full"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.5"
										d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
									/>
								</svg>
							{:else if value.icon === 'shield'}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-full w-full"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.5"
										d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
									/>
								</svg>
							{:else if value.icon === 'flag'}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-full w-full"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.5"
										d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
									/>
								</svg>
							{:else if value.icon === 'heart'}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-full w-full"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.5"
										d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
									/>
								</svg>
							{/if}
						</div>
						<h3 class="mb-2 text-xl font-bold text-gray-800">{value.title}</h3>
						<p class="text-gray-600">{value.description}</p>
					</div>
				{/each}
			</div>

			<!-- Biography content -->
			<div class="mb-20 grid items-start gap-12 lg:grid-cols-2">
				<div>
					<h3
						class="mb-6 font-serif text-2xl font-bold text-gray-800"
						in:fly={{ x: -30, duration: 800, delay: 300 }}
					>
						A Distinguished Military Career
					</h3>

					<!-- Initial biography paragraphs - limited height to match timeline -->
					<div class="biography-preview" class:full-height={showFullBiography}>
						<p
							class="mb-6 leading-relaxed text-gray-600"
							in:fly={{ x: -30, duration: 800, delay: 400 }}
						>
							Major General Rowland Nkwazema Ogbonna dedicated over four decades of his life to
							military service. His illustrious career began at the Nigerian Defence Academy, where
							he distinguished himself as a cadet of exceptional promise. Throughout his career, he
							held numerous command and staff appointments, each marked by his trademark leadership,
							integrity, and commitment to excellence.
						</p>
						<p
							class="mb-6 leading-relaxed text-gray-600"
							in:fly={{ x: -30, duration: 800, delay: 500 }}
						>
							As a commander, he was known for his strategic acumen and unwavering dedication to the
							welfare of those under his command. His contributions to peacekeeping missions across
							Africa earned him international recognition and numerous decorations, including the
							Grand Service Star and the Distinguished Service Cross.
						</p>
						<p
							class="mb-6 leading-relaxed text-gray-600"
							in:fly={{ x: -30, duration: 800, delay: 600 }}
						>
							Beyond his military achievements, Major General Ogbonna was a devoted family man, a
							mentor to countless young officers, and a pillar of his community. His legacy lives on
							through the institutions he helped build and the lives he touched.
						</p>
						<p
							class="mb-6 leading-relaxed text-gray-600"
							in:fly={{ x: -30, duration: 800, delay: 700 }}
						>
							He leaves behind a nation forever indebted to his selfless contributions, a beloved
							family, and a community that will remember him as a pillar of strength and
							leadership...
						</p>
					</div>

					<!-- See more button -->
					{#if !showFullBiography}
						<button
							on:click={toggleBiography}
							class="bg-ng-gold text-ng-dark hover:bg-ng-gold/90 group mx-auto mt-4 flex transform items-center rounded-md px-6 py-3 font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 md:mt-10 lg:mt-20"
						>
							<span>Read Full Biography</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>
					{/if}
				</div>

				<!-- Book Pop Up - Modified for better mobile experience -->
				{#if showFullBiography}
					<div
						class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-0 md:p-4"
						transition:fade={{ duration: 300 }}
					>
						<div
							class="relative h-full w-full overflow-hidden bg-[#f8f5e9] shadow-2xl md:h-auto md:max-h-[90vh] md:max-w-6xl md:rounded-lg"
							in:fly={{ y: 20, duration: 500 }}
						>
							<!-- Close button - Repositioned for mobile -->
							<div class="bg-ng-dark sticky top-0 z-10 flex justify-end px-4 py-2 lg:hidden">
								<button
									class="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
									on:click={toggleBiography}
									aria-label="Close biography"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>

							<!-- Book header - Adjusted for mobile -->
							<div class="bg-ng-dark p-4 text-center text-white md:p-6">
								<h2 class="font-serif text-2xl font-bold md:text-3xl">The Life & Legacy of</h2>
								<h3 class="text-ng-gold mt-2 font-serif text-3xl font-bold md:text-4xl">
									Major General Rowland Nkwazema Ogbonna
								</h3>
							</div>

							<!-- Book content - Modified for mobile -->
							<div class="flex h-[calc(100vh-200px)] flex-col md:h-[65vh] md:flex-row">
								<!-- Single page view for mobile, dual page for desktop -->
								<div
									class="flex-1 overflow-y-auto p-4 md:w-1/2 md:border-r md:border-gray-300 md:p-8"
								>
									{#if currentBioPage < bioPages.length}
										<div>
											<div class="border-ng-gold/30 mb-4 border-b pb-4 md:mb-6">
												<h3 class="text-ng-dark font-serif text-xl font-bold md:text-2xl">
													{bioPages[currentBioPage].title}
												</h3>
												<div class="text-ng-gold/50 mt-2 h-1 w-24 rounded-full bg-current"></div>
											</div>
											<div class="prose prose-sm md:prose-lg max-w-none">
												<p class="leading-relaxed text-gray-700">
													{bioPages[currentBioPage].content}
												</p>
											</div>
										</div>
									{/if}
								</div>
							</div>

							<!-- Navigation buttons - Redesigned for mobile -->
							<div class="sticky bottom-0 border-t border-gray-200 bg-gray-50 p-3 md:p-4">
								<div class="flex items-center justify-between">
									<button
										class="text-ng-dark flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all disabled:opacity-50 md:px-4 md:text-base"
										on:click={() => (currentBioPage = Math.max(0, currentBioPage - 1))}
										disabled={currentBioPage === 0}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="mr-2 h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 19l-7-7 7-7"
											/>
										</svg>
										Previous
									</button>

									<div class="text-xs text-gray-500 md:text-sm">
										Page {currentBioPage + 1} of {bioPages.length}
									</div>

									<button
										class="text-ng-dark flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all disabled:opacity-50 md:px-4 md:text-base"
										on:click={() =>
											(currentBioPage = Math.min(bioPages.length - 1, currentBioPage + 1))}
										disabled={currentBioPage >= bioPages.length - 1}
									>
										Next
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="ml-2 h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</button>
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- Military career timeline -->
				<div class="timeline border-ng-gold/30 relative border-l-2 pl-8">
					{#each militaryAchievements as achievement, i}
						<div
							class="timeline-item relative mb-12"
							in:fly={{ x: 30, duration: 800, delay: 300 + i * 150 }}
						>
							<!-- Timeline dot -->
							<div class="absolute -left-[41px] flex h-20 w-20 items-center justify-center">
								<div class="bg-ng-gold h-5 w-5 rounded-full"></div>
							</div>

							<!-- Year badge -->
							<div
								class="bg-ng-dark mb-3 inline-block rounded-full px-3 py-1 text-sm font-medium text-white"
							>
								{achievement.year}
							</div>

							<h4 class="mb-2 text-xl font-bold text-gray-800">{achievement.title}</h4>
							<p class="text-gray-600">{achievement.description}</p>

							<!-- Icon -->
							<div class="text-ng-gold absolute top-0 right-0 h-10 w-10 opacity-70">
								{#if achievement.icon === 'award'}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-full w-full"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1.5"
											d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
										/>
									</svg>
								{:else if achievement.icon === 'shield'}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-full w-full"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1.5"
											d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
										/>
									</svg>
								{:else if achievement.icon === 'star'}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-full w-full"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1.5"
											d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
										/>
									</svg>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Quote -->
			<div
				class="bg-ng-light relative mb-12 overflow-hidden rounded-lg p-8 text-white md:p-12"
				in:fly={{ y: 30, duration: 800, delay: 700 }}
			>
				<!-- Decorative quote marks -->
				<div class="text-ng-gold/20 absolute top-4 left-4 font-serif text-9xl">"</div>
				<div class="text-ng-gold/20 absolute right-4 bottom-4 font-serif text-9xl">"</div>

				<div class="relative z-10 mx-auto max-w-3xl text-center">
					<p class="mt-4 mb-6 font-serif text-xl italic md:mt-auto md:text-2xl">
						<br class="md:hidden" />
						"The true measure of a soldier is not how he serves in times of peace, but how he leads in
						times of conflict. Major General Ogbonna exemplified the highest standards of military leadership
						throughout his distinguished career."
					</p>
					<div class="flex items-center justify-center">
						<div class="bg-ng-gold/50 mr-4 h-px w-12"></div>
						<p class="text-ng-gold font-medium">General James Adebayo, Chief of Defence Staff</p>
						<div class="bg-ng-gold/50 ml-4 h-px w-12"></div>
					</div>
				</div>
			</div>

			<!-- Family life -->
			<div class="grid items-center gap-12 md:grid-cols-2">
				<div class="order-2 md:order-1" in:fly={{ x: -30, duration: 800, delay: 300 }}>
					<h3 class="mb-6 font-serif text-2xl font-bold text-gray-800">Family & Personal Life</h3>
					<p class="mb-6 leading-relaxed text-gray-600">
						Beyond his military achievements, Major General Ogbonna was a devoted husband to his
						wife of 40 years, Elizabeth, and a loving father to their three children: Dr. Chioma
						Ogbonna-Adeyemi, Colonel Emeka Ogbonna, and Barrister Nneka Ogbonna.
					</p>
					<p class="mb-6 leading-relaxed text-gray-600">
						He was known for his unwavering commitment to his family, always finding time to attend
						important milestones despite his demanding military career. His grandchildren remember
						him as a gentle storyteller who would regale them with tales of courage and honor from
						Nigerian history.
					</p>
					<p class="mb-6 leading-relaxed text-gray-600">
						In his community, he was a respected elder statesman, known for his generosity and
						commitment to service. He was a mentor and role model for countless. His legacy lives on
						through the lives he touched and the values he instilled in them.
					</p>
				</div>
				<div
					class="order-1 grid grid-cols-2 gap-4 md:order-2"
					in:fly={{ x: 30, duration: 800, delay: 400 }}
				>
					<div
						class="relative h-64 rotate-2 transform overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:rotate-0"
					>
						<img
							src={familyMG || '/placeholder.svg'}
							alt="Family portrait"
							class="h-full w-full object-cover"
						/>
					</div>
					<div
						class="relative mt-8 h-64 -rotate-2 transform overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:rotate-0"
					>
						<img
							src={gcMG || '/placeholder.svg'}
							alt="With grandchildren"
							class="h-full w-full object-cover object-top"
						/>
					</div>
					<div
						class="relative h-64 -rotate-3 transform overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:rotate-0"
					>
						<img
							src={solMG || '/placeholder.svg'}
							alt="At Home"
							class="h-full w-full object-cover"
						/>
					</div>
					<div
						class="relative mt-8 h-64 rotate-3 transform overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:rotate-0"
					>
						<img
							src={celMG || '/placeholder.svg'}
							alt="Family celebration"
							class="h-full w-full object-cover"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Gallery Section -->
	<section id="gallery" class="relative overflow-hidden bg-gray-100 py-24">
		<!-- Decorative background elements -->

		<div class="absolute top-0 left-0 h-20 w-full bg-gradient-to-b from-white to-transparent"></div>

		<div class="relative z-10 container mx-auto px-4">
			<div class="mb-16 text-center">
				<div class="mb-4 inline-flex items-center">
					<div class="bg-ng-gold mr-3 h-px w-8"></div>
					<span class="text-ng-gold text-sm font-medium tracking-widest uppercase">Memories</span>
					<div class="bg-ng-gold ml-3 h-px w-8"></div>
				</div>
				<h2
					class="relative inline-block font-serif text-3xl font-bold md:text-4xl"
					in:fly={{ y: 50, duration: 800 }}
				>
					<span class="relative z-10">Photo Gallery</span>
					<span
						class="bg-ng-gold absolute bottom-0 left-0 h-1 w-full"
						in:scale={{ duration: 1000, delay: 300, start: 0, opacity: 0.5 }}
					></span>
				</h2>
			</div>

			<!-- Gallery categories -->
			<div class="mb-12 flex flex-wrap justify-center gap-4">
				<button
					class="rounded-full px-4 py-2 text-sm font-medium transition-colors {selectedCategory ===
					'all'
						? 'bg-ng-dark text-white'
						: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
					on:click={() => (selectedCategory = 'all')}
				>
					All Photos
				</button>
				<button
					class="rounded-full px-4 py-2 text-sm font-medium transition-colors {selectedCategory ===
					'military'
						? 'bg-ng-dark text-white'
						: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
					on:click={() => (selectedCategory = 'military')}
				>
					Military Career
				</button>
				<button
					class="rounded-full px-4 py-2 text-sm font-medium transition-colors {selectedCategory ===
					'family'
						? 'bg-ng-dark text-white'
						: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
					on:click={() => (selectedCategory = 'family')}
				>
					Family Moments
				</button>
				<button
					class="rounded-full px-4 py-2 text-sm font-medium transition-colors {selectedCategory ===
					'personal'
						? 'bg-ng-dark text-white'
						: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
					on:click={() => (selectedCategory = 'personal')}
				>
					Personal
				</button>
				<button
					class="rounded-full px-4 py-2 text-sm font-medium transition-colors {selectedCategory ===
					'ceremony'
						? 'bg-ng-dark text-white'
						: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
					on:click={() => (selectedCategory = 'ceremony')}
				>
					Ceremonies
				</button>
			</div>

			<!-- Gallery grid -->
			<div class="mb-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
				{#each filterGalleryImages( [...galleryImages, ...moreGalleryImages] ).slice(0, 8) as image, i}
					<button
						class="group relative aspect-square transform cursor-pointer overflow-hidden rounded-lg shadow-md transition-all duration-500 hover:scale-[1.03] hover:shadow-xl"
						on:click={() => openLightbox(i)}
						on:keydown={(e) => handleKeyDown(e, () => openLightbox(i))}
						aria-label={`View gallery image ${i + 1}`}
						in:scale={{ duration: 700, delay: 200 + i * 100, start: 0.8, opacity: 0 }}
					>
						<img
							src={image.src || '/placeholder.svg'}
							alt={image.alt}
							class="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
						/>
						<div
							class="bg-ng-dark absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-30"
						></div>
						<div
							class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						>
							<div class="bg-ng-gold/90 flex h-12 w-12 items-center justify-center rounded-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
						</div>
					</button>
				{/each}
			</div>

			{#if showMorePhotos}
				<div
					class="mb-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
					in:fade={{ duration: 500 }}
				>
					{#each filterGalleryImages([...galleryImages, ...moreGalleryImages]).slice(8) as image, i}
						<button
							class="group relative aspect-square transform cursor-pointer overflow-hidden rounded-lg shadow-md transition-all duration-500 hover:scale-[1.03] hover:shadow-xl"
							on:click={() => openLightbox(i + 8)}
							on:keydown={(e) => handleKeyDown(e, () => openLightbox(i + 8))}
							aria-label={`View gallery image ${i + 9}`}
							in:scale={{ duration: 700, delay: 200 + i * 100, start: 0.8, opacity: 0 }}
						>
							<img
								src={image.src || '/placeholder.svg'}
								alt={image.alt}
								class="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
							/>
							<div
								class="bg-ng-dark absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-30"
							></div>
							<div
								class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							>
								<div class="bg-ng-gold/90 flex h-12 w-12 items-center justify-center rounded-full">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-6 w-6 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
								</div>
							</div>
						</button>
					{/each}
				</div>
			{/if}

			<!-- Load more button -->
			{#if filterGalleryImages([...galleryImages, ...moreGalleryImages]).length > 8}
				<div class="text-center" in:fly={{ y: 30, duration: 800, delay: 1000 }}>
					<button
						on:click={toggleMorePhotos}
						class="bg-ng-dark hover:bg-ng-darker group inline-flex transform items-center rounded-md px-8 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
					>
						<span>{showMorePhotos ? 'Show Less Photos' : 'View More Photos'}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d={showMorePhotos ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
							/>
						</svg>
					</button>
				</div>
			{/if}
		</div>
	</section>

	<!-- Condolence Wall Section -->
	<section id="condolences" class="relative overflow-hidden bg-white py-24">
		<!-- Decorative background elements -->
		<div class="bg-ng-gold/5 absolute top-0 right-0 h-1/3 w-1/3 rounded-bl-full"></div>
		<div class="bg-ng-gold/5 absolute bottom-0 left-0 h-1/4 w-1/4 rounded-tr-full"></div>

		<div class="relative z-10 container mx-auto px-4">
			<div class="mb-16 text-center">
				<div class="mb-4 inline-flex items-center">
					<div class="bg-ng-gold mr-3 h-px w-8"></div>
					<span class="text-ng-gold text-sm font-medium tracking-widest uppercase">Tributes</span>
					<div class="bg-ng-gold ml-3 h-px w-8"></div>
				</div>
				<h2
					class="relative inline-block font-serif text-3xl font-bold md:text-4xl"
					in:fly={{ y: 50, duration: 800 }}
				>
					<span class="relative z-10">Condolence Wall</span>
					<span
						class="bg-ng-gold absolute bottom-0 left-0 h-1 w-full"
						in:scale={{ duration: 1000, delay: 300, start: 0, opacity: 0.5 }}
					></span>
				</h2>
			</div>

			<div class="grid gap-12 lg:grid-cols-2">
				<!-- Condolence form -->
				<div in:fly={{ x: -50, duration: 800, delay: 200 }}>
					<div class="rounded-lg border border-gray-100 bg-white p-8 shadow-lg">
						<h3 class="mb-6 font-serif text-2xl font-bold text-gray-800">Leave Your Condolence</h3>
						<form class="space-y-6" on:submit|preventDefault={submitCondolence} autocomplete="off">
							<div>
								<label for="name" class="mb-1 block text-sm font-medium text-gray-700"
									>Your Name</label
								>
								<input
									type="text"
									id="name"
									bind:value={newCondolence.name}
									class="focus:ring-ng-gold w-full rounded-md border border-gray-300 px-4 py-3 transition-all duration-300 focus:border-transparent focus:ring-2"
									required
								/>
							</div>
							<div>
								<label for="relation" class="mb-1 block text-sm font-medium text-gray-700"
									>Relationship (Optional)</label
								>
								<select
									id="relation"
									bind:value={newCondolence.relation}
									class="focus:ring-ng-gold w-full rounded-md border border-gray-300 px-4 py-3 transition-all duration-300 focus:border-transparent focus:ring-2"
								>
									<option value="">Select relationship</option>
									<option value="Family">Family</option>
									<option value="Friend">Friend</option>
									<option value="Colleague">Colleague</option>
									<option value="Military Personnel">Military Personnel</option>
									<option value="Community Member">Community Member</option>
								</select>
							</div>
							<div>
								<label for="message" class="mb-1 block text-sm font-medium text-gray-700"
									>Your Message</label
								>
								<textarea
									id="message"
									bind:value={newCondolence.message}
									rows="5"
									class="focus:ring-ng-gold w-full rounded-md border border-gray-300 px-4 py-3 transition-all duration-300 focus:border-transparent focus:ring-2"
									required
								></textarea>
							</div>
							<button
								type="submit"
								class="bg-ng-gold text-ng-dark hover:bg-ng-gold/90 group flex w-full transform items-center justify-center rounded-md px-6 py-3 font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
							>
								<span>Submit Condolence</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</button>

							{#if showSuccessMessage}
								<div
									class="mt-4 flex items-center rounded-md bg-green-50 p-4 text-green-800"
									transition:fly={{ y: -20, duration: 300 }}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="mr-2 h-5 w-5 text-green-500"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 13l4 4L19 7"
										/>
									</svg>
									<span>Your condolence has been sent. Thank you for your kind words.</span>
								</div>
							{/if}
						</form>
					</div>
				</div>

				<!-- Condolence wall -->
				<div in:fly={{ x: 50, duration: 800, delay: 300 }}>
					<h3 class="mb-6 font-serif text-2xl font-bold text-gray-800">Recent Condolences</h3>

					<!-- Filter options -->
					<div class="mb-6 flex flex-wrap gap-2">
						<button
							class="rounded-full px-3 py-1 text-sm transition-colors {selectedCondolenceCategory ===
							'all'
								? 'bg-ng-dark text-white'
								: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
							on:click={() => (selectedCondolenceCategory = 'all')}
						>
							All
						</button>
						<button
							class="rounded-full px-3 py-1 text-sm transition-colors {selectedCondolenceCategory ===
							'family'
								? 'bg-ng-dark text-white'
								: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
							on:click={() => (selectedCondolenceCategory = 'family')}
						>
							Family
						</button>
						<button
							class="rounded-full px-3 py-1 text-sm transition-colors {selectedCondolenceCategory ===
							'military personnel'
								? 'bg-ng-dark text-white'
								: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
							on:click={() => (selectedCondolenceCategory = 'military personnel')}
						>
							Military
						</button>
						<button
							class="rounded-full px-3 py-1 text-sm transition-colors {selectedCondolenceCategory ===
							'friend'
								? 'bg-ng-dark text-white'
								: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
							on:click={() => (selectedCondolenceCategory = 'friend')}
						>
							Friends
						</button>
						<button
							class="rounded-full px-3 py-1 text-sm transition-colors {selectedCondolenceCategory ===
							'community member'
								? 'bg-ng-dark text-white'
								: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
							on:click={() => (selectedCondolenceCategory = 'community member')}
						>
							Community
						</button>
					</div>

					<div class="condolence-scrollbar lg:max-h-[600px] space-y-6 overflow-y-auto pr-2">
						{#each filterCondolences( [...condolences, ...additionalCondolences] ).slice(0, showMoreCondolences ? undefined : 3) as condolence, i}
							<div
								class="border-ng-gold transform rounded-lg border-l-4 bg-gray-50 p-6 shadow-sm transition-all duration-300 hover:translate-x-1 hover:shadow-md"
								in:fly={{ y: 20, duration: 500, delay: 200 + i * 100 }}
							>
								<p class="mb-4 text-gray-600 italic">"{condolence.message}"</p>
								<div class="flex flex-wrap items-center justify-between">
									<div>
										<span class="font-medium text-gray-800">{condolence.name}</span>
										{#if condolence.relation}
											<span class="ml-2 text-sm text-gray-500">({condolence.relation})</span>
										{/if}
									</div>
									<span class="text-sm text-gray-500">{condolence.date}</span>
								</div>
							</div>
						{/each}
					</div>

					<!-- Load more button -->

					{#if filterCondolences([...condolences, ...additionalCondolences]).length > 3}
						<button
							on:click={toggleMoreCondolences}
							class="border-ng-dark text-ng-dark hover:bg-ng-light mt-6 w-full rounded-md border px-4 py-3 font-medium transition-all duration-300 hover:text-white"
						>
							{showMoreCondolences ? 'Show Less Condolences' : 'Load More Condolences'}
						</button>
					{/if}
				</div>
			</div>
		</div>
	</section>

	<!-- Funeral Details Section -->
	<section id="funeral" class="bg-ng-dark relative overflow-hidden py-24 text-white">
		<!-- Decorative background elements -->
		<div class="absolute top-0 left-0 h-full w-full opacity-10">
			<div
				class="from-ng-gold/10 absolute top-0 left-0 h-20 w-full bg-gradient-to-b to-transparent"
			></div>
			<div
				class="from-ng-gold/10 absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t to-transparent"
			></div>
		</div>

		<div class="relative z-10 container mx-auto px-4">
			<div class="mb-16 text-center">
				<div class="mb-4 inline-flex items-center">
					<div class="bg-ng-gold mr-3 h-px w-8"></div>
					<span class="text-ng-gold text-sm font-medium tracking-widest uppercase">Ceremony</span>
					<div class="bg-ng-gold ml-3 h-px w-8"></div>
				</div>
				<h2
					class="relative inline-block font-serif text-3xl font-bold md:text-4xl"
					in:fly={{ y: 50, duration: 800 }}
				>
					<span class="relative z-10">Funeral Arrangements</span>
					<span
						class="bg-ng-gold absolute bottom-0 left-0 h-1 w-full"
						in:scale={{ duration: 1000, delay: 300, start: 0, opacity: 0.5 }}
					></span>
				</h2>
			</div>

			<div class="grid gap-12 lg:grid-cols-2">
				<!-- Schedule -->
				<div in:fly={{ x: -50, duration: 800, delay: 200 }}>
					<h3 class="text-ng-gold mb-8 font-serif text-2xl font-bold">Schedule of Events</h3>
					<div class="space-y-8">
						{#each funeralSchedule as event, i}
							<div
								class="bg-ng-light border-ng-gold transform rounded-lg border-l-4 p-6 transition-all duration-500 hover:translate-x-2"
								in:fly={{ x: -30, duration: 500, delay: 400 + i * 200 }}
							>
								<div class="mb-4 flex items-center">
									<div
										class="bg-ng-dark border-ng-gold/30 mr-4 flex h-12 w-12 items-center justify-center rounded-full border"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="text-ng-gold h-6 w-6"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<span class="text-ng-gold text-xl font-medium">{event.date}</span>
								</div>
								<h4 class="mb-3 text-2xl font-medium">{event.event}</h4>
								<div class="mb-3 flex items-center text-gray-300">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="text-ng-gold/70 mr-2 h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<span>{event.time}</span>
								</div>
								<div class="flex items-center text-gray-300">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="text-ng-gold/70 mr-2 h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									<span>{event.location}</span>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Location and contact -->
				<div in:fly={{ x: 50, duration: 800, delay: 300 }} class="flex flex-col justify-between">
					<div>
						<h3 class="text-ng-gold mb-8 font-serif text-2xl font-bold">Location</h3>
						<div
							class="bg-ng-light hover:shadow-ng-gold/10 hover:bg-ng-light/80 mb-8 transform rounded-lg p-6 transition-all duration-500 hover:shadow-xl"
						>
							<div class="bg-ng-darker mb-6 aspect-video overflow-hidden rounded-lg">
								<!-- Map placeholder - in a real implementation, this would be a Google Map or similar -->
								<div
									class="group relative flex h-full w-full items-center justify-center text-gray-500"
								>
									<!-- svelte-ignore a11y_missing_attribute -->
									<iframe
										style="width: 100%; height: 100%; border:0;"
										src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31773.600683014924!2d7.000627!3d5.4624!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10425bf2ffb71cb3%3A0x3d2fded164095624!2sPort%20Harcourt%20Rd%2C%20New%20Owerri%2C%20Imo%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1742716054187!5m2!1sen!2sus"
										width="600"
										height="450"
										loading="lazy"
										referrerpolicy="no-referrer-when-downgrade"
									></iframe>
									<div
										class="bg-ng-gold/10 absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
									></div>
								</div>
							</div>
							<h4 class="mb-2 text-xl font-medium">Off PortHarcourt Road</h4>
							<p class="mb-4 text-gray-300">Owerri, Imo state.</p>
							<div class="flex flex-wrap gap-4">
								<a
									href="https://maps.app.goo.gl/FMymxtuwd1U3Y1L87"
									target="_blank"
									rel="noopener noreferrer"
									class="text-ng-gold group inline-flex items-center hover:underline"
								>
									<span>Get Directions</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
										/>
									</svg>
								</a>
								<a
									href="https://www.google.com/maps/"
									class="text-ng-gold group inline-flex items-center hover:underline"
								>
									<span>Other Locations</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</a>
							</div>
						</div>
					</div>

					<!-- Military honors -->
					<div
						class="bg-ng-darker border-ng-gold/20 mt-12 rounded-lg border p-6"
						in:fly={{ y: 30, duration: 500, delay: 800 }}
					>
						<h4 class="mb-4 flex items-center text-xl font-medium">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="text-ng-gold mr-2 h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
								/>
							</svg>
							Family Remembrances
						</h4>
						<p class="mb-4 text-gray-300">
							The Ogbonna family will honor their beloved patriarch through:
						</p>
						<ul class="space-y-2 text-gray-300">
							<li class="flex items-start">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="text-ng-gold mt-0.5 mr-2 h-5 w-5 flex-shrink-0"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								A Family Memory Book with personal stories and photographs
							</li>
							<li class="flex items-start">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="text-ng-gold mt-0.5 mr-2 h-5 w-5 flex-shrink-0"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								Personal tributes from family members during the service
							</li>
							<li class="flex items-start">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="text-ng-gold mt-0.5 mr-2 h-5 w-5 flex-shrink-0"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								Display of cherished family mementos
							</li>
							<li class="flex items-start">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="text-ng-gold mt-0.5 mr-2 h-5 w-5 flex-shrink-0"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								Special family gathering to share memories after the service
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="bg-ng-darker border-ng-light border-t py-12 text-gray-400">
		<div class="container mx-auto px-4">
			<div class="mb-8 grid gap-8 md:grid-cols-3">
				<div>
					<div class="group mb-4 flex items-center">
						<div
							class="bg-ng-dark border-ng-gold flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 transition-all duration-500 group-hover:scale-110"
						>
							<span
								class="text-ng-gold font-serif text-xl transition-transform duration-500 group-hover:scale-110"
								>RO</span
							>
						</div>
						<h3 class="ml-3 font-serif text-lg text-white">
							<span
								class="group-hover:text-ng-gold block text-sm text-gray-400 transition-all duration-300"
								>In Memory of</span
							>
							<span class="group-hover:text-ng-gold transition-all duration-300"
								>Major General Rowland Nkwazema Ogbonna</span
							>
						</h3>
					</div>
					<p class="mb-4 text-gray-400">
						{birthYear} - {deathYear}
					</p>
					<p class="text-gray-400">
						A life of service, honor, and dedication to family and country.
					</p>
				</div>

				<div>
					<h3 class="mb-4 text-lg font-medium text-white">Quick Links</h3>
					<ul class="space-y-2">
						{#each navSections as section}
							<li>
								<button
									on:click={() => scrollToSection(section.id)}
									class="hover:text-ng-gold flex items-center text-gray-400 transition-colors duration-300"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="mr-2 h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5l7 7-7 7"
										/>
									</svg>
									{section.label}
								</button>
							</li>
						{/each}
					</ul>
				</div>

				<div>
					<h3 class="mb-4 text-lg font-medium text-white">The Ogbonna Family</h3>
					<p class="mb-4 text-gray-400">
						We are deeply grateful for the love, support, and kindness shown to us during this
						difficult time. Your prayers, comforting words, and presence have been a great source of
						strength. While no gesture can fill the void left in our hearts, knowing that we are
						surrounded by such warmth and care brings us peace. Thank you for standing with us,
						honoring his memory, and sharing in our grief.
					</p>
					<button 
					type="button"
					on:click={() => scrollToSection('funeral')}
					on:keydown={(e) => handleKeyDown(e, () => scrollToSection('funeral'))}
					class="text-ng-gold inline-flex items-center hover:underline hover:cursor-pointer"
					aria-label="Make a tribute">
						<span>Make a Tribute</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="ml-1 h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
							/>
						</svg>
					</button>
				</div>
			</div>

			<div
				class="border-ng-light flex flex-col items-center justify-between border-t pt-8 md:flex-row"
			>
				<p class="mb-4 md:mb-0">
					&copy; {new Date().getFullYear()} - In Memory of Major General Rowland Nkwazema Ogbonna | Designed
					by
					<a
						href="https://giddelwilson.vercel.app/"
						target="_blank"
						rel="noopener noreferrer"
						class="text-ng-gold hover:underline">Giddel Wilson</a
					>
				</p>
				<div class="flex space-x-6">
					<a href="/privacy" class="hover:text-ng-gold text-gray-400 transition-colors duration-300"
						>Privacy Policy</a
					>
					<a href="/contact" class="hover:text-ng-gold text-gray-400 transition-colors duration-300"
						>Contact</a
					>
					<a href="/credits" class="hover:text-ng-gold text-gray-400 transition-colors duration-300"
						>Credits</a
					>
				</div>
			</div>
		</div>
	</footer>

	<!-- Lightbox for gallery images -->
	{#if galleryLightbox.visible}
		<div
			class="bg-opacity-95 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
			on:click={closeLightbox}
			on:keydown={handleLightboxKeyDown}
			role="dialog"
			aria-modal="true"
			aria-label="Image lightbox"
			tabindex="0"
			transition:fade={{ duration: 300 }}
		>
			<div class="relative max-h-full max-w-5xl">
				<button
					class="hover:text-ng-gold absolute top-4 right-4 z-20 rounded-full bg-black/50 p-2 text-white transition-colors duration-300"
					on:click|stopPropagation={closeLightbox}
					on:keydown|stopPropagation={(e) => handleKeyDown(e, closeLightbox)}
					aria-label="Close lightbox"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>

				<!-- Navigation buttons -->
				<button
					class="hover:text-ng-gold absolute top-1/2 left-4 z-20 -translate-y-1/2 transform rounded-full bg-black/50 p-3 text-white transition-colors duration-300 hover:bg-black/70"
					on:click|stopPropagation={prevImage}
					on:keydown|stopPropagation={(e) => handleKeyDown(e, prevImage)}
					aria-label="Previous image"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>

				<button
					class="hover:text-ng-gold absolute top-1/2 right-4 z-20 -translate-y-1/2 transform rounded-full bg-black/50 p-3 text-white transition-colors duration-300 hover:bg-black/70"
					on:click|stopPropagation={nextImage}
					on:keydown|stopPropagation={(e) => handleKeyDown(e, nextImage)}
					aria-label="Next image"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>

				<div class="relative">
					{#key galleryLightbox.currentIndex}
						<img
							src={showMorePhotos && galleryLightbox.currentIndex >= 8
								? moreGalleryImages[galleryLightbox.currentIndex - 8].src
								: galleryImages[galleryLightbox.currentIndex].src || '/placeholder.svg'}
							alt={showMorePhotos && galleryLightbox.currentIndex >= 8
								? moreGalleryImages[galleryLightbox.currentIndex - 8].alt
								: galleryImages[galleryLightbox.currentIndex].alt}
							class="h-[85vh] max-w-full rounded-lg object-contain"
							in:fade={{ duration: 300 }}
						/>
					{/key}

					<!-- Image counter and caption -->
					<div class="absolute right-0 bottom-4 left-0 flex justify-center">
						<div
							class="flex items-center space-x-2 rounded-full bg-black/70 px-4 py-2 text-sm text-white"
						>
							<span>{galleryLightbox.currentIndex + 1} / {showMorePhotos ? 16 : 8}</span>
							<span class="mx-2 h-4 w-px bg-gray-500"></span>
							<span
								>{showMorePhotos && galleryLightbox.currentIndex >= 8
									? moreGalleryImages[galleryLightbox.currentIndex - 8].alt
									: galleryImages[galleryLightbox.currentIndex].alt}</span
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Custom color variables for Nigerian military theme */
	:global(:root) {
		--color-ng-dark: #013220; /* Nigerian military dark green */
		--color-ng-darker: #001a10; /* Darker shade of green */
		--color-ng-light: #0a4d30; /* Lighter shade of green */
		--color-ng-gold: #d4af37; /* Military gold */
		--color-ng-red: #c8102e; /* Nigerian flag red */
		--color-ng-green: #008751; /* Nigerian flag green */
	}

	/* Global styles */
	:global(html) {
		scroll-behavior: auto !important; /* Force disable smooth scrolling */
	}

	:global(body) {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		overflow-x: hidden;
		scroll-behavior: auto !important; /* Force disable smooth scrolling */
	}

	:global(section) {
		scroll-snap-align: none !important; /* Disable snap alignment */
		scroll-margin: 0 !important; /* Reset scroll margin */
		scroll-behavior: auto !important; /* Force disable smooth scrolling */
	}

	/* Custom utility classes */
	.bg-ng-dark {
		background-color: var(--color-ng-dark);
	}

	.bg-ng-darker {
		background-color: var(--color-ng-darker);
	}

	.bg-ng-light {
		background-color: var(--color-ng-light);
	}

	.bg-ng-gold {
		background-color: var(--color-ng-gold);
	}

	.bg-ng-red {
		background-color: var(--color-ng-red);
	}

	.bg-ng-green {
		background-color: var(--color-ng-green);
	}

	.text-ng-gold {
		color: var(--color-ng-gold);
	}

	.text-ng-dark {
		color: var(--color-ng-dark);
	}

	.border-ng-gold {
		border-color: var(--color-ng-gold);
	}

	/* Custom scrollbar for condolences */
	.condolence-scrollbar::-webkit-scrollbar {
		width: 6px;
	}

	.condolence-scrollbar::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 10px;
	}

	.condolence-scrollbar::-webkit-scrollbar-thumb {
		background: var(--color-ng-gold);
		border-radius: 10px;
	}

	.condolence-scrollbar::-webkit-scrollbar-thumb:hover {
		background: #b8941f;
	}

	/* Animations */
	.animate-pulse-slow {
		animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}

	@media (max-width: 768px) {
		.prose-sm {
			font-size: 0.875rem;
			line-height: 1.7142857;
		}
	}
</style>
