const ifile = 'signs.csv'
const ofile = 'feeds.js'

const readline = require('readline');
const fs = require('fs');

var a = [];

try {
  if (fs.statSync(ofile).isFile()) {
    console.log("file exists.");
    process.exit();
  }
} catch(error) {
  ;
}

var reader = readline.createInterface({
  input: fs.createReadStream(ifile)
});

reader.on('line', data => {
  let room, dates, url;
  console.log(data);
  [room, dates, url] = data.split(',');
  a.push({room: room, dates: dates, url: url});
});

reader.on('close', () => {
  fs.open(ofile, 'w', () => {});
  fs.writeFileSync(ofile, "var feeds = " + JSON.stringify(a))
});
