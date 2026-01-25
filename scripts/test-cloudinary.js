const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Load env vars manually from ../.env (relative to this script)
const envPath = path.join(__dirname, '..', '.env');

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        // Skip comments
        if (line.trim().startsWith('#')) return;
        
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=');
            process.env[key.trim()] = value.trim();
        }
    });
} catch (e) {
    console.error("Could not read .env file at " + envPath);
    console.error(e.message);
    process.exit(1);
}

if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error("❌ CLOUDINARY_CLOUD_NAME not found in .env");
    process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('🔄 Testing Cloudinary connection...');
console.log(`☁️  Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);

// Upload a sample image from a reliable URL (Cloudinary's own demo image)
const sampleImage = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';

cloudinary.uploader.upload(sampleImage, { 
    folder: 'nijsci_test_verification' 
})
  .then(result => {
    console.log('\n✅ Upload Successful!');
    console.log('📸 Image URL:', result.secure_url);
    console.log('📂 Public ID:', result.public_id);
    
    // Clean up
    console.log('\n🧹 Cleaning up (deleting test image)...');
    return cloudinary.uploader.destroy(result.public_id);
  })
  .then((result) => {
    if (result && result.result === 'ok') {
        console.log('✅ Test image deleted successfully.');
    } else {
        console.log('⚠️  Deletion status:', result);
    }
  })
  .catch(error => {
    console.error('\n❌ Upload Failed:', error);
  });
