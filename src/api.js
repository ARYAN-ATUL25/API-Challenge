const express = require("express");
const bodyParser = require("body-parser");

const serverless = require("serverless-http");

const port = 5009;

const app = express();
app.use(bodyParser.json());

const router = express.Router();

router.get("/bfhl", (req, res) => {
  res.status(200).json({
    operation_code: 1,
  });
});

router.post("/bfhl", (req, res, next) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid "data" format in the request body.');
    }

    // Separate numbers and alphabets
    const numbers = data.filter((item) => !isNaN(item));
    const alphabets = data.filter((item) => isNaN(item));

    // Sort the alphabets to get the highest
    const sortedAlphabets = [...alphabets].sort((a, b) => b.localeCompare(a));
    const highestAlphabet = sortedAlphabets[0] || "";

    const response = {
      is_success: true,
      user_id: "aa7930",
      email: "aa7930@srmist.edu.in",
      roll_number: "RA2011003010844",
      numbers: numbers,
      alphabets: alphabets,
      highest_alphabet: [highestAlphabet],
    };

    res.json(response);
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
});

// Handle 404 for unmatched routes
router.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error-handling middleware
router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

app.use("/.netlify/functions/api", router);

module.exports.handler = serverless(app);

// app.listen(port, () => {
//   console.log("Server is listening to port:", port);
// });
