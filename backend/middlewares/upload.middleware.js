const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const createUploadDirectories = () => {
  const dirs = [
    "./uploads",
    "./uploads/profiles",
    "./uploads/plat",
    "./uploads/categories",
    "./uploads/images",
    "./uploads/videos",
    "./uploads/multiple",
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Create directories when the module is loaded
createUploadDirectories();

// Configure storage settings for different upload types
const configureStorage = (folderPath, filePrefix) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        filePrefix + "-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
  });
};

// File filters
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const videoFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed!"), false);
  }
};

const mediaFileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed!"), false);
  }
};

// Create multer instances
const profileUpload = multer({
  storage: configureStorage("./uploads/profiles", "profile"),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFileFilter,
});

const platUpload = multer({
  storage: configureStorage("./uploads/plat", "plat"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: imageFileFilter,
});

const categoryUpload = multer({
  storage: configureStorage("./uploads/categories", "category"),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFileFilter,
});

const singleImageUpload = multer({
  storage: configureStorage("./uploads/images", "image"),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: imageFileFilter,
});

const multipleImageUpload = multer({
  storage: configureStorage("./uploads/multiple", "image"),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: imageFileFilter,
});

const videoUpload = multer({
  storage: configureStorage("./uploads/videos", "video"),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: videoFileFilter,
});

const multipleVideoUpload = multer({
  storage: configureStorage("./uploads/multiple", "video"),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: videoFileFilter,
});

// Common error handler for multer uploads
const handleUploadError = (err, res) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  } else if (err) {
    return res.status(500).json({
      success: false,
      message: `Error: ${err.message}`,
    });
  }
};

// Middleware for profile image upload
exports.uploadProfileImage = (req, res, next) => {
  const upload = profileUpload.single("profileImage");

  upload(req, res, function (err) {
    if (err) {
      return handleUploadError(err, res);
    }

    if (req.file) {
      req.body.profileImage = `/uploads/profiles/${req.file.filename}`;
    }
    next();
  });
};

// Middleware for plat image upload
exports.uploadPlatImage = (req, res, next) => {
  const upload = platUpload.single("platImage");

  upload(req, res, function (err) {
    if (err) {
      return handleUploadError(err, res);
    }

    if (req.file) {
      req.body.platImage = `/uploads/plat/${req.file.filename}`;
    }
    next();
  });
};

// Middleware for category image upload
exports.uploadCategoryImage = (req, res, next) => {
  const upload = categoryUpload.single("categoryImage");

  upload(req, res, function (err) {
    if (err) {
      return handleUploadError(err, res);
    }

    if (req.file) {
      req.body.categoryImage = `/uploads/categories/${req.file.filename}`;
    }
    next();
  });
};

// Middleware for single image upload
exports.uploadSingleImage = (req, res, next) => {
  const upload = singleImageUpload.single("image");

  upload(req, res, function (err) {
    if (err) {
      return handleUploadError(err, res);
    }

    if (req.file) {
      req.body.imagePath = `/uploads/images/${req.file.filename}`;
    }
    next();
  });
};

// Middleware for multiple images upload
exports.uploadMultipleImages = (req, res, next) => {
  // Support both "images" (for create) and "newImages" (for update)
  const upload = multipleImageUpload.array("newImages", 5);

  upload(req, res, function (err) {
    if (err) {
      return handleUploadError(err, res);
    }

    // If new files were uploaded, add their paths to req.body
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map(
        (file) => `/uploads/multiple/${file.filename}`
      );
      req.body.newImagePaths = newImagePaths;
    }

    next();
  });
};

// Middleware for single video upload
exports.uploadSingleVideo = (req, res, next) => {
  const upload = videoUpload.single("video");

  upload(req, res, function (err) {
    if (err) {
      return handleUploadError(err, res);
    }

    if (req.file) {
      req.body.videoPath = `/uploads/videos/${req.file.filename}`;
    }
    next();
  });
};

// Middleware for multiple videos upload
exports.uploadMultipleVideos = (req, res, next) => {
  const upload = multipleVideoUpload.array("videos", 3); // Allow up to 3 videos

  upload(req, res, function (err) {
    if (err) {
      return handleUploadError(err, res);
    }

    if (req.files && req.files.length > 0) {
      const videoPaths = req.files.map(
        (file) => `/uploads/multiple/${file.filename}`
      );
      req.body.videoPaths = videoPaths;
    }
    next();
  });
};

// Combined middleware for mixed media uploads (both images and videos)
exports.uploadMixedMedia = (req, res, next) => {
  const upload = multer({
    storage: configureStorage("./uploads/multiple", "media"),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for videos
    fileFilter: mediaFileFilter,
  }).fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 3 },
  ]);

  upload(req, res, function (err) {
    if (err) {
      return handleUploadError(err, res);
    }

    if (req.files) {
      // Process images
      if (req.files.images) {
        const imagePaths = req.files.images.map(
          (file) => `/uploads/multiple/${file.filename}`
        );
        req.body.imagePaths = imagePaths;
      }

      // Process videos
      if (req.files.videos) {
        const videoPaths = req.files.videos.map(
          (file) => `/uploads/multiple/${file.filename}`
        );
        req.body.videoPaths = videoPaths;
      }
    }
    next();
  });
};

// Helper function to delete a file
exports.deleteFile = (filePath) => {
  const fullPath = path.join(__dirname, "..", filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    return true;
  }
  return false;
};
