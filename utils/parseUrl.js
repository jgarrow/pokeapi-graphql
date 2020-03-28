const parseUrl = url => {
    const urlSplit = url.split("/");

    return urlSplit[urlSplit.length - 2];
};

module.exports = { parseUrl };
