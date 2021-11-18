(async function () {
	try {
		let html = await fetch('/console.html');
		html = await html.text();
		const c = window.open('', '_blank', 'location=yes,height=' + window.outerHeight + ',width=520,scrollbars=yes,status=yes,top=0,left=' + (window.outerWidth - 520).toString());
		c.document.write(html);
		c.ev = (sfjlsjflksjsdfiosjsoijoij) => eval.apply(window, [sfjlsjflksjsdfiosjsoijoij]);
		window.console.oldLog = window.console.log;
        window.console.log = function (data) {
            try {
                c.$('#output').appendChild(c.createOutput(data, true));
                console.oldLog(...arguments);
            } catch (e) {
                c.$('#output').appendChild(c.createError(e.stack));
            }
        }
        window.console.oldWarn = window.console.warn;
        window.console.warn = function (data) {
            try {
                c.$('#output').appendChild(c.createWarning(data, true));
                console.oldWarn(...arguments);
            } catch (e) {
                c.$('#output').appendChild(c.createError(e.stack));
            }
        }
		window.console.oldClear = window.console.clear;
		window.console.clear = function () {
            try {
                c.$('#output').innerHTML = '';
                console.oldClear(...arguments);
            } catch (e) {
                c.$('#output').appendChild(c.createError(e.stack));
            }
        }
	} catch (e) {
		console.error(e);
	}
})();