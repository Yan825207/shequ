const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保uploads目录存在
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created uploads directory');
}

// 配置multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 单个文件上传
const uploadSingleFile = (req, res) => {
    console.log('Received single file upload request');
    console.log('File:', req.file);
    
    if (!req.file) {
        return res.status(400).json({
            code: 400,
            message: 'No file uploaded'
        });
    }
    
    // 构建完整的预览地址
    // 动态获取主机信息，避免硬编码IP地址
    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:5000'; // 优先使用请求的主机信息
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    
    res.status(200).json({
        code: 200,
        message: 'File uploaded successfully',
        data: {
            filename: req.file.filename,
            url: fileUrl,
            preview_url: fileUrl,
            size: req.file.size,
            mimetype: req.file.mimetype
        }
    });
};

// 多个文件上传
const uploadMultipleFiles = (req, res) => {
    console.log('Received multiple files upload request');
    console.log('Files:', req.files);
    
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            code: 400,
            message: 'No files uploaded'
        });
    }
    
    // 构建完整的预览地址
    // 动态获取主机信息，避免硬编码IP地址
    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:5000'; // 优先使用请求的主机信息
    
    const files = req.files.map(file => {
        const fileUrl = `${protocol}://${host}/uploads/${file.filename}`;
        return {
            filename: file.filename,
            url: fileUrl,
            preview_url: fileUrl,
            size: file.size,
            mimetype: file.mimetype
        };
    });
    
    res.status(200).json({
        code: 200,
        message: 'Files uploaded successfully',
        data: { files }
    });
};

module.exports = {
    upload,
    uploadSingleFile,
    uploadMultipleFiles
};