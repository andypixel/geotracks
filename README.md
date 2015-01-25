geotracks
=========

Node console app to pull data from Geoloqi and save to text files

Setting up
----------
Make a copy of `local_settings.js.template` and rename to `local_settings.js`. Edit to include your application's settings.

Usage
-----
1. Assure that config.js is accurate
	- Generate a current `oath` token at https://developers.geoloqi.com/client-libraries/nodejs
	- If this is the first time you are running the application, `startTimestamp` should be `null`. Otherwise, `startTimestamp` should be the value of the most recent (smallest) filename in the "output" folder.
2. In a command prompt, navigate to the project location folder: `cd C:\path\to\project`
3. Run the application: `> node app`
4. To run subsequent batches, edit `startTimestamp` to be the value of the most recent (smallest) filename in the "output" folder.
