//content script
var clickedEl = null;
jQuery.fn.extend({
    getPath: function() {
        var pathes = [];

        this.each(function(index, element) {
            var path, $node = jQuery(element);

            while ($node.length) {
                var realNode = $node.get(0), name = realNode.localName;
                if (!name) { break; }

                name = name.toLowerCase();
                var parent = $node.parent();
                var sameTagSiblings = parent.children(name);

                if (sameTagSiblings.length > 1)
                {
                    allSiblings = parent.children();
                    var index = allSiblings.index(realNode) +1;
                    if (index > 0) {
                        name += ':nth-child(' + index + ')';
                    }
                }

                path = name + (path ? ' > ' + path : '');
                $node = parent;
            }

            pathes.push(path);
        });

        return pathes.join(',');
    }
});
jQuery.fn.attrAll = function() {
    var ret = {};
    var attrs = this.get(0).attributes;
    var attr;
    for (var i = 0, len = attrs.length; i < len; i++) {
        attr = attrs[i];
        ret[attr.name] = attr.value;
    }
    return ret;
};


document.addEventListener("mousedown", function(event) {
    //right click
    if (event.button == 2) {
        clickedEl = event.target;
    }
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request == "getClickedEl") {
        sendResponse({
			fullSelector:$(clickedEl).getPath(),
			attributes:$(clickedEl).attrAll(),
			url:location.href.replace('#','')
		});
		return true;
    }
});

chrome.storage.sync.get('coloring',(value)=>{
	var {coloring} = value;
	coloring = coloring.filter((c)=>{
		return location.href.indexOf(c.url)!=-1;
	}).forEach(c=>{
		injectionCSS(`
${c.selector} {
	${c.css}
}

`		)
 	})
})

function injectionScript(fn) {
    document.body.appendChild((function() {
        var el = document.createElement('script');
        el.text = '(' + fn.toString() + ')()';
        return el;
    })())
}

function injectionCSS(css) {
    document.head.appendChild((function() {
        var el = document.createElement('style');
        el.innerHTML = css;
        return el;
    })())
}