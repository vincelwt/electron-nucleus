'use strict';

const {remote} = require('electron')
const request = require('request')

const userId = require('node-machine-id').machineIdSync()
const platform = process.platform
const version = remote.app.getVersion()
const language = navigator.language

// Taken from sindresorhus/electron-is-dev, thanks to the author
const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1
const isEnvSet = 'ELECTRON_IS_DEV' in process.env
const devModeEnabled = isEnvSet ? getFromEnv : (process.defaultApp || /node_modules[\\/]electron[\\/]/.test(process.execPath))
//

const serverUrl = "https://nucleusmetrics.com/track"

let appId = ""

let queue = localStorage.getItem('queue') || []

module.exports = {

	init: function(appId) {

		if (appId && !devModeEnabled) {

			appId = appId

			queue.push({
				event: 'init',
				date: new Date(),
				user: userId,
				platform: platform,
				version: version,
				language: language
			})

			localStorage.setItem('queue', queue)

			reportData()

		}

	},

	track: function(eventName) {

		if (eventName && !devModeEnabled) {

			queue.push({
				event: eventName,
				date: new Date(),
				user: userId
			})

			localStorage.setItem('queue', queue)

			reportData()

		}

	},

	checkLicense: function(license) {

	}
}

function reportData() {
	request({ url: url+'/'+appId, method: 'POST', json: {data: queue} }, function (err, res, body) {

		if (err) {
			// No internet or error with server
			// Data will be sent with next request

		} else {
			// Data was successfully reported

			queued = []

			localStorage.setItem('queue', queue)

		}
		
	})
}