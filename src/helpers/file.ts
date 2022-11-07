import { extname } from 'path';

const fileUtils = {
  destination: './uploads',
  filename: function (_, file, callback) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(
      null,
      `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
    );
  },
  imageFileFilter: (_, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files are allowed'), false);
    }
    callback(null, true);
  },
};

export default fileUtils;
