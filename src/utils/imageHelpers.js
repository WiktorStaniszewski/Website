/**
 * Utility to get product image URL from image name or path.
 * Handles both backend-uploaded images and legacy temp products.
 * 
 * @param {string} imageName - Name of the image from DB
 * @returns {string} - Full URL to the image
 */
export const getProductImageUrl = (imageName) => {
    if (!imageName) return 'https://placehold.co/150x150?text=Brak+foto';
    
    // 1. If it's already a full URL or blob/data URI, return as is
    if (imageName.startsWith('http') || imageName.startsWith('blob:') || imageName.startsWith('data:')) {
        return imageName;
    }

    // 2. Check for uploaded images from backend (timestamped names like 171456...-image.jpg)
    if (/^\d{10,}-/.test(imageName)) {
        return `http://localhost:5000/images/products/${imageName}`;
    }

    // 3. If the image name already contains "images/", ensure it's handled correctly
    if (imageName.includes('images/')) {
        return imageName.startsWith('/') ? imageName.substring(1) : imageName;
    }

    // 4. Default to legacy temp products folder
    return `images/tempProducts/${imageName}`;
};
