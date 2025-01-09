const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const XLSX = require('xlsx');

// Set up views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.resolve(__dirname, './data'); // Resolve path for '../data'
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const Filename = Date.now() + '-' + file.originalname;
        console.log('Uploading file:', Filename);
        cb(null, Filename);
    },
});

// File upload middleware
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /xlsx/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .xlsx files are allowed!'));
    },
}).single('myfile');

// Routes
app.get('/', (req, res) => {
    res.render('signup');
});

app.post('/upload', (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(400).send(err.message);
        }
        res.send('File uploaded successfully!');
    });
});

// Read XLSX file
app.get('/read-data', (req, res) => {
    const filePath = path.resolve(__dirname, '../data/Book1.xlsx');

    try {
        const workbook = XLSX.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const data = [];
        for (let i = 2; i <= 4; i++) {
            const rollno = worksheet[`A${i}`]?.v || 'N/A';
            const Name = worksheet[`B${i}`]?.v || 'N/A';
            const Email = worksheet[`C${i}`]?.v || 'N/A';

            data.push({
                rollNo: rollno,
                Name: Name,
                Email: Email,
            });
        }

        console.log(data);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error reading XLSX file: ' + error.message);
    }
});

// Start server
app.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});
