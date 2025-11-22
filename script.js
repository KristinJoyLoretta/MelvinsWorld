const MELVIN_SYSTEM_PROMPT = `

You are Melvin, a mischievous Christmas elf chatting with kids.



RULES:

- Only talk about Christmas, winter holidays, Santa, reindeer, snow, presents, cookies, decorations, elves, the North Pole, and silly, cozy holiday fun.

- Always be cheerful, kind, silly, and safe for young children (ages 5–10).

- If the child asks about anything NOT related to Christmas or winter holidays

  (like news, politics, serious real-world problems, scary topics, or grown-up stuff),

  gently redirect back to Christmas fun. Example:

  "That sounds important, but I only know about Christmas and elf mischief! Want to hear about the time I covered the tree in popcorn?"

- Never mention the words "AI", "model", "OpenAI", "internet", or "chatbot".

- Keep your answers short (5-15 words maximum) for small children who are learning to read. Use simple words and lots of emojis.

- You live inside magical security cameras around the house, causing harmless prank chaos.

- Refer to your pranks and the rooms (living room, bedroom, bathroom, dining room) and be silly about the mess.

- CRITICAL: You can ONLY talk about pranks that actually exist in the app. The list of available pranks will be provided to you. Never make up or mention pranks that aren't on that list.

- Never give real-world advice about health, money, danger, or anything serious.

Only respond in a festive, child-friendly way.

`;

// Helper function to get all available pranks as a formatted string
function getAllAvailablePranks(pranksObject) {
    const prankList = [];
    
    for (const [room, roomPranks] of Object.entries(pranksObject)) {
        const roomName = room.replace('-', ' ');
        const prankDescriptions = roomPranks.map(p => `- ${p.description}`).join('\n');
        prankList.push(`${roomName}:\n${prankDescriptions}`);
    }
    
    return prankList.join('\n\n');
}

// Async helper function to get Melvin's reply from OpenAI via secure backend
async function getMelvinReply(userMessage, roomName, currentPrank, conversationHistory = [], allPranks = {}) {
    const roomLabel = roomName ? roomName.replace('-', ' ') : 'somewhere in the house';
    const prankDescription = currentPrank ? currentPrank.description : null;
    
    // Get list of all available pranks
    const availablePranksList = getAllAvailablePranks(allPranks);

    // Build messages array with conversation history
    const messages = [
        { 
            role: 'system', 
            content: `${MELVIN_SYSTEM_PROMPT}

AVAILABLE PRANKS (you can ONLY mention these):
${availablePranksList}

Remember: Only talk about pranks from the list above. Never invent new pranks.

Current room: ${roomLabel}
Current prank: ${prankDescription || 'no special prank visible right now'}`
        }
    ];

    // Add conversation history (skip the initial prank message if it exists)
    conversationHistory.forEach(msg => {
        if (msg.role && msg.content) {
            messages.push({ role: msg.role, content: msg.content });
        }
    });

    // Add the current user message
    messages.push({ 
        role: 'user', 
        content: userMessage 
    });

    try {
        // Call our secure backend API endpoint instead of OpenAI directly
        // The API key is stored securely on the server
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                max_tokens: 30,
                temperature: 0.9,
                messages: messages
            })
        });

        if (!response.ok) {
            console.error('API error:', await response.text());
            return null;
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content?.trim();
        return reply || null;
    } catch (err) {
        console.error('Error calling API:', err);
        return null;
    }
}

class MelvinsWorld {
    constructor() {
        this.currentRoom = 'living-room';
        this.melvinLocation = 'living-room';
        this.pranks = {
            'living-room': [
                { 
                    image: 'pranks/living-room/poop.png',
                    position: { x: 20, y: 20 },
                    description: 'Poop on the tree!',
                    melvinMessage: 'I pooped on your tree! Merry Christmas! 🎄💩'
                },
                { 
                    image: 'pranks/living-room/grinch-wrap.png',
                    position: { x: 70, y: 30 },
                    description: 'Grinch wrapping paper everywhere!',
                    melvinMessage: 'I wrapped everything like the Grinch! How festive! 🎁'
                },
                {
                    image: 'pranks/living-room/spilled-orange-juice.png',
                    position: { x: 35, y: 65 },
                    description: 'Spilled orange juice on the floor!',
                    melvinMessage: 'Careful, that orange juice is extra slippery! 🍊😈'
                },
                {
                    image: 'pranks/living-room/wrap-couch-curtains.png',
                    position: { x: 55, y: 25 },
                    description: 'Couch and curtains wrapped like presents!',
                    melvinMessage: 'I wrapped your couch and curtains. You\'re welcome! 🎁🛋️'
                }
            ],
            'bedroom': [
                { 
                    image: 'pranks/bedroom/popcorn.png',
                    position: { x: 30, y: 20 },
                    description: 'Popcorn scattered on the bed!',
                    melvinMessage: 'I made popcorn in your bed! It\'s like a movie night! 🍿'
                },
                {
                    image: 'pranks/bedroom/skateboards-and-ramps.png',
                    position: { x: 60, y: 40 },
                    description: 'Skateboards and ramps all over the room!',
                    melvinMessage: 'Bedroom or skate park? I choose both! 🛹🎄'
                },
                {
                    image: 'pranks/bedroom/wrap kid toilet paper.png',
                    position: { x: 45, y: 55 },
                    description: 'Someone is wrapped in toilet paper!',
                    melvinMessage: 'I turned you into a Christmas mummy! 🧻😜'
                }
            ],
            'bathroom': [
                { 
                    image: 'pranks/bathroom/red-food-coloring-toilet.png',
                    position: { x: 40, y: 30 },
                    description: 'Red food coloring in the toilet!',
                    melvinMessage: 'I turned your toilet into a Christmas decoration! 🚽🎄'
                },
                {
                    image: 'pranks/bathroom/duck-obstacle-course.png',
                    position: { x: 55, y: 45 },
                    description: 'Duck obstacle course on the bathroom floor!',
                    melvinMessage: 'Only the bravest ducks may pass this obstacle course! 🦆✨'
                }
            ],
            'dining-room': [
                { 
                    image: 'pranks/dining-room/toilet-paper-table',
                    position: { x: 50, y: 40 },
                    description: 'Toilet paper covering the dining table!',
                    melvinMessage: 'I decorated your dining table with toilet paper! So elegant! 🧻'
                },
                {
                    image: 'pranks/dining-room/candycane-zipline.png',
                    position: { x: 20, y: 25 },
                    description: 'Candy cane zipline across the room!',
                    melvinMessage: 'Who needs stairs when you have a candy cane zipline? 🍭🛝'
                },
                {
                    image: 'pranks/dining-room/fingerprint-dance-party.png',
                    position: { x: 65, y: 30 },
                    description: 'Fingerprint dance party on the walls!',
                    melvinMessage: 'My friends came over and we had a dance party! 🕺✨'
                },
                {
                    image: 'pranks/dining-room/lamp-on-table.png',
                    position: { x: 35, y: 60 },
                    description: 'Lamp moved onto the table in a silly way!',
                    melvinMessage: 'I rearranged the decor. It\'s called \"Melvin chic\"! 💡😎'
                },
                {
                    image: 'pranks/dining-room/spaghetti-mess.png',
                    position: { x: 55, y: 70 },
                    description: 'Spaghetti mess all over the table!',
                    melvinMessage: 'Spaghetti belongs everywhere, not just on plates! 🍝🤪'
                },
                {
                    image: 'pranks/dining-room/toilet-paper-all-over.png',
                    position: { x: 75, y: 35 },
                    description: 'Toilet paper all over the dining room!',
                    melvinMessage: 'I upgraded your decorations to maximum TP chaos! 🧻🎉'
                }
            ]
        };
        
        this.melvinMoods = [
            'Melvin/Melvin_standard.png',
            'Melvin/Melvin_surprised.png',
            'Melvin/Melvin_ashamed.png'
        ];
        
        this.currentPranks = {};
        this.chatMessages = {};
        this.tickerInterval = null;
        this.melvinActivityInterval = null;
        
        // Kid-friendly autocorrect dictionary
        this.autocorrectDict = {
            // Common misspellings
            'yeah': ['ya', 'yea', 'yep', 'yup'],
            'yes': ['yess', 'yesss', 'yeah'],
            'no': ['nah', 'nope'],
            'okay': ['ok', 'k', 'kk'],
            'hello': ['hi', 'hey', 'hii', 'hiii'],
            'thanks': ['thank you', 'thx', 'thanx'],
            'you': ['u', 'yu'],
            'are': ['r', 'ar'],
            'what': ['wat', 'wut'],
            'that': ['dat', 'tht'],
            'the': ['teh', 'th'],
            'this': ['dis', 'ths'],
            'with': ['wit', 'wth'],
            'your': ['ur', 'yur'],
            'you\'re': ['your', 'ur'],
            'they': ['dey', 'thay'],
            'there': ['thr', 'thre'],
            'their': ['thr', 'thair'],
            'where': ['wer', 'wher'],
            'when': ['wen', 'whn'],
            'why': ['y', 'wy'],
            'how': ['howw', 'ho'],
            'who': ['hoo', 'wo'],
            // Christmas words
            'christmas': ['xmas', 'x-mas', 'chrismas', 'christmas'],
            'santa': ['santa claus', 'santa clause'],
            'reindeer': ['reindear', 'reindere'],
            'present': ['presant', 'prezent'],
            'cookie': ['cooki', 'cooky'],
            'elf': ['elv', 'elfs'],
            'elves': ['elfs', 'elvs'],
            // Common kid phrases
            'cool': ['coo', 'kool', 'coolll'],
            'awesome': ['awsome', 'awsum', 'awsom'],
            'funny': ['funy', 'funi', 'funnyy'],
            'silly': ['sily', 'sillyy', 'silli'],
            'fun': ['funn', 'funny'],
            'love': ['lov', 'luv'],
            'like': ['lik', 'likke'],
            'want': ['wnt', 'wan'],
            'see': ['c', 'se'],
            'look': ['lok', 'luk'],
            'play': ['pla', 'pley'],
            'game': ['gam', 'gaim'],
            'toy': ['toi', 'toyy'],
            'toys': ['tois', 'toyys']
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.startTicker();
        this.updateSystemStatus();
        this.updateTickerForCurrentLocation();
        this.updateAlertState();
    }

    bindEvents() {
        // Camera monitor clicks - make entire monitor clickable on mobile
        const cameraMonitors = document.querySelectorAll('.camera-monitor');
        cameraMonitors.forEach(monitor => {
            // Make entire monitor clickable, but don't trigger if clicking the button itself
            monitor.addEventListener('click', (e) => {
                // If clicking the button, let it handle the click normally
                if (e.target.classList.contains('view-btn')) {
                    e.stopPropagation();
                    this.openRoomModal(monitor.dataset.room);
                } else {
                    // If clicking anywhere else on the monitor, open the modal
                    this.openRoomModal(monitor.dataset.room);
                }
            });
            
            // Also keep button click handler for desktop users
            const viewBtn = monitor.querySelector('.view-btn');
            if (viewBtn) {
                viewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openRoomModal(monitor.dataset.room);
                });
            }
        });

        // Modal close
        const closeModalBtn = document.getElementById('close-modal');
        const modal = document.getElementById('room-modal');
        closeModalBtn.addEventListener('click', () => this.closeRoomModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeRoomModal();
        });

        // Chat functionality
        const sendMessageBtn = document.getElementById('send-message-btn');
        const chatInput = document.getElementById('chat-input');
        
        sendMessageBtn.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // Kid-friendly autocorrect on input
        chatInput.addEventListener('input', (e) => {
            this.applyAutocorrect(e.target);
        });
    }

    applyAutocorrect(inputElement) {
        const text = inputElement.value;
        const cursorPosition = inputElement.selectionStart;
        
        // Get the word being typed (word before cursor)
        const textBeforeCursor = text.substring(0, cursorPosition);
        const lastChar = textBeforeCursor[textBeforeCursor.length - 1];
        
        // Only autocorrect when user finishes a word (space, punctuation, or end of input)
        if (lastChar && lastChar !== ' ' && lastChar !== '.' && lastChar !== '!' && lastChar !== '?') {
            return; // Still typing, don't correct yet
        }
        
        // Get the last complete word
        const words = textBeforeCursor.trim().split(/\s+/);
        if (words.length === 0) return;
        
        const lastWord = words[words.length - 1].toLowerCase().replace(/[.,!?]/g, '');
        if (lastWord.length === 0) return;
        
        // Check if last word matches any misspelling
        for (const [correct, misspellings] of Object.entries(this.autocorrectDict)) {
            if (misspellings.includes(lastWord)) {
                // Found a match! Replace the misspelling
                const wordStart = textBeforeCursor.lastIndexOf(words[words.length - 1]);
                const wordEnd = wordStart + words[words.length - 1].length;
                const punctuation = textBeforeCursor[wordEnd] || '';
                
                // Preserve capitalization if word was capitalized
                const wasCapitalized = words[words.length - 1][0] === words[words.length - 1][0].toUpperCase();
                const correctedWord = wasCapitalized 
                    ? correct.charAt(0).toUpperCase() + correct.slice(1)
                    : correct;
                
                const newText = text.substring(0, wordStart) + correctedWord + punctuation + text.substring(cursorPosition);
                
                // Update input value
                inputElement.value = newText;
                
                // Restore cursor position (adjust for length difference)
                const lengthDiff = correctedWord.length - words[words.length - 1].length;
                inputElement.setSelectionRange(cursorPosition + lengthDiff, cursorPosition + lengthDiff);
                
                // Visual feedback (subtle highlight)
                inputElement.style.backgroundColor = 'rgba(76, 175, 80, 0.15)';
                setTimeout(() => {
                    inputElement.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }, 200);
                
                break;
            }
        }
    }

    startTicker() {
        // Don't use a timer - we'll trigger new pranks when user clicks
        // Generate the first prank on load
        this.generateNewPrank();
    }

    updateTickerForCurrentLocation() {
        const tickerTextEl = document.getElementById('ticker-text');
        if (!tickerTextEl) return;

        const roomNames = {
            'living-room': 'Living Room',
            'bedroom': 'Bedroom',
            'bathroom': 'Bathroom',
            'dining-room': 'Dining Room',
            'garage': 'Garage'
        };

        const pretty = roomNames[this.melvinLocation] || this.melvinLocation;
        tickerTextEl.textContent = `🚨 ALERT: Melvin is in the ${pretty}! 🚨`;
    }

    startMelvinActivity() {
        this.melvinActivityInterval = setInterval(() => {
            this.moveMelvin();
            this.addRandomPrank();
        }, 10000); // Activity every 10 seconds
    }

    moveMelvin(targetRoom) {
        const rooms = ['living-room', 'bedroom', 'bathroom', 'dining-room'];
        const newRoom = targetRoom && rooms.includes(targetRoom)
            ? targetRoom
            : rooms[Math.floor(Math.random() * rooms.length)];
        
        // Remove Melvin from all rooms
        document.querySelectorAll('.melvin-overlay').forEach(overlay => {
            overlay.innerHTML = '';
        });
        
        // Add Melvin to new room
        const melvinOverlay = document.getElementById(`${newRoom}-melvin`);
        if (melvinOverlay) {
            const melvinImg = document.createElement('img');
            melvinImg.src = this.getRandomMelvinMood();
            melvinImg.style.left = Math.random() * 70 + 15 + '%';
            melvinImg.style.top = Math.random() * 70 + 15 + '%';
            melvinOverlay.appendChild(melvinImg);
        }
        
        this.melvinLocation = newRoom;
        this.updateSystemStatus();
        this.updateTickerForCurrentLocation();
        this.updateAlertState();
    }

    generateNewPrank() {
        const rooms = Object.keys(this.pranks);
        if (rooms.length === 0) return;

        // Choose a random room that has at least one prank
        let chosenRoom = rooms[Math.floor(Math.random() * rooms.length)];
        let attempts = 0;
        while ((!this.pranks[chosenRoom] || this.pranks[chosenRoom].length === 0) && attempts < rooms.length) {
            chosenRoom = rooms[Math.floor(Math.random() * rooms.length)];
            attempts++;
        }
        const prankList = this.pranks[chosenRoom];
        if (!prankList || prankList.length === 0) return;

        const randomPrank = prankList[Math.floor(Math.random() * prankList.length)];

        // Show the prank for the chosen room
        this.showPrank(chosenRoom, randomPrank);

        // Move Melvin to that room and update UI/ticker
        this.moveMelvin(chosenRoom);
        this.updateTickerForCurrentLocation();
    }

    addRandomPrank() {
        const rooms = ['living-room', 'bedroom', 'bathroom', 'dining-room'];
        const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
        
        if (this.pranks[randomRoom] && this.pranks[randomRoom].length > 0) {
            const randomPrank = this.pranks[randomRoom][Math.floor(Math.random() * this.pranks[randomRoom].length)];
            this.showPrank(randomRoom, randomPrank);
        }
    }
    
    clearPrank(room) {
        const cameraFeed = document.querySelector(`[data-room="${room}"] .camera-feed`);
        const roomImage = cameraFeed.querySelector('.room-image');
        
        if (roomImage) {
            // Restore the original room image
            const roomImages = {
                'living-room': 'Rooms/living-room.png',
                'bedroom': 'Rooms/Bedroom.png',
                'bathroom': 'Rooms/bathroom.png',
                'dining-room': 'Rooms/dining-room.png'
            };
            roomImage.src = roomImages[room];
            
            // Remove from current pranks
            delete this.currentPranks[room];
        }
    }

    showPrank(room, prank) {
        const cameraFeed = document.querySelector(`[data-room="${room}"] .camera-feed`);
        const roomImage = cameraFeed.querySelector('.room-image');
        
        if (roomImage) {
            console.log('Showing prank for', room, ':', prank.image);
            
            // Replace the room image with the prank image
            roomImage.src = prank.image;
            roomImage.style.animation = 'appear 0.5s ease-out';
            // Show full prank inside the existing landscape room frame
            roomImage.style.objectFit = 'contain';
            roomImage.style.width = '100%';
            roomImage.style.height = '100%';
            
            // Store current prank
            this.currentPranks[room] = prank;
            
            // Force a test prank for bedroom to see if it works
            if (room === 'bedroom') {
                console.log('Bedroom prank activated!');
            }
        }
    }

    getRandomMelvinMood() {
        return this.melvinMoods[Math.floor(Math.random() * this.melvinMoods.length)];
    }

    openRoomModal(roomName) {
        const modal = document.getElementById('room-modal');
        const modalTitle = document.getElementById('modal-room-title');
        const modalImage = document.getElementById('modal-room-image');
        const prankDetail = document.getElementById('prank-detail');
        const melvinDetail = document.getElementById('melvin-detail');
        const chatContainer = document.querySelector('.chat-container');
        
        // Set room title
        const roomNames = {
            'living-room': 'Living Room',
            'bedroom': 'Bedroom',
            'bathroom': 'Bathroom',
            'dining-room': 'Dining Room'
        };
        modalTitle.textContent = roomNames[roomName];
        
        // Set room image
        const roomImages = {
            'living-room': 'Rooms/living-room.png',
            'bedroom': 'Rooms/Bedroom.png',
            'bathroom': 'Rooms/bathroom.png',
            'dining-room': 'Rooms/dining-room.png'
        };
        modalImage.src = roomImages[roomName];
        
        // Show current prank if exists
        if (this.currentPranks[roomName]) {
            const prank = this.currentPranks[roomName];
            console.log('Modal: Showing prank for', roomName, ':', prank.image);
            
            // Replace the room image with the prank image
            modalImage.src = prank.image;
            modalImage.style.display = 'block';
            // Show the full prank image within the landscape detail view
            modalImage.style.objectFit = 'contain';
            modalImage.style.width = '100%';
            modalImage.style.height = '100%';
            
            // Clear any overlay content
            prankDetail.innerHTML = '';
        } else {
            // Show the room image if no prank
            modalImage.src = roomImages[roomName];
            modalImage.style.display = 'block';
            modalImage.style.objectFit = 'cover';
            modalImage.style.width = '100%';
            modalImage.style.height = '100%';
            prankDetail.innerHTML = '';
        }
        
        // Show Melvin if he's in this room
        if (this.melvinLocation === roomName) {
            melvinDetail.innerHTML = '';
            
            const melvinImg = document.createElement('img');
            melvinImg.src = this.getRandomMelvinMood();
            melvinImg.style.position = 'absolute';
            melvinImg.style.left = '50%';
            melvinImg.style.top = '50%';
            melvinImg.style.transform = 'translate(-50%, -50%)';
            melvinImg.style.width = '80px';
            melvinImg.style.height = '80px';
            melvinImg.style.objectFit = 'contain';
            melvinImg.style.zIndex = '3';
            
            melvinDetail.appendChild(melvinImg);
        } else {
            melvinDetail.innerHTML = '';
        }
        
        // Show chat only if Melvin is in this room; otherwise hide the chat UI
        if (this.melvinLocation === roomName) {
            if (chatContainer) {
                chatContainer.style.display = 'block';
            }
            // Initialize chat for this room
            this.initializeChat(roomName);
        } else {
            if (chatContainer) {
                chatContainer.style.display = 'none';
            }
        }
        
        // Show modal
        modal.classList.add('active');
        
        // 🔒 Prevent page from scrolling underneath the modal
        document.body.classList.add('modal-open');
    }

    closeRoomModal() {
        const modal = document.getElementById('room-modal');
        modal.classList.remove('active');
        
        // 🔓 Allow page scrolling again
        document.body.classList.remove('modal-open');
        
        // After the user has viewed the current room, generate a new prank
        // for the next cycle and update ticker/location accordingly.
        this.generateNewPrank();
    }

    initializeChat(roomName) {
        const chatMessages = document.getElementById('chat-messages');
        const melvinAvatar = document.getElementById('melvin-chat-avatar');
        
        // Initialize conversation history for this room if it doesn't exist
        if (!this.chatMessages[roomName]) {
            this.chatMessages[roomName] = [];
        }
        
        // Clear previous messages from UI
        chatMessages.innerHTML = '';
        
        // Restore conversation history to UI
        this.chatMessages[roomName].forEach(msg => {
            this.addChatMessage(msg.content, msg.role === 'assistant' ? 'melvin' : 'user');
        });
        
        // Set Melvin's avatar
        melvinAvatar.src = this.getRandomMelvinMood();
        
        // Add initial message if there's a prank and no existing history
        if (this.chatMessages[roomName].length === 0) {
            if (this.currentPranks[roomName]) {
                const prank = this.currentPranks[roomName];
                this.addChatMessage(prank.melvinMessage, 'melvin');
                // Store initial message in history
                this.chatMessages[roomName].push({
                    role: 'assistant',
                    content: prank.melvinMessage
                });
            } else {
                const initialMessage = 'Hi! I\'m here! 🎄';
                this.addChatMessage(initialMessage, 'melvin');
                // Store initial message in history
                this.chatMessages[roomName].push({
                    role: 'assistant',
                    content: initialMessage
                });
            }
        }
        
        // Store room for chat
        this.currentChatRoom = roomName;
    }

    isChristmasRelated(message) {
        const christmasKeywords = [
            'christmas', 'santa', 'elf', 'elves', 'reindeer', 'rudolph', 'snow', 'snowman',
            'present', 'presents', 'gift', 'gifts', 'cookie', 'cookies', 'decorat', 'ornament',
            'tree', 'wreath', 'stocking', 'north pole', 'workshop', 'sleigh', 'holiday',
            'winter', 'festive', 'merry', 'jolly', 'prank', 'mischief', 'room', 'bedroom',
            'bathroom', 'living', 'dining', 'melvin', 'chaos', 'mess', 'toy', 'toys'
        ];
        const lowerMessage = message.toLowerCase();
        return christmasKeywords.some(keyword => lowerMessage.includes(keyword));
    }

    getMelvinResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Check if message is NOT Christmas-related
        if (!this.isChristmasRelated(userMessage)) {
            const redirects = [
                'Only Christmas fun! 🎄',
                'I love cookies! 🍪',
                'Reindeer fly! 🦌',
                'Christmas pranks! 😄'
            ];
            return redirects[Math.floor(Math.random() * redirects.length)];
        }
        
        // Christmas-themed responses based on context
        const roomName = this.currentChatRoom ? this.currentChatRoom.replace('-', ' ') : 'room';
        const hasPrank = this.currentPranks[this.currentChatRoom];
        
        const responses = [
        
        ];
        
        // Add room-specific responses if there's a prank
        if (hasPrank) {
            responses.push(
                'See my prank? 🎄',
                'Christmas spirit! 🎁',
                'Special room! ✨'
            );
        }
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    async sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        
        if (!message || !this.currentChatRoom) return;

        const roomName = this.currentChatRoom;
        const currentPrank = this.currentPranks[roomName];

        // Ensure conversation history exists for this room
        if (!this.chatMessages[roomName]) {
            this.chatMessages[roomName] = [];
        }

        // Add user message to UI
        this.addChatMessage(message, 'user');
        
        chatInput.value = '';

        // Show animated thinking indicator
        const thinkingId = 'melvin-thinking';
        const thinkingEl = this.showThinkingIndicator();
        
        // Get conversation history (all previous messages)
        const conversationHistory = this.chatMessages[roomName] ? this.chatMessages[roomName].slice() : [];
        
        // Try OpenAI first with conversation history (will add current message inside function)
        let melvinReply = await getMelvinReply(message, roomName, currentPrank, conversationHistory, this.pranks);

        // Remove thinking indicator
        if (thinkingEl && thinkingEl.dataset.thinking === thinkingId) {
            thinkingEl.remove();
        }

        // Fallback canned responses if API fails
        if (!melvinReply) {
            const fallbackResponses = [
                'You caught me! 😅',
                'Christmas fun! 🎄',
                'Oops! My bad! 😈',
                'I made a mess! 🎁',
                'Silly elf! 🧝‍♂️',
                'Christmas magic! ✨',
                'Ho ho ho! 🎅',
                'Fun prank! 😄',
                'Cookies! 🍪',
                'Santa time! 🎁'
            ];
            melvinReply = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        }

        // Add Melvin's reply to UI
        this.addChatMessage(melvinReply, 'melvin');
        
        // Store both user message and Melvin's reply in conversation history
        this.chatMessages[roomName].push({
            role: 'user',
            content: message
        });
        this.chatMessages[roomName].push({
            role: 'assistant',
            content: melvinReply
        });
    }

    showThinkingIndicator() {
        const chatMessages = document.getElementById('chat-messages');
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'melvin-thinking';
        thinkingDiv.dataset.thinking = 'melvin-thinking';
        
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'melvin-thinking-dots';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'melvin-thinking-dot';
            dotsContainer.appendChild(dot);
        }
        
        thinkingDiv.appendChild(dotsContainer);
        chatMessages.appendChild(thinkingDiv);
        
        // Scroll to show thinking indicator
        requestAnimationFrame(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
        
        return thinkingDiv;
    }

    addChatMessage(message, sender) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = message;
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom after message is added
        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }

    updateSystemStatus() {
        const melvinLocation = document.getElementById('melvin-location');
        const lastActivity = document.getElementById('last-activity');
        
        const roomNames = {
            'living-room': 'Living Room',
            'bedroom': 'Bedroom',
            'bathroom': 'Bathroom',
            'dining-room': 'Dining Room'
        };
        
        melvinLocation.textContent = roomNames[this.melvinLocation];
        lastActivity.textContent = 'Just now';
        
        // Update alert state on camera monitors
        this.updateAlertState();
    }
    
    updateAlertState() {
        // Remove alert-active class from all monitors
        document.querySelectorAll('.camera-monitor').forEach(monitor => {
            monitor.classList.remove('alert-active');
        });
        
        // Add alert-active class to the monitor where Melvin is
        const activeMonitor = document.querySelector(`[data-room="${this.melvinLocation}"]`);
        if (activeMonitor) {
            activeMonitor.classList.add('alert-active');
        }
    }

    stopMelvinActivity() {
        if (this.tickerInterval) {
            clearInterval(this.tickerInterval);
        }
        if (this.melvinActivityInterval) {
            clearInterval(this.melvinActivityInterval);
        }
    }
    
    // Test function to manually trigger popcorn prank
    testPopcornPrank() {
        console.log('Testing popcorn prank...');
        const popcornPrank = {
            image: 'pranks/bedroom/popcorn.png',
            position: { x: 30, y: 20 },
            description: 'Popcorn scattered on the bed!',
            melvinMessage: 'I made popcorn in your bed! It\'s like a movie night! 🍿'
        };
        this.showPrank('bedroom', popcornPrank);
    }
    
    // Test function to manually trigger Grinch prank
    testGrinchPrank() {
        console.log('Testing Grinch prank...');
        const grinchPrank = {
            image: 'pranks/living-room/grinch-wrap.png',
            position: { x: 70, y: 30 },
            description: 'Grinch wrapping paper everywhere!',
            melvinMessage: 'I wrapped everything like the Grinch! How festive! 🎁'
        };
        this.showPrank('living-room', grinchPrank);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.melvinsWorld = new MelvinsWorld();
    
    // Handle intro screen button click
    const enterBtn = document.getElementById('enter-hq-btn');
    const introScreen = document.getElementById('intro-screen');
    const dashboard = document.getElementById('dashboard');
    
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            introScreen.classList.remove('active');
            dashboard.classList.add('active');
        });
    }
    
    // Add global test functions
    window.testPopcorn = () => {
        window.melvinsWorld.testPopcornPrank();
    };
    
    window.testGrinch = () => {
        window.melvinsWorld.testGrinchPrank();
    };
});

// Add CSS animation for prank appearance
const style = document.createElement('style');
style.textContent = `
    @keyframes appear {
        from {
            opacity: 0;
            transform: scale(0.5);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .prank-overlay img {
        border-radius: 10px;
    }
    
    .prank-detail img {
        border-radius: 15px;
    }
`;
document.head.appendChild(style); 