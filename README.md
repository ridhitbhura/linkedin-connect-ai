# LinkedIn Connect AI

A Chrome extension that creates personalized LinkedIn connection requests using AI, designed to improve your networking and job search effectiveness.

## Demo
https://www.loom.com/share/e7a2e5833319434f9c77c02a64d32245?sid=bb3c35fb-ec87-437f-91e2-2ebf328b205c

## Why This Extension?

LinkedIn's default connection note feature is limited and generic, often leading to low acceptance rates. This extension solves several key problems:

- **Context-Aware**: Unlike LinkedIn's basic feature, this extension analyzes profile information to create relevant, personalized messages
- **Customizable**: Tailor messages based on your background, education overlaps, and specific roles
- **Professional**: Generate messages that highlight meaningful connections and shared interests
- **Optimized**: Messages are crafted to fit LinkedIn's character limit while maintaining impact

Perfect for:

- Job seekers reaching out to hiring managers and recruiters
- Professionals building industry networks
- Anyone looking to make meaningful LinkedIn connections

## Setup Instructions

1. **Clone the Repository**

```bash
git clone https://github.com/ridhitbhura/linkedin-connect-ai
cd linkedin-connect-ai
```

2. **Configure API Keys**

- Modify the `config.js` file to include your name, OpenAI API key, and other relevant information.
- [Refer here for API keys](https://platform.openai.com/api-keys) - You need to load your account with credits before using your API key successfully. 

```
javascript
const config = {
  MY_NAME: "your-first-name",
  OPENAI_API_KEY: "your-openai-api-key",
  ...
};
```

3. **Setup .gitignore**

- Create a `.gitignore` file in the root directory
- Add the following line to ignore the config file:

```
config.js
```

4. **Load the Extension in Chrome**

- Open Chrome and go to `chrome://extensions/`
- Enable "Developer mode" in the top right
- Click "Load unpacked" and select the extension directory to test
- You can also load the extension as a packaged app by clicking "Packaged App" and selecting the extension directory

5. **Usage**

- Pin the extension to your toolbar for easy access
- Navigate to any LinkedIn profile
- Click the extension icon
- Use "Autofill" to populate profile information
- Click "Generate Message" to create a personalized connection note
- Copy using the "Copy" button and send with your connection request with LinkedIn's add note feature

## Features

- AI-powered message generation
- Profile data auto-extraction
- Education and work experience overlap detection
- Message history tracking
- Character count validation
- One-click message copying

## Security Note

Make sure to keep your `config.js` file private and never commit it to version control. It contains sensitive API keys and personal information.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.
