const { google } = require('googleapis');
const Document = require('../models/Document');

const exportTransactions = async (req, res) => {
  try {
    const { organizationId } = req.params;

    const auth = new google.auth.GoogleAuth({
    keyFile: './config/googleDrive.json',
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file'
      ],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const drive = google.drive({ version: 'v3', auth });

    // Create a new spreadsheet
    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: `Document Tracking Report - ${new Date().toLocaleDateString()}`,
        },
      },
    });

    // Get all documents (removed organization filter temporarily)
    const documents = await Document.find()
      .sort({ createdAt: -1 });

    console.log('Found documents:', documents); // Debug log

    // Prepare the data for the spreadsheet
    const values = [
      // Headers matching your table
      [
        'Serial Number',
        'Document Name',
        'Description',
        'Status',
        'Recipient',
        'Created At',
        'Current Office'
      ],
      // Data rows
      ...documents.map(doc => [
        doc.serialNumber || '',
        doc.documentName || '',
        doc.description || '',
        doc.status === 'pending' ? 'IN PROCESS' :
        doc.status === 'accept' ? 'IN TRANSIT' :
        doc.status || '',
        doc.recipient || '',
        new Date(doc.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        doc.currentOffice || ''
      ])
    ];

    // Write to the spreadsheet
    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheet.data.spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    // Format the spreadsheet
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: spreadsheet.data.spreadsheetId,
      requestBody: {
        requests: [
          // Format header row
          {
            repeatCell: {
              range: {
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.2,
                    green: 0.2,
                    blue: 0.2,
                  },
                  textFormat: {
                    bold: true,
                    foregroundColor: {
                      red: 1,
                      green: 1,
                      blue: 1,
                    },
                  },
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)',
            },
          },
          // Auto-resize columns
          {
            autoResizeDimensions: {
              dimensions: {
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: 7, // Updated to match number of columns
              },
            },
          },
        ],
      },
    });

    // Make the spreadsheet publicly readable
    await drive.permissions.create({
      fileId: spreadsheet.data.spreadsheetId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    res.json({
      success: true,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheet.data.spreadsheetId}`,
    });

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export transactions' });
  }
};

module.exports = {
  exportTransactions,
}; 