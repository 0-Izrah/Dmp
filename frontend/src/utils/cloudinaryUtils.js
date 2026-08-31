/**
 * Utility functions for manipulating Cloudinary URLs
 */

/**
 * Generates an optimized thumbnail URL for a Cloudinary image
 * @param {string} url - The original Cloudinary secure_url
 * @param {number} width - Target width
 * @param {number} height - Target height
 * @returns {string} The transformed URL
 */
export function getThumbnailUrl(url, width = 600, height = 600) {
    if (!url) return '';
    // Check if it's already a cloudinary URL
    if (!url.includes('cloudinary.com')) return url;

    // Handle existing transformations by replacing them or inserting if missing
    // Cloudinary URLs typically look like:
    // https://res.cloudinary.com/<cloud_name>/image/upload/[transformations]/v<version>/<public_id>
    
    // Split on /upload/
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;

    // Replace any existing transformations (if they exist) with our new ones
    // We can assume the second part contains transformations if it doesn't start with v(digits) or the folder path directly
    // Since we know the backend currently returns /upload/w_1200,q_auto,f_auto/, we can safely strip the first segment if it looks like a transform
    let path = parts[1];
    
    // Simple approach: force insert our transformation right after /upload/ and remove any existing ones that were set by the backend
    // Since backend sets w_1200,q_auto,f_auto, we can just replace that specific string, OR we can use regex to strip all transforms.
    // For safety, we just replace the backend's known transform, or insert if it's not there.
    path = path.replace(/^w_[^/]+\//, ''); // Removes existing transforms like w_1200,q_auto,f_auto/
    
    return `${parts[0]}/upload/c_fill,w_${width},h_${height},q_auto,f_auto/${path}`;
}
