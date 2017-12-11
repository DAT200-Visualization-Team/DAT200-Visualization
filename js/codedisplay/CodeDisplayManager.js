function CodeDisplayManager(language, algorithmOrDataStructure) {

    this.codeRoot;
    this.currentClass;
    this.currentFunction;
	this.currentLine;
	this.variables;
	this.variableMap;

	hljs.configure({ "languages": ["javascript"] });

    var self = this;

    $.ajax({
        url: "./js/codedisplay/code.json",
        dataType: "json",
        async: false,
        success: function (data) {
            self.codeRoot = data;
			self.currentClass = data[language][algorithmOrDataStructure];
			self.variables = data[language][algorithmOrDataStructure]["variables"];
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
}

CodeDisplayManager.prototype.loadFunctions = function () {
    $("#code-text").empty();
    for (var i = 0; i < arguments.length; i++) {
        $("#code-text").append("<span id='" + arguments[i] + "'>" + this.currentClass[arguments[i]].header + "\n");
        for(var j = 0; j < this.currentClass[arguments[i]].lines.length; j++)
            $("#" + arguments[i]).append(this.makeHighlightSpan(this.currentClass[arguments[i]].lines[j]));

        $("#code-text").append("\n\n");
    }
	
    hljs.initHighlighting.called = false;
	hljs.initHighlighting();
	this.addVariableTooltips();
};

CodeDisplayManager.prototype.makeHighlightSpan = function (line) {
    var textStartIndex = line.search(/\S|$/);
	return line.slice(0, textStartIndex) + "<span class='highlighted-code' style='background-color: rgba(255,255,0,0);'>" + line.slice(textStartIndex) + "</span>\n";
};

CodeDisplayManager.prototype.addVariableTooltips = function () {
	if (this.variables == null)
		return;

	// Make a map containing variable name and corresponding value if it is not already done.
	if (this.variableMap === undefined) {
		this.variableMap = this.variables.reduce(function (map, obj) {
			map[obj.name] = "undefined";
			return map;
		}, {});
	}

	var words = this.variables.map(function (a) { return a.name; });
	var regexp = new RegExp('([\\.\\(\\[\\{\\s\\+\\-\\*\\/\\>=\\,\\"])(' + words.join('|') + ')(?=[\\.\\)\\[\\]\\}\\s\\+\\-\\*;\\<\\,])', 'g');

	var text = $("#code-text").html();

	text = text.replace(regexp, '$1<span class="tooltip-$2 variable" title="undefined">$2</span>');

	$("#code-text").html(text);

	$(".variable").qtip({
		style: { classes: "qtip-tipsy" }
	});
};

CodeDisplayManager.prototype.updateVariable = function (varName, value) {
	if (varName in this.variableMap) {
		oldValue = this.variableMap[varName];
		this.variableMap[varName] = value;
		return {
			e: ".tooltip-" + varName, p: {
				onComplete: function (val) {
					$(".tooltip-" + varName).qtip('option', 'content.text', val);
				},
				onCompleteParams: [value],
				onReverseComplete: function (val) {
					$(".tooltip-" + varName).qtip('option', 'content.text', val);
				},
				onReverseCompleteParams: [oldValue]
			}
		};
	}
	else {
		console.error("Variable " + varName + " does not exist");
		return null;
	}
};

CodeDisplayManager.prototype.setVariable = function (varName, value) {
	if (varName in this.variableMap) {
		this.variableMap[varName] = value;
		$(".tooltip-" + varName).qtip('option', 'content.text', value);
	}
	else {
		console.error("Variable " + varName + " does not exist");
	}
};

CodeDisplayManager.prototype.changeFunction = function (functionName, line) {
    if (line == null)
        line = 0;

    this.currentFunction = functionName;
    this.currentLine = line;
};

CodeDisplayManager.prototype.highlightNextLine = function (highlightTime, initialDelay) {
    this.highlightLine(this.currentLine, highlightTime, initialDelay);
    this.currentLine++;
};

CodeDisplayManager.prototype.getHighlightInfo = function (index, highlightTime) {
    if (highlightTime == null) highlightTime = 1000;

    var lineToDisplay = $("#" + this.currentFunction).find(".highlighted-code");

    this.currentLine = index++;

    return [
        { e: lineToDisplay[index - 1], p: { backgroundColor: 'rgba(255,255,0,1)' }, o: { duration: highlightTime / 2 } },
        { e: lineToDisplay[index - 1], p: { backgroundColor: 'transparent' }, o: { duration: highlightTime / 2 } }
    ];
};

CodeDisplayManager.prototype.getMultiHighlightInfo = function (indexArray, highlightTime) {
    var frames = [];

    for (var i = 0; i < indexArray.length; i++) {
        frames = frames.concat(this.getHighlightInfo(indexArray[i], highlightTime));
    }

    return frames;
};