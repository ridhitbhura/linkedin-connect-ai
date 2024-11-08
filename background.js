import config from './config.js';

// Listen for extension installation or update
chrome.runtime.onInstalled.addListener(() => {
  console.log('LinkedIn Outreach AI Helper Installed');
});

function getFirstName(fullName) {
    // Remove any extra spaces and split by space
    const names = fullName.trim().split(' ');
    // Get first name and clean it
    const firstName = names[0].replace(/[^a-zA-Z]/g, '');
    return firstName;
}

function generatePrompt(profileData) {
    if (!config) {
        throw new Error('Config not loaded');
    }

    const firstName = getFirstName(profileData.name);
    
    console.log('Checking overlap data:', profileData.overlap);
    
    let introduction = '';
    
    if (profileData.overlap) {
        const overlap = profileData.overlap.toLowerCase();
        console.log('Processing overlap:', overlap);
        
        // Check education overlaps
        const educationMatch = config.OVERLAP_MATCHES.education.find(
            match => overlap.includes(match.keyword)
        );
        
        // Check work overlaps
        const workMatch = config.OVERLAP_MATCHES.work.find(
            match => overlap.includes(match.keyword)
        );
        if (educationMatch) {
            console.log('Education overlap found:', educationMatch.keyword);
            introduction = `Hi ${firstName}, I'm ${config.MY_NAME}, a ${educationMatch.response}`;
        } 
        else if (workMatch) {
            console.log('Work overlap found:', workMatch.keyword);
            introduction = `Hi ${firstName}, I'm ${config.MY_NAME}, a ${workMatch.response}`;
        }
        else {
            console.log('Using generic overlap:', overlap);
            introduction = `Hi ${firstName}, I'm ${config.MY_NAME}. I noticed we both ${profileData.overlap}`;
        }
    } else {
        console.log('No overlap found, using default introduction');
        const backgroundInfo = `${config.BACKGROUND.expertise} and interested in the ${profileData.role} role at ${profileData.company}`;
        introduction = `Hi ${firstName}, I'm ${config.MY_NAME}, a ${config.BACKGROUND.education} ${backgroundInfo}`;
    }

    // Replace the template placeholder with the actual company name
    const outroTemplate = config.TEMPLATES.CONTACT_MESSAGE.replace('{company}', profileData.company);

    const prompt = `Write a concise LinkedIn connection message using exactly this format:
        "${introduction}. ${outroTemplate}"
        
        Rules:
        - Keep it under 300 characters
        - No repetition of company or role mentions
        - One fluid sentence
        - No additional greetings or closings
        - Must include the exact contact information as provided
        - Keep it professional yet friendly`;

    console.log('Final introduction used:', introduction);
    console.log('Generated prompt:', prompt);
    return prompt;
}

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'generateMessage') {
        const profileData = request.profileData;
        
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: generatePrompt(profileData)
                }],
                temperature: 0.7,
                max_tokens: 150
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                sendResponse({error: data.error.message});
            } else {
                sendResponse({message: data.choices[0].message.content.trim()});
            }
        })
        .catch(error => {
            console.error('Error:', error);
            sendResponse({error: 'Failed to generate message'});
        });

        return true;
    }
});
