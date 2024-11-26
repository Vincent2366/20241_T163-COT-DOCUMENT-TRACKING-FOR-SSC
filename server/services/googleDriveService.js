const { google } = require('googleapis');
const path = require('path');
const { Readable } = require('stream');

class GoogleDriveService {
  constructor() {
    this.GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
    
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, '../config/doctracking-441710-dab36748c1dc.json'),
      scopes: ['https://www.googleapis.com/auth/drive']
    });

    this.driveService = google.drive({ version: 'v3', auth });
  }

  async uploadFile(fileObject) {
    try {
      // Validate input
      if (!fileObject || !fileObject.buffer) {
        throw new Error('Invalid file object provided');
      }

      console.log('Starting upload process with file:', {
        name: fileObject.originalname,
        mimetype: fileObject.mimetype,
        size: fileObject.buffer.length,
        folderID: this.GOOGLE_DRIVE_FOLDER_ID
      });

      // Validate folder ID
      if (!this.GOOGLE_DRIVE_FOLDER_ID) {
        throw new Error('Google Drive folder ID is not configured');
      }

      const fileMetadata = {
        name: fileObject.originalname || `file-${Date.now()}`,
        parents: [this.GOOGLE_DRIVE_FOLDER_ID]
      };

      const media = {
        mimeType: fileObject.mimetype || 'application/octet-stream',
        body: Readable.from(fileObject.buffer)
      };

      console.log('Creating file in Google Drive...');
      const response = await this.driveService.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id,webViewLink'
      });

      console.log('File created, setting permissions...');
      await this.driveService.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        },
        fields: 'id'
      });

      const directLink = `https://drive.google.com/uc?export=view&id=${response.data.id}`;
      
      const result = {
        id: response.data.id,
        webViewLink: response.data.webViewLink,
        directLink
      };

      console.log('Upload completed successfully:', result);
      return result;

    } catch (error) {
      console.error('Detailed upload error:', {
        message: error.message,
        code: error.code,
        errors: error.errors,
        stack: error.stack
      });
      
      // Rethrow with more context
      throw new Error(`Google Drive upload failed: ${error.message}`);
    }
  }

  async deleteFile(fileId) {
    try {
      await this.driveService.files.delete({
        fileId: fileId
      });
      return true;
    } catch (error) {
      console.error('Error deleting file from Google Drive:', error);
      throw error;
    }
  }
}

module.exports = GoogleDriveService; 