module.exports = email => email.toLowerCase().replace(/[^a-zA-Z]/g, '|');
