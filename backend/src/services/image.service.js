const sharp = require('sharp');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');

exports.enhanceImage = async (filePath) => {
    try {
        const enhancedPath = filePath.replace(/(\.[\w\d_-]+)$/i, '_enhanced.png');

        // 1. Try Remove.bg (if API Key is configured)
        if (process.env.REMOVE_BG_API_KEY) {
            console.log("Using remove.bg for background removal...");
            const formData = new FormData();
            formData.append('image_file', fs.createReadStream(filePath));
            formData.append('size', 'auto');

            const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
                headers: {
                    ...formData.getHeaders(),
                    'X-Api-Key': process.env.REMOVE_BG_API_KEY,
                },
                responseType: 'arraybuffer'
            });

            // Use sharp to process result (add studio shadow, center, etc if needed)
            // For now, just save the transparent png
            await sharp(response.data)
                .trim() // Trim transparent whitespace
                .modulate({
                    brightness: 1.1,
                    saturation: 1.2
                })
                .flatten({ background: '#ffffff' }) // Ensure white background
                .sharpen()
                .toFile(enhancedPath);

        } else {
            // 2. Local "Studio Style" Enhancement via Sharp (Fallback)
            console.log("Using local sharp processing (No API Key found)...");

            // This pipeline simulates a "studio" look by normalizing and creating a punchy aesthetic
            await sharp(filePath)
                .modulate({
                    brightness: 1.1,
                    saturation: 1.3, // Boost colors
                })
                .sharpen({
                    sigma: 1.5,
                    m1: 1,
                    m2: 2
                })
                .gamma(1.1) // Slight gamma correction for contrast
                .toFile(enhancedPath);
        }

        return enhancedPath;

    } catch (error) {
        console.error("Image processing failed:", error.response ? error.response.data.toString() : error.message);
        throw new Error("Failed to enhance image");
    }
};
