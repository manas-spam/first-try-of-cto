/**
 * Atlas Data - Indian States, Districts, and Destinations
 * Contains structured content with sensory descriptions, cultural context, and geospatial information
 */

import type { AtlasData, State, District, Destination, AudioClip } from './types'

/**
 * Sample Audio Clips - Reusable audio metadata
 */
const audioClips: Record<string, AudioClip> = {
  'maharaja-narration': {
    id: 'maharaja-narration',
    title: 'The Maharaja\'s Legacy',
    description: 'A narration about the royal heritage of Rajasthan',
    url: '/audio/rajasthan/maharaja-narration.mp3',
    speaker: 'Renowned historian',
    language: 'en',
    duration: 180,
    category: 'narration',
  },
  'palace-ambient': {
    id: 'palace-ambient',
    title: 'Palace Ambience',
    description: 'Ambient sounds of a historic palace',
    url: '/audio/rajasthan/palace-ambient.mp3',
    speaker: 'Sound designer',
    language: 'en',
    duration: 300,
    category: 'ambient-sound',
  },
  'backwater-ambient': {
    id: 'backwater-ambient',
    title: 'Kerala Backwater Sounds',
    description: 'Natural sounds of Kerala backwaters with traditional boat movements',
    url: '/audio/kerala/backwater-ambient.mp3',
    speaker: 'Nature recordist',
    language: 'en',
    duration: 420,
    category: 'ambient-sound',
  },
  'spice-market-interview': {
    id: 'spice-market-interview',
    title: 'Spice Merchant Stories',
    description: 'Interview with Kerala spice merchants discussing ancient trade routes',
    url: '/audio/kerala/spice-merchant-interview.mp3',
    speaker: 'Local merchants',
    language: 'en',
    duration: 240,
    category: 'interview',
  },
}

/**
 * EXEMPLAR 1: RAJASTHAN STATE
 * Complete state with districts and destinations
 */

// Jaipur District
const jaipurDistrict: District = {
  id: 'dist-jaipur',
  name: 'Jaipur',
  stateId: 'state-rajasthan',
  centroid: [75.8245, 26.9124],
  boundary: [
    [
      [75.5, 26.7],
      [76.2, 26.7],
      [76.2, 27.2],
      [75.5, 27.2],
      [75.5, 26.7],
    ],
  ],
  population: 3046163,
  area: 5714,
  sensoryDescription: 'The pink city blooms with warm terracotta hues, filled with aromatic spices and the rhythmic sounds of traditional markets. Ancient palaces whisper stories of royal dynasties.',
  cultural: {
    historicalAnecdote: 'Maharaja Sawai Ram Singh II painted the city pink in 1876 as a gesture of welcome and prosperity, a tradition maintained to this day.',
    proverb: 'Jaipur chehra Bharat ka - Jaipur is the face of India',
    culturalSignificance: 'The capital of Rajasthan, Jaipur represents the pinnacle of Mughal-Hindu architecture and royal heritage.',
    festivals: ['Teej', 'Dussehra', 'Holi'],
  },
  categories: ['mainstream', 'living-heritage'],
  destinationIds: ['dest-city-palace', 'dest-hawa-mahal', 'dest-jantar-mantar'],
  culturalPulse: {
    pattern: 'geometric',
    color: '#FF6B6B',
    tempo: 120,
    intensity: 75,
    description: 'Structured yet vibrant, reflecting the grid-planned city and royal precision',
  },
}

// City Palace Destination
const cityPalaceDestination: Destination = {
  id: 'dest-city-palace',
  name: 'City Palace Jaipur',
  type: 'heritage-site',
  coordinates: [75.825, 26.924],
  districtId: 'dist-jaipur',
  stateId: 'state-rajasthan',
  sensoryDescription: {
    visual: 'Stunning pink and cream-colored sandstone structures with intricate lattice windows, ornate facades adorned with marble inlays and jali work.',
    auditory: 'The gentle murmur of tourists, occasional traditional music from courtyard performances, and the echo of footsteps in marble corridors.',
    olfactory: 'Fragrance of incense, sandalwood, and musk from the inner sanctums; fresh sandstone dust on sunny days.',
    tactile: 'Smooth marble floors, cool stone walls, ornate metalwork railings, and the texture of ancient jali screens.',
  },
  cultural: {
    historicalAnecdote: 'Built in 1876 by Maharaja Sawai Ram Singh II, the palace beautifully merges Mughal and European architectural styles, representing the harmonious vision of the founder of Jaipur.',
    proverb: 'Raj gharon ka sheesh mahal - The crown jewel of palaces',
    culturalSignificance: 'A living palace where royal family members still reside, representing the continuity of Rajasthan\'s royal heritage.',
    festivals: ['Diwali celebrations', 'Republic Day events'],
  },
  audioClips: [audioClips['maharaja-narration'], audioClips['palace-ambient']],
  weatherVariants: [
    {
      season: 'summer',
      assetId: 'jaipur-summer-haze',
      temperatureRange: [35, 45],
      humidity: 25,
      description: 'Intense heat with golden afternoon light creating dramatic shadows on palace facades',
    },
    {
      season: 'monsoon',
      assetId: 'jaipur-monsoon-greenery',
      temperatureRange: [25, 35],
      humidity: 70,
      description: 'Refreshing green surroundings with occasional rain creating mirror reflections in courtyards',
    },
    {
      season: 'winter',
      assetId: 'jaipur-winter-clarity',
      temperatureRange: [10, 25],
      humidity: 40,
      description: 'Clear skies with soft warm light, perfect for detailed photography and exploration',
    },
  ],
  categories: ['mainstream', 'living-heritage'],
  culturalPulse: {
    pattern: 'geometric',
    color: '#E8956D',
    tempo: 110,
    intensity: 60,
    description: 'Measured and regal, reflecting the royal heritage and architectural precision',
  },
  elevation: 431,
  population: 3046163,
  bestVisitedDuring: 'October-March',
  accessibilityNotes: 'Wheelchair accessible on ground floor, many stairs within palace sections',
  estimatedVisitDuration: '3-4 hours',
}

// Hawa Mahal Destination
const hawamahalDestination: Destination = {
  id: 'dest-hawa-mahal',
  name: 'Hawa Mahal (Palace of Winds)',
  type: 'landmark',
  coordinates: [75.8263, 26.9245],
  districtId: 'dist-jaipur',
  stateId: 'state-rajasthan',
  sensoryDescription: {
    visual: 'The iconic five-story pyramid-shaped pink sandstone structure with 953 small windows (jharokhas) creating an intricate latticed pattern.',
    auditory: 'The whistling sound of wind through the numerous windows on breezy days, creating a natural musical effect.',
    olfactory: 'Pink sandstone dust, incense from nearby temples, and street food aromas from surrounding market.',
    tactile: 'Rough textured sandstone walls, narrow curved staircases, and the feeling of cool air flowing through windows.',
  },
  cultural: {
    historicalAnecdote: 'Built in 1799 by Maharaja Sawai Pratap Singh, the structure was designed as a viewing chamber for royal women to observe street life and festivals without being seen.',
    proverb: 'Ankhon se door, par dil mein karib - Far from sight, but close to the heart',
    culturalSignificance: 'An architectural marvel representing Mughal aesthetic principles and women\'s role in royal households.',
    festivals: ['Makar Sankranti celebrations', 'City Festival events'],
  },
  audioClips: [audioClips['palace-ambient']],
  weatherVariants: [
    {
      season: 'summer',
      assetId: 'hawa-mahal-summer-glow',
      temperatureRange: [35, 45],
      humidity: 20,
      description: 'Brilliant pink color intensified by bright sunlight, extreme heat inside the structure',
    },
    {
      season: 'monsoon',
      assetId: 'hawa-mahal-monsoon-dark',
      temperatureRange: [25, 32],
      humidity: 75,
      description: 'Cooler and darker, the pink turns deeper, creating a mysterious ambiance',
    },
    {
      season: 'winter',
      assetId: 'hawa-mahal-winter-soft',
      temperatureRange: [12, 28],
      humidity: 35,
      description: 'Soft golden light creates the most photogenic conditions, comfortable wind flow',
    },
  ],
  categories: ['mainstream', 'hidden-gem'],
  culturalPulse: {
    pattern: 'geometric',
    color: '#FF8A80',
    tempo: 95,
    intensity: 50,
    description: 'The rhythm of wind through windows - natural, unpredictable yet harmonious',
  },
  elevation: 430,
  bestVisitedDuring: 'October-March (early morning)',
  accessibilityNotes: 'Not wheelchair accessible, narrow winding stairs',
  estimatedVisitDuration: '1-2 hours',
}

// Jantar Mantar Destination
const jantarMantarDestination: Destination = {
  id: 'dest-jantar-mantar',
  name: 'Jantar Mantar - Ancient Observatory',
  type: 'heritage-site',
  coordinates: [75.8237, 26.9262],
  districtId: 'dist-jaipur',
  stateId: 'state-rajasthan',
  sensoryDescription: {
    visual: 'Extraordinary collection of 19 geometric architectural astronomical instruments built in red and pink sandstone, arranged like abstract sculptures.',
    auditory: 'Soft whispers of tour guides explaining celestial mechanics, wind humming through geometric structures.',
    olfactory: 'Aged sandstone aroma, dry earth, occasional incense from nearby temples.',
    tactile: 'Stone steps, metal railings, and the textures of precisely carved astronomical instruments.',
  },
  cultural: {
    historicalAnecdote: 'Constructed between 1728-1734 by Maharaja Sawai Jai Singh II, it remains the world\'s largest stone astronomical observation instrument.',
    proverb: 'Tare dekho, aasman samjho - Look at the stars, understand the universe',
    culturalSignificance: 'A UNESCO World Heritage Site representing the pinnacle of Mughal scientific achievement and astronomical knowledge.',
    festivals: ['Science festivals', 'Cultural heritage events'],
  },
  audioClips: [audioClips['maharaja-narration']],
  weatherVariants: [
    {
      season: 'summer',
      assetId: 'jantar-mantar-summer-shadows',
      temperatureRange: [35, 44],
      humidity: 22,
      description: 'Long shadows from instruments create dramatic patterns, excellent for astronomical observations',
    },
    {
      season: 'monsoon',
      assetId: 'jantar-mantar-monsoon-glow',
      temperatureRange: [26, 34],
      humidity: 68,
      description: 'Wet stone creates reflective surfaces, the air is cleaner for star observation at night',
    },
    {
      season: 'winter',
      assetId: 'jantar-mantar-winter-clarity',
      temperatureRange: [11, 26],
      humidity: 38,
      description: 'Perfect conditions for astronomical observation with clear night skies',
    },
  ],
  categories: ['mainstream', 'hidden-gem', 'living-heritage'],
  culturalPulse: {
    pattern: 'geometric',
    color: '#FF7043',
    tempo: 60,
    intensity: 40,
    description: 'Meditative and precise, reflecting the mathematical harmony of the cosmos',
  },
  elevation: 428,
  bestVisitedDuring: 'October-March (sunset viewing)',
  accessibilityNotes: 'Mostly accessible, some areas require climbing',
  estimatedVisitDuration: '2-3 hours',
}

// Rajasthan State
const rajasthanState: State = {
  id: 'state-rajasthan',
  name: 'Rajasthan',
  code: 'RJ',
  type: 'state',
  centroid: [75.5893, 27.0238],
  population: 68548437,
  area: 342239,
  sensoryDescription: 'The land of kings resonates with warm colors, spiced aromas, and ancient musical traditions. Desert winds carry whispers of camel caravans and the echoes of royal courts.',
  cultural: {
    historicalAnecdote: 'Rajasthan\'s history is woven with tales of chivalrous warriors and magnificent palaces. The region was ruled by powerful Hindu kingdoms and later Mughal emperors, creating a unique blend of cultures.',
    proverb: 'Marwar mein pani nahi, lekhin garv bhara hai - Marwar has no water, but hearts full of pride',
    culturalSignificance: 'Rajasthan is the epitome of Indian royal heritage, known for its majestic forts, intricate art forms, and vibrant cultural traditions.',
    festivals: ['Pushkar Fair', 'Holi', 'Diwali', 'Teej', 'Jaisalmer Desert Festival'],
  },
  primaryLanguages: ['Hindi', 'Marwari', 'Mewari'],
  categories: ['mainstream', 'living-heritage', 'adventure', 'culinary'],
  districtIds: ['dist-jaipur', 'dist-jodhpur', 'dist-udaipur'],
  culturalPulse: {
    pattern: 'organic',
    color: '#FF8C42',
    tempo: 125,
    intensity: 80,
    description: 'Bold and spirited, reflecting the warrior spirit and vibrant cultural traditions of the desert kingdom',
  },
  capital: 'Jaipur',
}

/**
 * EXEMPLAR 2: KERALA STATE
 * Complete state with districts and destinations
 */

// Ernakulam District
const ernakulamDistrict: District = {
  id: 'dist-ernakulam',
  name: 'Ernakulam',
  stateId: 'state-kerala',
  centroid: [76.2889, 9.9312],
  boundary: [
    [
      [76.0, 9.7],
      [76.6, 9.7],
      [76.6, 10.2],
      [76.0, 10.2],
      [76.0, 9.7],
    ],
  ],
  population: 3404365,
  area: 3068,
  sensoryDescription: 'Tropical backwaters shimmer under palm canopies, carrying the fragrance of cardamom and black pepper. The gentle lapping of water, bird calls, and the rhythmic movement of Chinese fishing nets create a meditative ambiance.',
  cultural: {
    historicalAnecdote: 'Ernakulam is the commercial heart of Kerala, shaped by centuries of maritime trade with Arab merchants, Portuguese traders, and British colonizers, creating a unique multicultural heritage.',
    proverb: 'Vellanjali mara munpe - Beneath the coconut tree\'s shade',
    culturalSignificance: 'A major spice trading center since ancient times, representing the cultural confluence of Hindu, Christian, Jewish, and Muslim traditions.',
    festivals: ['Cochin Carnival', 'Ernakulathappan Festival', 'Christmas festivities'],
  },
  categories: ['mainstream', 'culinary', 'living-heritage'],
  destinationIds: ['dest-chinese-fishing-nets', 'dest-jew-synagogue', 'dest-spice-market'],
  culturalPulse: {
    pattern: 'fluid',
    color: '#26C281',
    tempo: 100,
    intensity: 65,
    description: 'Flowing and harmonious, reflecting the gentle backwaters and multicultural blend of influences',
  },
}

// Chinese Fishing Nets Destination
const chineseFishingNetsDestination: Destination = {
  id: 'dest-chinese-fishing-nets',
  name: 'Chinese Fishing Nets',
  type: 'landmark',
  coordinates: [76.2679, 9.9638],
  districtId: 'dist-ernakulam',
  stateId: 'state-kerala',
  sensoryDescription: {
    visual: 'Massive cantilevered wooden structures with graceful geometric frames silhouetted against shimmering backwaters, their nets rising and falling in hypnotic rhythms.',
    auditory: 'The creaking of wooden structures, splashing water, calls of fishermen, and the symphony of winch movements and water wildlife.',
    olfactory: 'Salty sea air mixed with fresh fish, wet wood, and mangrove swamp scents.',
    tactile: 'Weathered wood surfaces, spray from water, the vibration of working nets, and the warmth of tropical sun.',
  },
  cultural: {
    historicalAnecdote: 'Introduced in the 14th century by traders from the court of Kublai Khan, these ingenious structures represent the confluence of Chinese and Kerala maritime traditions.',
    proverb: 'Kayal velicham - The backwater\'s reflection',
    culturalSignificance: 'Living heritage representing centuries of trade and cultural exchange, these nets are iconic symbols of Kerala\'s maritime history.',
    festivals: ['Monsoon celebrations', 'Cultural tourism events'],
  },
  audioClips: [audioClips['backwater-ambient']],
  weatherVariants: [
    {
      season: 'summer',
      assetId: 'fishing-nets-summer-bright',
      temperatureRange: [28, 36],
      humidity: 60,
      description: 'Bright sunlight creates dramatic shadows, very active fishing season',
    },
    {
      season: 'monsoon',
      assetId: 'fishing-nets-monsoon-mist',
      temperatureRange: [24, 32],
      humidity: 85,
      description: 'Mystical mist over backwaters, dramatic monsoon clouds, reduced activity',
    },
    {
      season: 'winter',
      assetId: 'fishing-nets-winter-calm',
      temperatureRange: [22, 30],
      humidity: 70,
      description: 'Perfect visibility, cool breezes, peak tourism and fishing season',
    },
  ],
  categories: ['mainstream', 'living-heritage'],
  culturalPulse: {
    pattern: 'organic',
    color: '#0084FF',
    tempo: 80,
    intensity: 55,
    description: 'Rhythmic and meditative, reflecting the patient cycles of fishing and tidal movements',
  },
  elevation: 2,
  bestVisitedDuring: 'November-March (dry season)',
  accessibilityNotes: 'Can be viewed from ground level, some platforms are accessible',
  estimatedVisitDuration: '1-2 hours',
}

// Jewish Synagogue Destination
const jewSynagogueDestination: Destination = {
  id: 'dest-jew-synagogue',
  name: 'Paradesi Synagogue',
  type: 'heritage-site',
  coordinates: [76.2696, 9.9668],
  districtId: 'dist-ernakulam',
  stateId: 'state-kerala',
  sensoryDescription: {
    visual: 'Ornate synagogue with hand-painted Chinese tiles adorning the floor in intricate patterns, brass lamps, and wooden carved pulpits with Hebrew inscriptions.',
    auditory: 'Echoing chants during services, soft footsteps on tiled floors, the gentle ring of ritual bells.',
    olfactory: 'Incense smoke, aged wood polish, and the aroma of traditional oil lamps.',
    tactile: 'Smooth ceramic tiles underfoot, ornate wooden railings, and the cool interior stone.',
  },
  cultural: {
    historicalAnecdote: 'Founded in 1568, this is one of the oldest active synagogues in Asia, serving the ancient Jewish community of Cochin who arrived as traders and refugees.',
    proverb: 'Diaspora ka ghar - Home of the diaspora',
    culturalSignificance: 'Represents centuries of religious harmony and the unique Cochin Jewish identity, blending Hebrew tradition with Kerala customs.',
    festivals: ['Passover', 'Hanukkah', 'Sabbath services'],
  },
  audioClips: [audioClips['spice-market-interview']],
  weatherVariants: [
    {
      season: 'summer',
      assetId: 'synagogue-summer-cool',
      temperatureRange: [28, 35],
      humidity: 65,
      description: 'Cool interior provides refuge, golden light through windows',
    },
    {
      season: 'monsoon',
      assetId: 'synagogue-monsoon-quiet',
      temperatureRange: [24, 31],
      humidity: 80,
      description: 'Peaceful and meditative atmosphere, fewer visitors',
    },
    {
      season: 'winter',
      assetId: 'synagogue-winter-ceremonial',
      temperatureRange: [22, 29],
      humidity: 72,
      description: 'Active season with religious ceremonies and cultural events',
    },
  ],
  categories: ['living-heritage', 'spiritual'],
  culturalPulse: {
    pattern: 'geometric',
    color: '#9C27B0',
    tempo: 75,
    intensity: 45,
    description: 'Sacred and introspective, reflecting spiritual traditions and cultural preservation',
  },
  elevation: 5,
  bestVisitedDuring: 'November-March',
  accessibilityNotes: 'Accessible to all visitors, respectful dress code required',
  estimatedVisitDuration: '45 minutes-1 hour',
}

// Spice Market Destination
const spiceMarketDestination: Destination = {
  id: 'dest-spice-market',
  name: 'Fort Kochi Spice Market',
  type: 'cultural-space',
  coordinates: [76.2675, 9.9625],
  districtId: 'dist-ernakulam',
  stateId: 'state-kerala',
  sensoryDescription: {
    visual: 'Vibrant market stalls overflowing with colorful spices - turmeric yellow, cardamom green, pepper black, arranged in artful pyramids and baskets.',
    auditory: 'Constant haggling and cheerful banter of merchants, the musical calls of vendors, grinding sounds of fresh spice preparation.',
    olfactory: 'Overwhelming aromatic symphony - cardamom, clove, cinnamon, pepper, nutmeg, and mace creating layers of warm, sweet, and spicy scents.',
    gustatory: 'Opportunity to taste and sample various spices in their raw and processed forms.',
    tactile: 'Texture of seeds, powders, and dried plants; warmth from sun-exposed spice mounds.',
  },
  cultural: {
    historicalAnecdote: 'The spice market has been the commercial heart of Kerala for over 2000 years, attracting merchants from across the world seeking the riches of the East.',
    proverb: 'Masala jeevan ka ras - Spices are the essence of life',
    culturalSignificance: 'A living testimony to Kerala\'s ancient role in global trade, representing the economic and cultural importance of spices in world history.',
    festivals: ['Spice Festival', 'Trade fairs', 'Cultural celebrations'],
  },
  audioClips: [audioClips['spice-market-interview'], audioClips['backwater-ambient']],
  weatherVariants: [
    {
      season: 'summer',
      assetId: 'spice-market-summer-fragrant',
      temperatureRange: [29, 37],
      humidity: 62,
      description: 'Intense aromas intensified by heat, vibrant colors enhanced by bright light',
    },
    {
      season: 'monsoon',
      assetId: 'spice-market-monsoon-damp',
      temperatureRange: [25, 33],
      humidity: 78,
      description: 'Damp conditions preserve aromas differently, market atmosphere becomes more intimate',
    },
    {
      season: 'winter',
      assetId: 'spice-market-winter-bustling',
      temperatureRange: [23, 31],
      humidity: 68,
      description: 'Peak tourist season, vibrant energy, ideal for culinary exploration',
    },
  ],
  categories: ['culinary', 'mainstream', 'living-heritage'],
  culturalPulse: {
    pattern: 'organic',
    color: '#FFC107',
    tempo: 140,
    intensity: 85,
    description: 'Energetic and aromatic, reflecting the vibrant commerce and sensory abundance of the market',
  },
  elevation: 3,
  bestVisitedDuring: 'October-May',
  accessibilityNotes: 'Crowded narrow lanes, challenging for mobility aids',
  estimatedVisitDuration: '2-3 hours',
}

// Kerala State
const keralaState: State = {
  id: 'state-kerala',
  name: 'Kerala',
  code: 'KL',
  type: 'state',
  centroid: [76.2411, 10.8505],
  population: 33407618,
  area: 38852,
  sensoryDescription: 'God\'s Own Country awaits with emerald backwaters, spice-scented air, and the gentle rhythm of traditional life. Palm-fringed waterways blend the symphony of nature with the echoes of ancient maritime traditions.',
  cultural: {
    historicalAnecdote: 'Kerala has been a crossroads of cultures for millennia - home to ancient spice trade routes, it welcomed Jews, Christians, Arabs, and Portuguese, creating a unique syncretic civilization.',
    proverb: 'Keralam panidum swargam - Kerala is heaven on earth',
    culturalSignificance: 'Known for its high literacy rate, progressive social reforms, and unique blend of Hindu, Christian, Jewish, and Muslim communities living in harmony.',
    festivals: ['Cochin Carnival', 'Biennale', 'Ernakulathappan', 'Theyyam', 'Kathakali performances'],
  },
  primaryLanguages: ['Malayalam', 'English', 'Tamil'],
  categories: ['mainstream', 'culinary', 'living-heritage', 'spiritual'],
  districtIds: ['dist-ernakulam', 'dist-kottayam', 'dist-idukki'],
  culturalPulse: {
    pattern: 'fluid',
    color: '#00BFA5',
    tempo: 95,
    intensity: 60,
    description: 'Serene yet vibrant, reflecting the harmonious blend of nature, spirituality, and maritime heritage',
  },
  capital: 'Thiruvananthapuram',
}

/**
 * Additional placeholder states and union territories for complete coverage
 * These are minimal entries with core fields, to be expanded in future updates
 */

const otherStatesAndUTs: Record<string, State> = {
  // Other states (minimal entries)
  'state-maharashtra': {
    id: 'state-maharashtra',
    name: 'Maharashtra',
    code: 'MH',
    type: 'state',
    centroid: [75.7139, 19.7515],
    sensoryDescription: 'Dynamic and energetic, from bustling metropolises to serene hill stations.',
    cultural: {
      historicalAnecdote: 'Home to the Maratha Empire and Bollywood, Maharashtra has shaped modern India.',
      proverb: 'Khanna te pan - Betel leaf and areca nut tradition',
      culturalSignificance: 'Economic powerhouse of India with rich martial and artistic traditions.',
      festivals: ['Ganesh Chaturthi', 'Diwali'],
    },
    primaryLanguages: ['Marathi'],
    categories: ['mainstream'],
    districtIds: [],
    culturalPulse: {
      pattern: 'geometric',
      color: '#FF5722',
      tempo: 130,
      intensity: 75,
      description: 'Dynamic and entrepreneurial',
    },
    capital: 'Mumbai',
  },
  // Union Territories (minimal entries)
  'ut-delhi': {
    id: 'ut-delhi',
    name: 'Delhi',
    code: 'DL',
    type: 'union-territory',
    centroid: [77.1025, 28.7041],
    sensoryDescription: 'A city of contrasts blending ancient history with modern metropolis.',
    cultural: {
      historicalAnecdote: 'Seat of multiple empires and the capital of independent India.',
      proverb: 'Dilli ka lal - The pride of Delhi',
      culturalSignificance: 'Political and cultural heart of India with layered historical significance.',
      festivals: ['Independence Day', 'Republic Day'],
    },
    primaryLanguages: ['Hindi', 'English'],
    categories: ['mainstream'],
    districtIds: [],
    culturalPulse: {
      pattern: 'geometric',
      color: '#1976D2',
      tempo: 140,
      intensity: 80,
      description: 'Structured and authoritative',
    },
    capital: 'Delhi',
  },
}

/**
 * Complete Atlas Data Export
 */
export const atlasData: AtlasData = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  states: {
    'state-rajasthan': rajasthanState,
    'state-kerala': keralaState,
    ...otherStatesAndUTs,
  },
  districts: {
    'dist-jaipur': jaipurDistrict,
    'dist-jodhpur': {
      id: 'dist-jodhpur',
      name: 'Jodhpur',
      stateId: 'state-rajasthan',
      centroid: [73.1812, 26.2389],
      sensoryDescription: 'The blue city shimmers with indigo-colored houses under clear skies.',
      cultural: {
        historicalAnecdote: 'Built in 1459 by Rao Jodha, Jodhpur grew as a major trading post.',
        proverb: 'Nila nagri - The blue city',
        culturalSignificance: 'Famous for its distinctive blue-painted architecture.',
        festivals: ['Marwar Festival'],
      },
      categories: ['mainstream'],
      destinationIds: [],
      culturalPulse: {
        pattern: 'geometric',
        color: '#2196F3',
        tempo: 110,
        intensity: 65,
        description: 'Cool and contemplative',
      },
    },
    'dist-udaipur': {
      id: 'dist-udaipur',
      name: 'Udaipur',
      stateId: 'state-rajasthan',
      centroid: [73.6753, 24.5854],
      sensoryDescription: 'Lakeside romance with palaces reflected in shimmering waters.',
      cultural: {
        historicalAnecdote: 'Founded in 1559 by Maharaja Udai Singh II.',
        proverb: 'Rajasthan ki shahar-i-farokh - The city of eternal dawn',
        culturalSignificance: 'City of lakes and palaces, representing romantic Rajasthan.',
        festivals: ['Mewar Festival'],
      },
      categories: ['mainstream', 'hidden-gem'],
      destinationIds: [],
      culturalPulse: {
        pattern: 'fluid',
        color: '#FF1493',
        tempo: 100,
        intensity: 70,
        description: 'Romantic and ethereal',
      },
    },
    'dist-ernakulam': ernakulamDistrict,
    'dist-kottayam': {
      id: 'dist-kottayam',
      name: 'Kottayam',
      stateId: 'state-kerala',
      centroid: [76.5204, 9.6426],
      sensoryDescription: 'Verdant backwater district with tea plantations and Christian heritage.',
      cultural: {
        historicalAnecdote: 'Ancient Christian community center with historic churches.',
        proverb: 'Kottayam keralam - Heart of Kerala',
        culturalSignificance: 'Cradle of Kerala Christianity and education.',
        festivals: ['Church festivals'],
      },
      categories: ['spiritual', 'living-heritage'],
      destinationIds: [],
      culturalPulse: {
        pattern: 'organic',
        color: '#4CAF50',
        tempo: 85,
        intensity: 50,
        description: 'Serene and pastoral',
      },
    },
    'dist-idukki': {
      id: 'dist-idukki',
      name: 'Idukki',
      stateId: 'state-kerala',
      centroid: [76.8798, 10.0714],
      sensoryDescription: 'Misty mountains and spice plantations with alpine beauty.',
      cultural: {
        historicalAnecdote: 'Home to ancient spice gardens and tea estates.',
        proverb: 'Idukki ke pahad - Mountains of mystery',
        culturalSignificance: 'Gateway to high altitude Kerala tourism and agricultural heritage.',
        festivals: ['Ayyappan festivals'],
      },
      categories: ['adventure', 'culinary'],
      destinationIds: [],
      culturalPulse: {
        pattern: 'organic',
        color: '#8B4513',
        tempo: 70,
        intensity: 45,
        description: 'Contemplative and grounding',
      },
    },
  },
  destinations: {
    'dest-city-palace': cityPalaceDestination,
    'dest-hawa-mahal': hawamahalDestination,
    'dest-jantar-mantar': jantarMantarDestination,
    'dest-chinese-fishing-nets': chineseFishingNetsDestination,
    'dest-jew-synagogue': jewSynagogueDestination,
    'dest-spice-market': spiceMarketDestination,
  },
}
