import app from './server';

var PORT = process.env.PORT || 3131;
app.init().listen(PORT, function () {
  var address = this.address();
  console.log(`Listening to ${address.port}`);
});
