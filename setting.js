var $absolute = $('#absolute');
var $selector = $('#selector');
var $attributes = $('#attributes');
var $add = $('#add');
var $URL = $('#URL');
var $CSS = $('#CSS');
var $table = $('table')

var coloring = [];
chrome.storage.sync.get('coloring', (data) => {
	data = data.coloring
    coloring = Array.isArray(data)?data:coloring;
    coloring.forEach((d,i)=>{
		var $tr = $('<tr/>');
		$tr.append($('<td/>',{
			text:d.url
		}))
		$tr.append($('<td/>',{
			text:d.selector
		}))
		$tr.append($('<td/>',{
			text:d.css
		}))
		$tr.append($('<td/>').append($('<button/>',{
			text:'削除',
		}).click(function(){
			coloring.splice(i, 1);
			location.reload()
			chrome.storage.sync.set({'coloring':coloring})
		})))
		$table.append($tr)
    })
})


$absolute.change(function(e){
    $selector.val(selectors.absolute);
    selectorMode = 'absolute';
})
$attributes.change(function(e){
    $selector.val(selectors.custom);
    selectorMode = 'custom';
})

$add.click(function(){
	var selector = $selector.val();
	var css = $CSS.val();
	var url = $URL.val();
	if(!selector||!css){
		alert('ちゃんと入力しろよな！');
		return
	}
	coloring.push({selector,css,url})
	chrome.storage.sync.set({'coloring':coloring})
	location.reload()
})

const query = getUrlVars();
const selectors = {
	absolute:'',
	custom:'',
	attributes:{}
}
query.forEach(key=>{
	switch(key){
		case 'new':
			const newData = JSON.parse(atob(query[key]))
			$URL.val(newData.url)
			selectors.absolute = newData.fullSelector;
			selectors.custom = makeCustomSelector(newData.attributes);
			selectors.attributes = newData.attributes
			$absolute.change();
			break;
	}
})

/**
 * URL解析して、クエリ文字列を返す
 * @returns {Array} クエリ文字列
 */
function getUrlVars() {
    var vars = [],
        max = 0,
        hash = "",
        array = "";
    var url = window.location.search;

    //?を取り除くため、1から始める。複数のクエリ文字列に対応するため、&で区切る
    hash = url.slice(1).split('&');
    max = hash.length;
    for (var i = 0; i < max; i++) {
        array = hash[i].split('='); //keyと値に分割。
        vars.push(array[0]); //末尾にクエリ文字列のkeyを挿入。
        vars[array[0]] = array[1]; //先ほど確保したkeyに、値を代入。
    }

    return vars;
}

function makeCustomSelector(param){
	var ret = "";
	for(var key in param){
		ret += `[${key}="${param[key]}"]`
	}
	return ret
}