window.console.c = null;
window.addEventListener('keydown', async function (e) {
	
	if (e.key !== 'I' || !e.ctrlKey || !e.shiftKey || e.repeat) {
		return false;
	}
	
	try {
		if (localStorage.useBuiltInDevTools !== 'false') {
			if (localStorage.useBuiltInDevTools === 'true' || confirm('This site is using devtools.js. Use the normal devtools instead? ("Cancel" to use devtools.js)')) return localStorage.setItem('useBuiltInDevTools', 'true');
		} 
		localStorage.setItem('useBuiltInDevTools', 'false');/*
		if (window.opener) {
			if (window.console.hasOpened) {
				return false;
			}
			window.open(location.href, '_blank', 'location=yes,height=' + screen.availHeight + ',width=' + (screen.width - 520).toString() + ',scrollbars=yes,status=yes,top=0,left=0');
			window.console.hasOpened = true;
			return false;
		}*/
		e.preventDefault();
		await toggleConsole();
		console.c.ev = (sfjlsjflksjsdfiosjsoijoij) => eval.apply(window, [sfjlsjflksjsdfiosjsoijoij]);console.log(console.c);
		window.console.oldLog = window.console.log;
        window.console.log = function (data) {
            try {
                console.c.$('#output').appendChild(console.c.createOutput(data, true));
		    console.c.scrollTo(0,document.body.scrollHeight);
                console.oldLog(...arguments);
            } catch (e) {
                console.c.$('#output').appendChild(console.c.createError(e.stack));
		    console.c.scrollTo(0,document.body.scrollHeight);
            }
        }
        window.console.oldWarn = window.console.warn;
        window.console.warn = function (data) {
            try {
                console.c.$('#output').appendChild(console.c.createWarning(data, true));
		    console.c.scrollTo(0,document.body.scrollHeight);
                console.oldWarn(...arguments);
            } catch (e) {
                console.c.$('#output').appendChild(console.c.createError(e.stack));
		    console.c.scrollTo(0,document.body.scrollHeight);
            }
        }
		window.console.oldClear = window.console.clear;
		window.console.clear = function () {
            try {
                console.c.$('#output').innerHTML = '';
		    console.c.scrollTo(0,document.body.scrollHeight);
                console.oldClear(...arguments);
            } catch (e) {
                console.c.$('#output').appendChild(console.c.createError(e.stack));
		    console.c.scrollTo(0,document.body.scrollHeight);
            }

        }
		window.addEventListener('blur', console.c.blur);
		window.addEventListener('focus', console.c.focus);
		window.addEventListener('unload', console.c.close);
		window.addEventListener('error', (e) => {
			console.c.$('#output').appendChild(console.c.createError(e.stack));
			console.c.scrollTo(0,document.body.scrollHeight);
		});
	} catch (e) {
		console.error(e);
	}
});

window.toggleConsole = async function toggleConsole () {
	if (window.console.open) {
		window.console.c.close()
		window.console.c = null;
		window.console.open = false;
		return Promise.resolve(false);
	}
	let html = await fetch('https://genius6942.github.io/devtools.js/console.html');
	html = await html.text();
	const c = window.console.c = window.open('', '_blank', 'location=yes,height=' + window.outerHeight + ',width=520,scrollbars=yes,status=yes,top=0,left=' + (screen.width - 520).toString());
	c.document.write(html);
	window.console.open = true;
	return Promise.resolve(true);
}

window.addEventListener('unload', () => {
	if (window.console.c) {
		console.c.close();
	}
})
