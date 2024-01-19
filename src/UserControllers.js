const User = require("./Schema/userSchema");
const axios = require("axios");
const jwt = require('jsonwebtoken');
const ifsc = require('ifsc');
require('dotenv').config();

const createUser = async (req, res) => {
  try {
    const { user_id, user_name, bank_accounts, id, name, accounts: { bank_code } } = req.body.data;

    // Validate required fields
    const requiredFields = ['user_id', 'user_name', 'bank_accounts', 'id', 'name', 'accounts'];

    for (const field of requiredFields) {
      if (!req.body.data[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    // Check if the user with the given user_id already exists
    const existingUser = await User.findOne({ user_id });

    if (existingUser) {
      existingUser.user_name = user_name;
      existingUser.bank_accounts = bank_accounts;
      existingUser.id = id;
      existingUser.name = name;
      existingUser.bank_code = bank_code;

      await existingUser.save();

      // Generate JWT token
      const token = jwt.sign({ user_id: existingUser.user_id }, process.env.JWT_SECRET, {
        expiresIn: '5h',
      });

      res.status(200).json({ success: true, token: token, data: existingUser });
  }

    // Fetch data from Razorpay API
    const razorpayApiUrl = `https://ifsc.razorpay.com/${bank_code}`;
    const razorpayResponse = await axios.get(razorpayApiUrl);

    if (razorpayResponse.status !== 200) {
      console.error('Error fetching Razorpay data:', razorpayResponse.statusText);
      return res.status(500).json({ error: 'Error fetching Razorpay data' });
    }

    const razorpayData = razorpayResponse.data;

    // Fetch weather data from OpenWeatherMap API
    const weatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${razorpayData.CITY},${razorpayData.STATE}&appid=${process.env.weatherApiKey}&units=metric`;
    const weatherResponse = await axios.get(weatherApiUrl);
    const weatherData = weatherResponse.data;

    // Create a new user document
    const newUser = new User({
      user_id,
      user_name,
      bank_accounts,
      id,
      name,
      accounts: {
        bank: razorpayData.BANK,
        branch: razorpayData.BRANCH,
        address: razorpayData.ADDRESS,
        city: razorpayData.CITY,
        district: razorpayData.DISTRICT,
        state: razorpayData.STATE,
        bank_code,
        weather: {
          temp: weatherData.main.temp,
          humidity: weatherData.main.humidity,
        },
      },
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ user_id: newUser.user_id }, process.env.JWT_SECRET, {
      expiresIn: "5h"
    });

    res.status(201).json({ success: true, token, data: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// For get api
const fetchUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).send("User Id is required");
    }

    const user = await User.findOne({ user_id });

    if (!user) {
      return res.status(400).send("User id is not correct");
    }

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createUser,
  fetchUser
};
