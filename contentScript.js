let profileData = {};

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === "getProfileData") {
            // First verify we're on a profile page
            if (!isLinkedInProfilePage()) {
                console.log('Not on a LinkedIn profile page or page not fully loaded');
                sendResponse({ error: "Please make sure you're on a LinkedIn profile page" });
                return true;
            }

            try {
                profileData = extractProfileData();
                console.log('Fresh profile data extracted:', profileData);
                
                // Verify we got at least some data
                if (!profileData.name && !profileData.company) {
                    console.log('No profile data found, page might be still loading');
                    sendResponse({ error: "Please wait for the page to fully load" });
                    return true;
                }
                
                sendResponse(profileData);
            } catch (error) {
                console.error('Error extracting profile data:', error);
                sendResponse({ error: "Error extracting profile data. Please try again." });
            }
        } else if (request.action === "injectMessage") {
            const noteField = document.querySelector('textarea[name="message"]');
            if (noteField) {
                noteField.value = request.message;
                noteField.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
        return true;
    }
);

function isLinkedInProfilePage() {
    // Multiple checks to verify we're on a profile page
    const urlCheck = window.location.href.includes('/in/');
    const profileCheck = document.querySelector('.pv-top-card') || 
                        document.querySelector('.profile-background-image') ||
                        document.querySelector('.pv-text-details__left-panel');
    const loadCheck = document.readyState === 'complete';

    console.log('URL check:', urlCheck);
    console.log('Profile element check:', !!profileCheck);
    console.log('Page load check:', loadCheck);

    return urlCheck && profileCheck && loadCheck;
}

function extractProfileData() {
    // Name extraction (keeping the working version)
    const nameElement = document?.querySelector('div.pv-text-details__left-panel > div > h1') || 
                       document?.getElementsByClassName('artdeco-entity-lockup__title ember-view')[0] || 
                       null;
    const name = nameElement?.textContent || "[Name not found]";

    // Updated company selectors with more specific targeting
    const companySelectors = [
        // Current position in Experience section
        'section.experience-section li:first-child h3.t-16',
        'section.experiences-section li:first-child h3',
        // Experience section modern layout
        '#experience ~ .pvs-list__outer-container .pvs-entity:first-child .pvs-entity__path-node',
        '#experience ~ .pvs-list__outer-container .pvs-entity:first-child .t-bold span[aria-hidden="true"]',
        // Top card section
        '.pv-text-details__right-panel div.inline-show-more-text',
        '.pv-text-details__right-panel .text-body-small',
        // Additional fallbacks
        '.pv-top-card-section__experience-item',
        '.pv-entity__company-details',
        '.experience-group-header__company',
        // Try direct text content
        '.pv-text-details__right-panel span:not(.visually-hidden)'
    ];

    // Enhanced company finding function
    const findCompany = () => {
        // First try the direct selectors
        for (const selector of companySelectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                const text = element.textContent.trim();
                if (text && text.length > 1) {  // Basic validation
                    console.log('Found company with selector:', selector);
                    return text;
                }
            }
        }

        // Fallback: Try to get from experience section
        const experienceSection = document.getElementById('experience');
        if (experienceSection) {
            // Try multiple approaches to find company name
            const possibleElements = [
                ...experienceSection.querySelectorAll('.pvs-entity__path-node'),
                ...experienceSection.querySelectorAll('.pv-entity__secondary-title'),
                ...experienceSection.querySelectorAll('.t-bold span[aria-hidden="true"]'),
                ...experienceSection.querySelectorAll('.pv-entity__company-summary-info h3'),
            ];

            for (const element of possibleElements) {
                const text = element?.textContent?.trim();
                if (text && text.length > 1) {
                    console.log('Found company in experience section:', text);
                    return text;
                }
            }
        }

        // Additional fallback: Try to find any element with "Company" label
        const companyLabels = document.querySelectorAll('[aria-label*="Company"], [aria-label*="company"]');
        for (const label of companyLabels) {
            const text = label?.textContent?.trim();
            if (text && text.length > 1) {
                console.log('Found company via aria-label:', text);
                return text;
            }
        }

        return null;
    };

    // Debug: Log page structure
    console.log('Attempting to extract profile data...');

    const company = getCleanText(findCompany()) || '[Company not found]';

    // Debug: Log found elements
    console.log('Name element:', nameElement);
    console.log('Company found:', company);

    return { 
        name: getCleanText(name), 
        company 
    };
}

function getCleanText(text) {
    if (!text) return '';
    return text
        .replace(/\s+/g, ' ')
        .replace(/[\r\n\t]/g, '')
        .replace('...', '')
        .replace('See more', '')
        .replace('See less', '')
        .trim();
}