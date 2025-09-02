// Update an experience entry by experienceId
export const updateExperience = asyncHandler(async (req, res) => {
  // 1. Extract candidateId from req.user and experienceId from req.params
  // 2. Validate updated experience data
  // 3. Find profile and update specific experience doc by id
  // 4. Save and return updated profile or error if experience not found
});

// Delete an experience entry by experienceId
export const deleteExperience = asyncHandler(async (req, res) => {
  // 1. Extract candidateId from req.user and experienceId from req.params
  // 2. Find profile and remove experience item by id
  // 3. Save and return updated profile
});

// Similarly for Education (add, update, delete)

// Add skills to profile (array update)
// Update skills in profile
// Remove skill from profile

// Upload or update resume file
export const uploadResume = asyncHandler(async (req, res) => {
  // 1. Candidate authentication ensures req.user._id is candidateId
  // 2. Receive file via middleware (multer/cloudinary etc.)
  // 3. Validate file type and size
  // 4. Upload file to cloud storage and get URL
  // 5. Update profile resumeUrl field
  // 6. Save and return updated profile with resume URL
});

// Delete resume file from profile
export const deleteResume = asyncHandler(async (req, res) => {
  // 1. Candidate authentication
  // 2. Remove resumeUrl field from profile
  // 3. Optionally delete file from cloud storage
  // 4. Save and return updated profile
});
