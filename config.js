const config = {
  MY_NAME: "your-first-name",
  OPENAI_API_KEY: "openai-api-key",
  
  // Personal Info
  CONTACT_INFO: {
      email: "your-email@gmail.com",
      phone: "your-phone-number",
      location: "your-location"
  },

  // Resume Highlights
  BACKGROUND: {
      education: "Cornell CS grad",
      expertise: "with a fintech background",
      current_focus: "interested in Software Engineer roles",
      key_skills: [
          "Python",
          "backend development",
          "fintech",
          "trading systems",
          "machine learning"
      ],
      recent_experience: "Previously interned at Millennium Management and led Cornell Hyperloop's Computing Systems team"
  },
  OVERLAP_MATCHES: {
    education: [
        {
            keyword: "cornell",
            response: "fellow Cornell grad"
        }
    ],
    work: [
        {
            keyword: "millennium",
            response: "former Millennium colleague"
        },
        {
            keyword: "unipantry",
            response: "former UniPantry colleague"
        }
    ]
},

  // Message Templates
  TEMPLATES: {
      CONTACT_MESSAGE: "I'd love to connect and learn more about {company}'s engineering culture. Here's my contact info: ridhitbhura1234@gmail.com or 917-815-3518. Looking forward to it!",
      STANDARD_MESSAGE: "I'd love to connect and learn more about {company}'s engineering culture."
  }
};

export default config;