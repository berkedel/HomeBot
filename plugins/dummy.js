"use strict";

function Dummy() {
}

Dummy.prototype.hi = function(event, action) {
	return "Hi";
}

module.exports = Dummy;