const cloudinary = require('../config/cloudinary');
const Photo = require('../models/Photo');

class PhotoService {
    /**
     * Deletes a single photo from Cloudinary and the database.
     * @param {string} photoId - The ObjectId of the photo in the database.
     */
    static async deletePhoto(photoId) {
        const photo = await Photo.findById(photoId);
        if (!photo) return false;

        await cloudinary.uploader.destroy(photo.publicId).catch(() => null);
        await Photo.findByIdAndDelete(photoId);
        return true;
    }

    /**
     * Deletes all photos associated with a specific dump from Cloudinary and the database.
     * @param {Array<Object>} photos - Array of photo objects (needs publicId and _id).
     */
    static async deletePhotosForDump(photos) {
        if (!photos || photos.length === 0) return 0;

        const deletePromises = photos.map(photo =>
            cloudinary.uploader.destroy(photo.publicId).catch(() => null)
        );
        await Promise.all(deletePromises);

        const photoIds = photos.map(p => p._id);
        await Photo.deleteMany({ _id: { $in: photoIds } });

        return photos.length;
    }
}

module.exports = PhotoService;
