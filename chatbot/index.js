require('dotenv').config();
   const express = require('express');
   const cors = require('cors');
   const axios = require('axios');
   const { GoogleGenerativeAI } = require('@google/generative-ai');

   const app = express();
   const port = process.env.PORT || 3003;

   app.use(cors({ origin: 'http://localhost:3000' }));
   app.use(express.json());

   const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
   const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
   const chat = model.startChat({
     history: [],
     generationConfig: { maxOutputTokens: 100 },
   });

   app.post('/api/chat', async (req, res) => {
     const { message } = req.body;
     if (!message) {
       return res.status(400).json({ error: 'Message is required' });
     }

     try {
       // Preprocess message to detect intents
       const lowerMessage = message.toLowerCase().trim();
       let responseText = '';

       if (['hi', 'hello', 'hey'].includes(lowerMessage)) {
         responseText = 'Hello! How can I help you with your hotel needs?';
       } else if (lowerMessage === 'bye' || lowerMessage === 'goodbye') {
         responseText = 'Goodbye!';
       } else if (lowerMessage.includes('price of') || lowerMessage.includes('how much is')) {
         // Extract hotel name
         const hotelNameMatch = lowerMessage.match(/price of (.+)|how much is (.+)/);
         const hotelName = hotelNameMatch
           ? (hotelNameMatch[1] || hotelNameMatch[2]).trim()
           : null;

         if (hotelName) {
           // Fetch hotel data from backend
           const hotelsResponse = await axios.get('http://localhost:8800/api/hotels');
           const hotels = hotelsResponse.data;
           const hotel = hotels.find(
             (h) => h.name.toLowerCase() === hotelName.toLowerCase()
           );

           if (hotel) {
             responseText = `The price for ${hotel.name} is $${hotel.cheapestPrice}/night.`;
           } else {
             responseText = `Sorry, I couldn't find ${hotelName}.`;
           }
         } else {
           responseText = 'Please specify a hotel name.';
         }
       } else {
         // Fallback to Gemini API for general queries
         const result = await chat.sendMessage(message);
         responseText = await result.response.text();
       }

       res.json({ response: responseText });
     } catch (error) {
       console.error('Error:', error);
       res.status(500).json({ error: 'Something went wrong' });
     }
   });

   app.listen(port, () => {
     console.log(`Chatbot server running on http://localhost:${port}`);
   });