const fs = jest.createMockFromModule('fs') as any;

fs.watchFile = jest.fn();

module.exports = fs;