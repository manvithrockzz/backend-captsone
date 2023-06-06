// const express = require('express');
// const mongoose = require('mongoose');
// const app = express();
// const port = 3001;

// mongoose.connect('mongodb+srv://admin:admin@backendcapstone.np8g6wn.mongodb.net/backendcapstone', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log('Connected to the database!');
// }).catch((err) => {
//   console.error('Error connecting to the database:', err.message);
// });

// // ... existing code

// // Add a new route for the health API
// app.get('/health', (req, res) => {
//   res.status(200).json({ message: 'Server is up and running' });
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}/`);
// });

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3001;

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:admin@backendcapstone.np8g6wn.mongodb.net/backendcapstone', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to the database!');
}).catch((err) => {
  console.error('Error connecting to the database:', err.message);
});

// Define the job listing schema
const jobListingSchema = new mongoose.Schema({
  title: String,
  description: String,
  skills: [String],
  company: String,
  location: String
});

// Create the job listing model
const JobListing = mongoose.model('JobListing', jobListingSchema);

// Middleware to parse JSON body
app.use(express.json());

// Route: Create a job listing
app.post('/job-listings', (req, res) => {
  const { title, description, skills, company, location } = req.body;

  // Create a new job listing
  const jobListing = new JobListing({
    title,
    description,
    skills,
    company,
    location
  });

  // Save the job listing to the database
  jobListing.save()
    .then((savedJobListing) => {
      res.status(201).json(savedJobListing);
    })
    .catch((err) => {
      res.status(500).json({ error: 'An error occurred while creating the job listing' });
    });
});

// Route: Get all job listings
app.get('/job-listings', (req, res) => {
  JobListing.find()
    .then((jobListings) => {
      res.json(jobListings);
    })
    .catch((err) => {
      res.status(500).json({ error: 'An error occurred while retrieving job listings' });
    });
});

// Route: Get a single job listing by ID
app.get('/job-listings/:id', (req, res) => {
  const jobId = req.params.id;

  JobListing.findById(jobId)
    .then((jobListing) => {
      if (!jobListing) {
        res.status(404).json({ error: 'Job listing not found' });
      } else {
        res.json(jobListing);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: 'An error occurred while retrieving the job listing' });
    });
});

// Route: Update a job listing by ID
app.put('/job-listings/:id', (req, res) => {
  const jobId = req.params.id;
  const { title, description, skills, company, location } = req.body;

  JobListing.findByIdAndUpdate(
    jobId,
    { title, description, skills, company, location },
    { new: true }
  )
    .then((updatedJobListing) => {
      if (!updatedJobListing) {
        res.status(404).json({ error: 'Job listing not found' });
      } else {
        res.json(updatedJobListing);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: 'An error occurred while updating the job listing' });
    });
});

// Route: Delete a job listing by ID
app.delete('/job-listings/:id', (req, res) => {
  const jobId = req.params.id;

  JobListing.findByIdAndDelete(jobId)
    .then((deletedJobListing) => {
      if (!deletedJobListing) {
        res.status(404).json({ error: 'Job listing not found' });
      } else {
        res.json({ message: 'Job listing deleted successfully' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: 'An error occurred while deleting the job listing' });
    });
});

// Route: Share job listing using public link
app.get('/job-listings/:id/share', (req, res) => {
  const jobId = req.params.id;

  // Generate and return the public link for the job listing
  const publicLink = `http://yourdomain.com/job-listings/${jobId}`;
  res.json({ publicLink });
});

// ... existing code

// Add a new route for the health API
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is up and running' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
