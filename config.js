exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://ZeePete:ginger@ds149353.mlab.com:49353/thinkful-blog-api';
exports.PORT = process.env.PORT || 8080;